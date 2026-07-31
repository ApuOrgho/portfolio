import { NextResponse } from "next/server";
import { getTransporter, fromHeader } from "@/lib/mailer";
import { generateOtp, hashOtp, createOtpToken, OTP_TTL_MS } from "@/lib/otp";
import { otpEmailTemplate, type SupportedLocale } from "@/lib/email-templates";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const LOCALES: SupportedLocale[] = ["en", "bn", "no"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Sending email is the expensive/abusable step here, so it's capped hard:
// a handful of codes per IP and per destination address per window.
const IP_LIMIT = { capacity: 5, windowMs: 15 * 60 * 1000 };
const EMAIL_LIMIT = { capacity: 3, windowMs: 30 * 60 * 1000 };

export async function POST(request: Request) {
  const ip = clientIp(request);
  const ipLimit = checkRateLimit(`otp-request:ip:${ip}`, IP_LIMIT);
  if (!ipLimit.allowed) {
    return NextResponse.json(
      { ok: false, error: "rate_limited", retryAfterMs: ipLimit.retryAfterMs },
      { status: 429, headers: { "Retry-After": String(Math.ceil(ipLimit.retryAfterMs / 1000)) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const { name, email, message, locale, honey } = (body ?? {}) as Record<string, unknown>;

  // Honeypot: bots fill every field, humans never see this one. Pretend success.
  if (typeof honey === "string" && honey.length > 0) {
    return NextResponse.json({ ok: true, token: "noop", expiresAt: Date.now() });
  }

  if (
    typeof name !== "string" ||
    name.trim().length < 2 ||
    name.length > 120 ||
    typeof email !== "string" ||
    !EMAIL_RE.test(email) ||
    email.length > 200 ||
    typeof message !== "string" ||
    message.trim().length < 10 ||
    message.length > 5000
  ) {
    return NextResponse.json({ ok: false, error: "invalid_input" }, { status: 400 });
  }

  const emailLimit = checkRateLimit(
    `otp-request:email:${email.trim().toLowerCase()}`,
    EMAIL_LIMIT
  );
  if (!emailLimit.allowed) {
    return NextResponse.json(
      { ok: false, error: "rate_limited", retryAfterMs: emailLimit.retryAfterMs },
      { status: 429, headers: { "Retry-After": String(Math.ceil(emailLimit.retryAfterMs / 1000)) } }
    );
  }

  const safeLocale: SupportedLocale = LOCALES.includes(locale as SupportedLocale)
    ? (locale as SupportedLocale)
    : "en";

  const otp = generateOtp();
  const otpHash = hashOtp(otp, email);
  const exp = Date.now() + OTP_TTL_MS;
  const token = createOtpToken({ email: email.trim().toLowerCase(), otpHash, exp });

  const { subject, html, text } = otpEmailTemplate({ name: name.trim(), otp, locale: safeLocale });

  try {
    await getTransporter().sendMail({
      from: fromHeader(),
      to: email,
      subject,
      html,
      text,
    });
  } catch (err) {
    console.error("[contact/request-otp] failed to send OTP email", err);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, token, expiresAt: exp });
}
