import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://owlab.ai";

export const metadata: Metadata = {
  title: {
    default: "AI Space - Agentic Documentation Framework",
    template: "%s | AI Space",
  },
  description:
    "Build intelligent, self-evolving documentation with AI agents. A futuristic framework for designing AI research laboratories and technical documentation.",
  keywords: [
    "AI",
    "documentation",
    "artificial intelligence",
    "lab design",
    "agentic",
    "Next.js",
    "React",
  ],
  authors: [{ name: "OWLAB Team" }],
  creator: "OWLAB",
  publisher: "OWLAB",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "zh_CN",
    url: siteUrl,
    siteName: "AI Space",
    title: "AI Space - Agentic Documentation Framework",
    description:
      "Build intelligent, self-evolving documentation with AI agents. Design AI research laboratories with intelligent assistance.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI Space - Agentic Documentation Framework",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Space - Agentic Documentation Framework",
    description:
      "Build intelligent, self-evolving documentation with AI agents.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f5" },
    { media: "(prefers-color-scheme: dark)", color: "#141413" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Lora:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[var(--neon-cyan)] focus:text-[var(--background)] focus:font-medium"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
