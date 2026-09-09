export const supportedLanguages = ["ht", "en", "fr", "es"];
export const LANGUAGE_STORAGE_KEY = "celoht.language";
export const LANGUAGE_EVENT = "celoht-language-change";
export const DEFAULT_LANGUAGE = "ht";

export function isLanguage(value) {
  return typeof value === "string" && supportedLanguages.includes(value);
}

export function languageFromLocale(locale) {
  const code = locale?.toLowerCase().split("-")[0];
  return isLanguage(code) ? code : undefined;
}

export function readStoredLanguage(storage) {
  const value = storage?.getItem(LANGUAGE_STORAGE_KEY);
  return isLanguage(value) ? value : undefined;
}

export function detectInitialLanguage(storage, browserLanguages = []) {
  const stored = storage?.getItem(LANGUAGE_STORAGE_KEY);
  if (stored !== undefined && stored !== null) return isLanguage(stored) ? stored : DEFAULT_LANGUAGE;
  return languageFromLocale(browserLanguages[0]) ?? DEFAULT_LANGUAGE;
}