import { NextResponse } from "next/server";
import { getTransporter, fromHeader } from "@/lib/mailer";
import { verifyOtpToken, hashOtp, OTP_TTL_MS } from "@/lib/otp";
import {
  ownerNotificationTemplate,
  confirmationTemplate,
  type SupportedLocale,
} from "@/lib/email-templates";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const LOCALES: SupportedLocale[] = ["en", "bn", "no"];

const ATTEMPT_LIMIT = { capacity: 8, windowMs: OTP_TTL_MS };

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const { token, code, name, email, message, locale } = (body ?? {}) as Record<string, unknown>;

  if (
    typeof token !== "string" ||
    typeof code !== "string" ||
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string"
  ) {
    return NextResponse.json({ ok: false, error: "invalid_input" }, { status: 400 });
  }

  const ip = clientIp(request);
  const ipAttempts = checkRateLimit(`otp-verify:ip:${ip}`, ATTEMPT_LIMIT);
  const emailAttempts = checkRateLimit(
    `otp-verify:email:${email.trim().toLowerCase()}`,
    ATTEMPT_LIMIT
  );
  if (!ipAttempts.allowed || !emailAttempts.allowed) {
    const retryAfterMs = Math.max(ipAttempts.retryAfterMs, emailAttempts.retryAfterMs);
    return NextResponse.json(
      { ok: false, error: "rate_limited", retryAfterMs },
      { status: 429, headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) } }
    );
  }

  const payload = verifyOtpToken(token);
  if (!payload) {
    return NextResponse.json({ ok: false, error: "expired_or_invalid" }, { status: 400 });
  }

  if (payload.email !== email.trim().toLowerCase()) {
    return NextResponse.json({ ok: false, error: "email_mismatch" }, { status: 400 });
  }

  if (hashOtp(code, email) !== payload.otpHash) {
    return NextResponse.json({ ok: false, error: "invalid_code" }, { status: 400 });
  }

  const safeLocale: SupportedLocale = LOCALES.includes(locale as SupportedLocale)
    ? (locale as SupportedLocale)
    : "en";

  const to = process.env.CONTACT_TO_EMAIL || process.env.EMAIL_USER || "";
  const transporter = getTransporter();

  const owner = ownerNotificationTemplate({ name, email, message, locale: safeLocale });
  const confirm = confirmationTemplate({ name, locale: safeLocale });

  try {
    await Promise.all([
      transporter.sendMail({
        from: fromHeader(),
        to,
        replyTo: email,
        subject: owner.subject,
        html: owner.html,
        text: owner.text,
      }),
      transporter.sendMail({
        from: fromHeader(),
        to: email,
        subject: confirm.subject,
        html: confirm.html,
        text: confirm.text,
      }),
    ]);
  } catch (err) {
    console.error("[contact/verify-otp] failed to send emails", err);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
