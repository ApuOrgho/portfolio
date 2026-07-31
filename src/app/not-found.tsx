import Link from "next/link";

// Root-level fallback for the automatic Next.js /_not-found route, which
// renders outside the [locale] segment and therefore skips that layout's
// <html>/<body>. Next.js requires the root layout tree to provide them.
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body
        style={{
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.75rem",
          fontFamily: "system-ui, sans-serif",
          background: "#08080c",
          color: "#f2f2f7",
          textAlign: "center",
          padding: "1.5rem",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Page not found</h1>
        <p style={{ color: "#9797a8" }}>
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/" style={{ color: "#8b7cff", fontWeight: 600 }}>
          Go home
        </Link>
      </body>
    </html>
  );
}
