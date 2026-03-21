import Link from "next/link";
import { defaultLocale } from "@/i18n";

export default function RootNotFound() {
  return (
    <html lang={defaultLocale}>
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          color: "#e5e5e5",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h1
            style={{
              fontSize: "6rem",
              fontWeight: "bold",
              background: "linear-gradient(135deg, #06b6d4, #8b5cf6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              margin: "0 0 1rem",
            }}
          >
            404
          </h1>
          <p style={{ fontSize: "1.25rem", marginBottom: "2rem", color: "#a3a3a3" }}>
            Page Not Found
          </p>
          <Link
            href={`/${defaultLocale}`}
            style={{
              display: "inline-block",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.5rem",
              background: "linear-gradient(135deg, #06b6d4, #8b5cf6)",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Go Home
          </Link>
        </div>
      </body>
    </html>
  );
}
