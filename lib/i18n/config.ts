import * as runtime from "./runtime.mjs";
import type { Language } from "./types";

export const { LANGUAGE_STORAGE_KEY, LANGUAGE_EVENT, DEFAULT_LANGUAGE } = runtime as {
  LANGUAGE_STORAGE_KEY: string;
  LANGUAGE_EVENT: string;
  DEFAULT_LANGUAGE: Language;
};

export const languageLabels: Record<Language, string> = {
  ht: "Kreyòl",
  en: "English",
  fr: "Français",
  es: "Español",
};

export const isLanguage = runtime.isLanguage as (value: unknown) => value is Language;
export const languageFromLocale = runtime.languageFromLocale as (locale: string | undefined) => Language | undefined;
export const readStoredLanguage = runtime.readStoredLanguage as (storage: Storage | undefined) => Language | undefined;
export const detectInitialLanguage = runtime.detectInitialLanguage as (storage: Storage | undefined, browserLanguages?: readonly string[]) => Language;