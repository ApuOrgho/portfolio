// In-memory token-bucket rate limiter.
//
// Each key (e.g. "otp-request:<ip>") gets a bucket that holds `capacity`
// tokens and refills gradually over `windowMs`. Every check consumes one
// token; once the bucket is empty, requests are rejected until enough time
// has passed to refill at least one token. This smooths out bursts (a token
// bucket, unlike a fixed window, never fully "resets" and re-opens the gate
// all at once - it drips back in).
//
// Scope: per-process memory. On a single Docker container this limits
// exactly what it should. On serverless (Vercel), each warm instance keeps
// its own buckets, so a determined distributed attacker can exceed the
// nominal limit - this is a best-effort layer against casual bots and
// scripted abuse, not a substitute for a shared store (Upstash/Redis) if
// this ever needs to withstand real attack traffic.

interface Bucket {
  tokens: number;
  lastRefill: number;
}

interface RateLimitOptions {
  capacity: number;
  windowMs: number;
}

const buckets = new Map<string, Bucket>();

const MAX_TRACKED_KEYS = 5000;
let callsSinceSweep = 0;

function sweep(staleAfterMs: number) {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (now - bucket.lastRefill > staleAfterMs) {
      buckets.delete(key);
    }
  }
}

export function checkRateLimit(
  key: string,
  { capacity, windowMs }: RateLimitOptions
): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();
  const refillRatePerMs = capacity / windowMs;

  let bucket = buckets.get(key);
  if (!bucket) {
    bucket = { tokens: capacity, lastRefill: now };
    buckets.set(key, bucket);
  }

  const elapsed = now - bucket.lastRefill;
  bucket.tokens = Math.min(capacity, bucket.tokens + elapsed * refillRatePerMs);
  bucket.lastRefill = now;

  callsSinceSweep += 1;
  if (callsSinceSweep >= 200 || buckets.size > MAX_TRACKED_KEYS) {
    callsSinceSweep = 0;
    sweep(windowMs * 2);
  }

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    return { allowed: true, retryAfterMs: 0 };
  }

  const missing = 1 - bucket.tokens;
  const retryAfterMs = Math.ceil(missing / refillRatePerMs);
  return { allowed: false, retryAfterMs };
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
