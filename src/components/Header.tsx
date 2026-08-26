"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/lib/store/auth.store";
import { logoutRequest } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import LogInIcon from "@/components/icons/LogInIcon";
import LogOutIcon from "@/components/icons/LogOutIcon";
import { User } from "@/types";

function TixoraMark() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect width="26" height="26" rx="8" fill="var(--color-blue-600)" />
      <path
        d="M6.5 13a2 2 0 0 1 0-4V7a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v2a2 2 0 0 1 0 4v2a2 2 0 0 1 0 4v2a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-2a2 2 0 0 1 0-4Z"
        fill="white"
        fillOpacity="0.95"
      />
      <path
        d="M15 6.5v13"
        stroke="var(--color-blue-600)"
        strokeWidth="1.4"
        strokeDasharray="1.8 2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UserAvatar({ name, avatarUrl }: { name?: string; avatarUrl?: string }) {
  const initial = name?.charAt(0).toUpperCase() ?? "?";

  return (
    <Avatar className="ring-2 ring-blue-100 after:hidden">
      {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
      <AvatarFallback delay={avatarUrl ? 400 : 0} className="bg-blue-600 text-sm font-bold text-white">
        {initial}
      </AvatarFallback>
    </Avatar>
  );
}

export default function Header({ initialUser }: { initialUser: User | null }) {
  const t = useTranslations("Header");
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  // The store starts as "not hydrated yet" on every mount (see auth.store.ts)
  // and only catches up a moment later (providers.tsx's AuthHydrator). Until
  // then, fall back to the snapshot the server already resolved via cookies
  // - layout.tsx renders this same prop, so server and client agree on the
  // very first paint and there's nothing to flash between.
  const effectiveUser = isLoading ? initialUser : user;
  const isAuthenticated = !!effectiveUser;

  const handleLogout = async () => {
    await logoutRequest();
    logout();
    setMenuOpen(false);
    router.push("/");
  };

  const links = [
    { href: "/", label: t("events") },
    ...(isAuthenticated ? [{ href: "/orders", label: t("myOrders") }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-blue-900"
        >
          <TixoraMark />
          Tixora
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-semibold transition-colors hover:text-blue-700",
                pathname === link.href ? "text-blue-700" : "text-ink-500",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          {effectiveUser ? (
            <>
              <Link href="/profile" className="flex items-center gap-2">
                <UserAvatar name={effectiveUser.name} avatarUrl={effectiveUser.avatar_url} />
                <span className="text-sm font-medium text-ink-700">
                  {effectiveUser.name}
                </span>
              </Link>
              <Button variant="secondary" onClick={handleLogout}>
                <LogOutIcon className="h-4 w-4" />
                {t("logout")}
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button variant="primary">
                <LogInIcon className="h-4 w-4" />
                {t("signIn")}
              </Button>
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-10 w-10 items-center justify-center text-blue-700 md:hidden"
          aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
          aria-expanded={menuOpen}
        >
          <span className="relative block h-4 w-6">
            <span
              className={cn(
                "absolute left-0 h-0.5 w-6 bg-current transition-all",
                menuOpen ? "top-2 rotate-45" : "top-0",
              )}
            />
            <span
              className={cn(
                "absolute left-0 top-2 h-0.5 w-6 bg-current transition-opacity",
                menuOpen && "opacity-0",
              )}
            />
            <span
              className={cn(
                "absolute left-0 h-0.5 w-6 bg-current transition-all",
                menuOpen ? "top-2 -rotate-45" : "top-4",
              )}
            />
          </span>
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-line bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "rounded-lg px-2 py-2.5 text-sm font-semibold",
                  pathname === link.href ? "text-blue-700" : "text-ink-700",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 border-t border-line pt-4">
            {effectiveUser ? (
              <div className="flex items-center justify-between">
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2"
                >
                  <UserAvatar name={effectiveUser.name} avatarUrl={effectiveUser.avatar_url} />
                  <span className="text-sm font-medium text-ink-700">
                    {effectiveUser.name}
                  </span>
                </Link>
                <Button variant="secondary" onClick={handleLogout}>
                  {t("logout")}
                </Button>
              </div>
            ) : (
              <Link href="/login" onClick={() => setMenuOpen(false)}>
                <Button variant="primary" fullWidth>
                  <LogInIcon className="h-4 w-4" />
                  {t("signIn")}
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
