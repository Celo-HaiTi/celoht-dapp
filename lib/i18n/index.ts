import { en } from "./translations/en";
import { es } from "./translations/es";
import { fr } from "./translations/fr";
import { ht } from "./translations/ht";
import type { Language, TranslationDictionary, TranslationKey, TranslationValues } from "./types";

export const translations: Record<Language, TranslationDictionary> = { ht, en, fr, es };

export function translate(language: Language, key: TranslationKey, values?: TranslationValues): string {
  const value = translations[language][key] ?? translations.ht[key];
  if (!value) {
    if (process.env.NODE_ENV !== "production") console.warn(`[i18n] Missing translation: ${key}`);
    return key;
  }
  return values ? value.replace(/\{(\w+)\}/g, (_, name: string) => String(values[name] ?? `{${name}}`)) : value;
}

export * from "./config";
export * from "./types";