import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://owlab.ai";

export const metadata: Metadata = {
  title: {
    default: "猫头鹰实验室 - 建设和运营标准",
    template: "%s | 猫头鹰实验室",
  },
  description:
    "猫头鹰实验室（OWL）是一个模块化知识库，帮助建设和运营创新学习空间。点燃好奇心，培养有潜力改变世界的未来科学创新者。",
  keywords: [
    "创新实验室",
    "STEAM教育",
    "创客空间",
    "科学教育",
    "OWL",
    "猫头鹰实验室",
    "创新学习",
  ],
  authors: [{ name: "OWLAB Team" }],
  creator: "OWLAB",
  publisher: "OWLAB",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "zh_CN",
    alternateLocale: "en_US",
    url: siteUrl,
    siteName: "猫头鹰实验室",
    title: "猫头鹰实验室 - 建设和运营标准",
    description:
      "猫头鹰实验室（OWL）是一个模块化知识库，帮助建设和运营创新学习空间。点燃好奇心，培养有潜力改变世界的未来科学创新者。",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "猫头鹰实验室 - 建设和运营标准",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "猫头鹰实验室 - 建设和运营标准",
    description:
      "猫头鹰实验室（OWL）是一个模块化知识库，帮助建设和运营创新学习空间。",
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
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "猫头鹰实验室",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF8F5" },
    { media: "(prefers-color-scheme: dark)", color: "#0D0D12" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
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
