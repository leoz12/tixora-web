jest.mock("@/lib/api", () => ({
  __esModule: true,
  default: { post: jest.fn() },
}));
jest.mock("@/lib/navigate", () => ({
  __esModule: true,
  hardNavigate: jest.fn(),
}));

import api from "@/lib/api";
import { hardNavigate } from "@/lib/navigate";
import { initiateGoogleLogin, logoutRequest } from "@/lib/auth";

const mockedPost = api.post as jest.Mock;
const mockedHardNavigate = jest.mocked(hardNavigate);

describe("initiateGoogleLogin", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    mockedHardNavigate.mockClear();
    process.env = {
      ...ORIGINAL_ENV,
      NEXT_PUBLIC_GOOGLE_CLIENT_ID: "test-client-id",
      NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URI: "http://localhost:3000/api/auth/callback",
    };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
    jest.restoreAllMocks();
  });

  it("navigates to Google's OAuth endpoint with client id, redirect uri, and scope", () => {
    initiateGoogleLogin();

    expect(mockedHardNavigate).toHaveBeenCalledTimes(1);
    const url = new URL(mockedHardNavigate.mock.calls[0][0]);
    expect(url.origin + url.pathname).toBe(
      "https://accounts.google.com/o/oauth2/v2/auth",
    );
    expect(url.searchParams.get("client_id")).toBe("test-client-id");
    expect(url.searchParams.get("redirect_uri")).toBe(
      "http://localhost:3000/api/auth/callback",
    );
    expect(url.searchParams.get("response_type")).toBe("code");
    expect(url.searchParams.get("scope")).toBe("openid email profile");
  });

  it("does not navigate when NEXT_PUBLIC_GOOGLE_CLIENT_ID is missing", () => {
    delete process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    jest.spyOn(console, "error").mockImplementation(() => {});

    initiateGoogleLogin();

    expect(mockedHardNavigate).not.toHaveBeenCalled();
  });

  it("does not navigate when NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URI is missing", () => {
    delete process.env.NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URI;
    jest.spyOn(console, "error").mockImplementation(() => {});

    initiateGoogleLogin();

    expect(mockedHardNavigate).not.toHaveBeenCalled();
  });
});

describe("logoutRequest", () => {
  beforeEach(() => {
    mockedPost.mockReset();
  });

  it("calls POST /auth/logout", async () => {
    mockedPost.mockResolvedValueOnce({});
    await logoutRequest();
    expect(mockedPost).toHaveBeenCalledWith("/auth/logout");
  });

  it("swallows a failed logout request instead of throwing", async () => {
    mockedPost.mockRejectedValueOnce(new Error("network error"));
    jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(logoutRequest()).resolves.toBeUndefined();
  });
});
