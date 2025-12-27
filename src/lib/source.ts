import { docs } from "@/.source/server";
import { loader } from "fumadocs-core/source";
import { defineI18n } from "fumadocs-core/i18n";

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
  i18n: defineI18n({
    languages: ["en", "zh"],
    defaultLanguage: "en",
  }),
});
