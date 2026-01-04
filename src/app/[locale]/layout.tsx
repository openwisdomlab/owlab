import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/i18n";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { SearchDialog } from "@/components/search";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { ToastProvider } from "@/components/ui/Toast";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { EmotionProvider } from "@/components/providers/EmotionProvider";
import { PWAUpdatePrompt } from "@/components/pwa/PWAUpdatePrompt";
import { OfflineIndicator } from "@/components/pwa/OfflineIndicator";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeProvider defaultTheme="dark">
        <EmotionProvider>
          <ToastProvider>
            <div className="min-h-screen flex flex-col">
              <Header locale={locale as Locale} />
              <MobileNav locale={locale as Locale} />
              <SearchDialog locale={locale as Locale} />
              <OfflineIndicator />
              <PWAUpdatePrompt />
              <main id="main-content" className="flex-1" tabIndex={-1}>
                <ErrorBoundary>{children}</ErrorBoundary>
              </main>
            </div>
          </ToastProvider>
        </EmotionProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
