import { NextResponse } from "next/server";
import { getTransporter, fromHeader } from "@/lib/mailer";
import { generateOtp, hashOtp, createOtpToken, OTP_TTL_MS } from "@/lib/otp";
import { otpEmailTemplate, type SupportedLocale } from "@/lib/email-templates";

export const runtime = "nodejs";

const LOCALES: SupportedLocale[] = ["en", "bn", "no"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
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
