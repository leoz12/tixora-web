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
    }
    setLoading(false);
  }, [initialUser, setUser, setLoading]);

  // Silent background reconciliation: catches the rare case where the SSR
  // check above failed/timed out, or the session changed between that
  // server render and this mount. Never flips isLoading back to true, so it
  // can't bring the skeleton back.
  const { data, isError, isFetched } = useCurrentUser(true);

  useEffect(() => {
    if (!isFetched) return;

    if (data) {
      setUser(data);
    } else if (isError) {
      logout();
    }
  }, [data, isError, isFetched, setUser, logout]);

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
