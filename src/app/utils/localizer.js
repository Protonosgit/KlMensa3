// Contains ai written code!!

import { useCallback, useEffect, useState, useMemo } from "react";
import { getCookie, setCookie } from "@/app/utils/client-system";
import en from "./locales/en.json";
import de from "./locales/de.json";

const MESSAGES = { en, de };

function flatten(obj, prefix = "") {
  return Object.entries(obj).reduce((acc, [k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object") Object.assign(acc, flatten(v, key));
    else acc[key] = v;
    return acc;
  }, {});
}

export function useLocale(defaultLocale = "en") {
  const [locale, setLocale] = useState(() => {
    const settingsString = getCookie("settings")?.trim();
    const c = JSON.parse(settingsString)?.language || defaultLocale;
    if (c) return c;
    const nav = typeof navigator !== "undefined" ? navigator.language?.slice(0, 2) : null;
    return nav && MESSAGES[nav] ? nav : defaultLocale;
  });

  const flat = useMemo(() => {
    const msgs = MESSAGES[locale] || MESSAGES.en;
    return flatten(msgs);
  }, [locale]);

  const t = useCallback((key) => {
    return flat[key] ?? key;
  }, [flat]);

  return { t, locale, setLocale };
}