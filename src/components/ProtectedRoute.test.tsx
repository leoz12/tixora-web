import { screen } from "@testing-library/react";
import { renderWithIntl } from "@/test-utils/render";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuthStore } from "@/lib/store/auth.store";

const push = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

describe("ProtectedRoute", () => {
  beforeEach(() => {
    push.mockClear();
    useAuthStore.setState({ user: null, isAuthenticated: false, isLoading: true });
  });

  it("shows a session-checking spinner while auth is still loading", () => {
    useAuthStore.setState({ isLoading: true, isAuthenticated: false });
    renderWithIntl(
      <ProtectedRoute>
        <div>Secret content</div>
      </ProtectedRoute>,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.queryByText("Secret content")).not.toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });

  it("redirects to /login once loading finishes and the user isn't authenticated", () => {
    useAuthStore.setState({ isLoading: false, isAuthenticated: false });
    renderWithIntl(
      <ProtectedRoute>
        <div>Secret content</div>
      </ProtectedRoute>,
    );

    expect(push).toHaveBeenCalledWith("/login");
    expect(screen.queryByText("Secret content")).not.toBeInTheDocument();
  });

  it("renders children once loading finishes and the user is authenticated", () => {
    useAuthStore.setState({ isLoading: false, isAuthenticated: true });
    renderWithIntl(
      <ProtectedRoute>
        <div>Secret content</div>
      </ProtectedRoute>,
    );

    expect(screen.getByText("Secret content")).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });
});
