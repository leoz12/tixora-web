// next-intl ships ESM-only and next/jest's transformIgnorePatterns can only be
// appended to, not overridden, so its real ESM build can never be transformed
// by Jest. This mock stands in for it in tests via jest.config.mjs's
// moduleNameMapper and implements just enough of the API — a message-lookup
// useTranslations plus a context-providing NextIntlClientProvider — for
// component tests to render translated text.
import { createContext, ReactNode, useContext } from "react";

type Messages = Record<string, Record<string, string>>;

const MessagesContext = createContext<Messages>({});

export function NextIntlClientProvider({
  messages,
  children,
}: {
  locale?: string;
  messages: Messages;
  children: ReactNode;
}) {
  return (
    <MessagesContext.Provider value={messages}>
      {children}
    </MessagesContext.Provider>
  );
}

export function useTranslations(namespace: string) {
  const messages = useContext(MessagesContext);
  return (key: string, values?: Record<string, string | number>) => {
    let message = messages[namespace]?.[key] ?? `${namespace}.${key}`;
    if (values) {
      for (const [k, v] of Object.entries(values)) {
        message = message.replace(`{${k}}`, String(v));
      }
    }
    return message;
  };
}
