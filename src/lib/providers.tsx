'use client';

import { ReactNode, useEffect, useState } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useAuthStore } from '@/lib/store/auth.store';
import { useCurrentUser } from '@/lib/queries/users';
import { User } from '@/types';

// The server already resolved auth state (see getServerUser in
// auth-server.ts, called from layout.tsx) and Header renders off that same
// snapshot via its own `initialUser` prop, so there's nothing to seed here
// that would be visible - this just brings the store in sync. Kept in a
// useEffect (never runs during SSR) so a module-level Zustand store, which
// is shared across concurrent requests on the server, never gets written
// with one visitor's data during another visitor's render.
function AuthHydrator({ initialUser }: { initialUser: User | null }) {
  const { setUser, setLoading, logout } = useAuthStore();

  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
      // Server already confirmed the session - safe to stop loading now.
      setLoading(false);
    }
    // When initialUser is null we must NOT conclude "logged out" yet:
    // getServerUser() uses a plain fetch with no token refresh, so it fails
    // open to null whenever the short-lived access-token cookie is expired,
    // even for a perfectly valid session. Stay in the loading state until
    // the client-side /auth/me check below (which CAN refresh via the axios
    // interceptor) settles - otherwise route guards like ProtectedRoute act
    // on a false "unauthenticated" and bounce the user to /login.
  }, [initialUser, setUser, setLoading]);

  // Client-side auth check. Always runs: when SSR found no user this is the
  // authoritative check (and can recover an expired access token); when SSR
  // did find one this is a silent background reconciliation for a session
  // that changed between the server render and this mount.
  const { data, isError, isFetched } = useCurrentUser(true);

  useEffect(() => {
    if (!isFetched) return;

    if (data) {
      setUser(data);
    } else if (isError) {
      logout();
    }
    // The client check has now settled - whatever it concluded is final.
    setLoading(false);
  }, [data, isError, isFetched, setUser, logout, setLoading]);

  return null;
}

export function Providers({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: User | null;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthHydrator initialUser={initialUser} />
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
