"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { messages, type Locale, type MessageKey } from "@/lib/i18n/messages";

const DEFAULT_STORAGE_KEY = "safran-locale";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (key: MessageKey, vars?: Record<string, string | number>) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function readStoredLocale(storageKey: string, fallback: Locale): Locale {
  if (typeof window === "undefined") return fallback;
  const stored = window.localStorage.getItem(storageKey);
  if (stored === "en" || stored === "de") return stored;
  return fallback;
}

/**
 * Storefront and admin keep separate preferences: the public site defaults to
 * German, the back office to English.
 */
export function LocaleProvider({
  children,
  defaultLocale = "de",
  storageKey = DEFAULT_STORAGE_KEY,
}: {
  children: ReactNode;
  defaultLocale?: Locale;
  storageKey?: string;
}) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    const next = readStoredLocale(storageKey, defaultLocale);
    setLocaleState(next);
    document.documentElement.lang = next === "en" ? "en" : "de-CH";
  }, [defaultLocale, storageKey]);

  const setLocale = useCallback(
    (next: Locale) => {
      setLocaleState(next);
      window.localStorage.setItem(storageKey, next);
      document.documentElement.lang = next === "en" ? "en" : "de-CH";
    },
    [storageKey],
  );

  const toggleLocale = useCallback(() => {
    setLocale(locale === "de" ? "en" : "de");
  }, [locale, setLocale]);

  const t = useCallback(
    (key: MessageKey, vars?: Record<string, string | number>) => {
      let text: string =
        messages[locale][key] ?? messages.de[key] ?? key;
      if (vars) {
        for (const [name, value] of Object.entries(vars)) {
          text = text.replaceAll(`{${name}}`, String(value));
        }
      }
      return text;
    },
    [locale],
  );

  const value = useMemo(
    () => ({ locale, setLocale, toggleLocale, t }),
    [locale, setLocale, toggleLocale, t],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}
