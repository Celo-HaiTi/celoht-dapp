"use client";

import { createContext, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { DEFAULT_LANGUAGE, LANGUAGE_EVENT, LANGUAGE_STORAGE_KEY, detectInitialLanguage, isLanguage } from "./config";
import { translate } from "./index";
import type { Language, TranslationKey, TranslationValues } from "./types";

type I18nContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, values?: TranslationValues) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const language = useSyncExternalStore(subscribeLanguage, getLanguageSnapshot, getLanguageServerSnapshot);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  function setLanguage(next: Language) {
    if (!isLanguage(next)) return;
    localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
    document.documentElement.lang = next;
    window.dispatchEvent(new Event(LANGUAGE_EVENT));
  }

  const value = useMemo<I18nContextValue>(() => ({ language, setLanguage, t: (key, values) => translate(language, key, values) }), [language]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

function subscribeLanguage(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(LANGUAGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(LANGUAGE_EVENT, onChange);
  };
}

function getLanguageSnapshot(): Language {
  return detectInitialLanguage(window.localStorage, navigator.languages);
}

function getLanguageServerSnapshot(): Language {
  return DEFAULT_LANGUAGE;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used within I18nProvider");
  return context;
}