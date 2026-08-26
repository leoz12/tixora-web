import { useAuthStore } from "@/lib/store/auth.store";
import { User } from "@/types";

const user: User = {
  id: "u1",
  email: "user@example.com",
  name: "Test User",
  avatar_url: "https://example.com/avatar.png",
};

describe("useAuthStore", () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, isAuthenticated: false, isLoading: true });
  });

  it("starts unauthenticated and loading", () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(true);
  });

  it("setUser marks the store authenticated", () => {
    useAuthStore.getState().setUser(user);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(user);
    expect(state.isAuthenticated).toBe(true);
  });

  it("setLoading toggles isLoading independently of auth state", () => {
    useAuthStore.getState().setLoading(false);
    expect(useAuthStore.getState().isLoading).toBe(false);
  });

  it("logout clears the user and isAuthenticated", () => {
    useAuthStore.getState().setUser(user);
    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
