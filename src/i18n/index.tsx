import { createContext, useContext, useMemo } from "react";
import type { Locale, TranslationDictionary } from "./types";
import { en } from "./en";
import { tr } from "./tr";

const dictionaries: Record<Locale, TranslationDictionary> = { en, tr };

interface I18nContextValue {
  locale: Locale;
  t: TranslationDictionary;
}

const I18nContext = createContext<I18nContextValue>({
  locale: "en",
  t: en,
});

export function I18nProvider({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  const value = useMemo(
    () => ({ locale, t: dictionaries[locale] }),
    [locale],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  return useContext(I18nContext);
}

/** For use outside React components (e.g., in hooks that read from Zustand stores) */
export function getTranslation(locale: Locale): TranslationDictionary {
  return dictionaries[locale];
}

export type { Locale, TranslationDictionary };
