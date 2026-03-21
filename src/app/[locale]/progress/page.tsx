import { getTranslations } from "next-intl/server";
import { ThreeEProgressPanel } from "@/features/doc-viewer/ThreeEProgressPanel";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "threeE" });
  return {
    title: t("title"),
  };
}

export default async function ProgressPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "threeE" });

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">{t("pageTitle")}</h1>
          <p className="text-[var(--muted-foreground)] text-sm">
            {t("pageDescription")}
          </p>
        </div>

        {/* Main radar panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ThreeEProgressPanel locale={locale} />

          {/* Info card */}
          <div className="bg-[var(--glass-bg)] rounded-xl border border-[var(--glass-border)] p-6 h-fit">
            <h2 className="font-semibold mb-4">{t("aboutTitle")}</h2>
            <div className="space-y-4">
              {(["enlighten", "empower", "engage"] as const).map((dim) => (
                <div key={dim} className="flex gap-3">
                  <div
                    className="w-1 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor:
                        dim === "enlighten"
                          ? "#F59E0B"
                          : dim === "empower"
                            ? "#00D9FF"
                            : "#10B981",
                    }}
                  />
                  <div>
                    <h3 className="text-sm font-medium mb-1">
                      {t(`dimensions.${dim}`)}
                    </h3>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {t(`descriptions.${dim}`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Compact variant preview */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">{t("compactTitle")}</h2>
          <div className="max-w-xs">
            <ThreeEProgressPanel compact locale={locale} />
          </div>
        </div>
      </div>
    </main>
  );
}
