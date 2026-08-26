// `window.location` is unforgeable per spec (can't be reassigned or mocked,
// in jsdom or in a real browser) - a hard navigation is isolated in its own
// module purely so tests can `jest.mock("@/lib/navigate")` instead of
// fighting that. Doesn't change runtime behavior.
export function hardNavigate(url: string): void {
  window.location.href = url;
}
