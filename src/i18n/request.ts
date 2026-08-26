import { getRequestConfig } from "next-intl/server";
import en from "../../messages/en.json";

// Single default locale for now — no URL-based locale routing yet.
// Add locales to this map (and to `messages/`) when translations beyond
// English are ready.
const messagesByLocale = { en } as const;

export const defaultLocale = "en";
export type Locale = keyof typeof messagesByLocale;

export default getRequestConfig(async () => {
  const locale: Locale = defaultLocale;

  return {
    locale,
    messages: messagesByLocale[locale],
  };
});
