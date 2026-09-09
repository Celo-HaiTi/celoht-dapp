import type { Language } from "./types";

const localeMap: Record<Language, string> = { ht: "ht-HT", en: "en-US", fr: "fr-FR", es: "es-ES" };

export function localeFor(language: Language) {
  return localeMap[language];
}

export function formatLocalizedNumber(value: number, language: Language, options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat(localeFor(language), options).format(value);
}

export function formatLocalizedDate(value: Date | number, language: Language, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(localeFor(language), options).format(value);
}