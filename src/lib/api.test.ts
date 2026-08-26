jest.mock("@/lib/navigate", () => ({
  __esModule: true,
  hardNavigate: jest.fn(),
}));

import MockAdapter from "axios-mock-adapter";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/store/auth.store";
import { hardNavigate } from "@/lib/navigate";

const mockedHardNavigate = hardNavigate as jest.Mock;

function setCookie(value: string | null) {
  // Expire whatever's there first - jsdom's cookie jar merges by name, it
  // doesn't let a second `document.cookie = "name=..."` assignment overwrite
  // in the same tick reliably across test runs.
  document.cookie = "tx_csrf_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
  if (value !== null) {
    document.cookie = `tx_csrf_token=${value}`;
  }
}

describe("api - CSRF header (double-submit cookie)", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(api);
    setCookie(null);
  });

  afterEach(() => {
    mock.restore();
  });

  it("attaches X-CSRF-Token on a state-changing request when the cookie is present", async () => {
    setCookie("abc123");
    mock.onPost("/orders").reply((config) => {
      expect(config.headers?.["X-CSRF-Token"]).toBe("abc123");
      return [200, {}];
    });

    await api.post("/orders", {});
  });

  it("does not attach X-CSRF-Token to a GET request", async () => {
    setCookie("abc123");
    mock.onGet("/events").reply((config) => {
      expect(config.headers?.["X-CSRF-Token"]).toBeUndefined();
      return [200, {}];
    });

    await api.get("/events");
  });

  it("omits the header on a state-changing request when there's no cookie yet", async () => {
    mock.onPost("/orders").reply((config) => {
      expect(config.headers?.["X-CSRF-Token"]).toBeUndefined();
      return [200, {}];
    });

    await api.post("/orders", {});
  });
});

describe("api - 401 refresh-and-retry flow", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(api);
    mockedHardNavigate.mockClear();
    useAuthStore.setState({
      user: { id: "u1", email: "a@b.com", name: "A", avatar_url: "" },
      isAuthenticated: true,
      isLoading: false,
    });
    window.history.pushState({}, "", "/orders");
  });

  afterEach(() => {
    mock.restore();
  });

  it("refreshes exactly once for a burst of concurrent 401s and retries every request", async () => {
    mock.onGet("/orders").reply((config) => {
      if ((config as { _retry?: boolean })._retry) return [200, { data: "ok" }];
      return [401];
    });
    mock.onPost("/auth/refresh").reply(200);

    const [first, second] = await Promise.all([
      api.get("/orders"),
      api.get("/orders"),
    ]);

    expect(first.data).toEqual({ data: "ok" });
    expect(second.data).toEqual({ data: "ok" });
    expect(
      mock.history.post.filter((r) => r.url === "/auth/refresh"),
    ).toHaveLength(1);
  });

  it("logs out and hard-navigates to /login when refresh fails on a normal request", async () => {
    mock.onGet("/orders").reply(401);
    mock.onPost("/auth/refresh").reply(401);

    await expect(api.get("/orders")).rejects.toBeTruthy();

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(mockedHardNavigate).toHaveBeenCalledWith("/login");
  });

  it("does not navigate when the failing request is /auth/me (anonymous visitor case)", async () => {
    mock.onGet("/auth/me").reply(401);
    mock.onPost("/auth/refresh").reply(401);

    await expect(api.get("/auth/me")).rejects.toBeTruthy();

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(mockedHardNavigate).not.toHaveBeenCalled();
  });

  it("does not navigate again when already on /login", async () => {
    window.history.pushState({}, "", "/login");
    mock.onGet("/orders").reply(401);
    mock.onPost("/auth/refresh").reply(401);

    await expect(api.get("/orders")).rejects.toBeTruthy();

    expect(mockedHardNavigate).not.toHaveBeenCalled();
  });

  it("retries only once, even if the refreshed request keeps failing", async () => {
    mock.onGet("/orders").reply(401);
    mock.onPost("/auth/refresh").reply(200);

    await expect(api.get("/orders")).rejects.toBeTruthy();

    expect(
      mock.history.post.filter((r) => r.url === "/auth/refresh"),
    ).toHaveLength(1);
    expect(
      mock.history.get.filter((r) => r.url === "/orders"),
    ).toHaveLength(2); // original attempt + one retry, no more
  });

  it("does not trigger a refresh loop when /auth/refresh itself 401s directly", async () => {
    mock.onPost("/auth/refresh").reply(401);

    await expect(api.post("/auth/refresh")).rejects.toBeTruthy();

    expect(
      mock.history.post.filter((r) => r.url === "/auth/refresh"),
    ).toHaveLength(1);
  });
});
