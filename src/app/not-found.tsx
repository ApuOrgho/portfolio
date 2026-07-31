import Link from "next/link";

// Root-level fallback for the automatic Next.js /_not-found route, which
// renders outside the [locale] segment and therefore skips that layout's
// <html>/<body>. Next.js requires the root layout tree to provide them.
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#08080c] px-6 text-center font-sans text-[#f2f2f7]">
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="text-[#9797a8]">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/" className="font-semibold text-[#8b7cff]">
          Go home
        </Link>
      </body>
    </html>
  );
}
