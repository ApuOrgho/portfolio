import { createHmac, randomInt, timingSafeEqual } from "crypto";

export const OTP_TTL_MS = 10 * 60 * 1000;

function secret(): string {
  const value = process.env.CONTACT_TOKEN_SECRET;
  if (!value) throw new Error("CONTACT_TOKEN_SECRET is not set");
  return value;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function generateOtp(): string {
  return randomInt(100000, 1000000).toString();
}

export function hashOtp(otp: string, email: string): string {
  return createHmac("sha256", secret())
    .update(`${email.trim().toLowerCase()}:${otp.trim()}`)
    .digest("hex");
}

export interface OtpTokenPayload {
  email: string;
  otpHash: string;
  exp: number;
}

// Stateless, signed token: encodes who the code was sent to, a hash of the
// code (never the code itself) and an expiry, so verification needs no
// server-side session store - a requirement on serverless deploys.
export function createOtpToken(payload: OtpTokenPayload): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
}

export function verifyOtpToken(token: string): OtpTokenPayload | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;

  const expected = sign(body);
  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expected);
  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as OtpTokenPayload;
    if (typeof payload.exp !== "number" || Date.now() > payload.exp) return null;
    if (typeof payload.email !== "string" || typeof payload.otpHash !== "string") return null;
    return payload;
  } catch {
    return null;
  }
}
