// Query keys are what React Query uses to match a fetch against a cache
// entry and to decide what invalidateQueries() sweeps. A key that isn't
// stable/deep-equal across calls with the same arguments silently breaks
// caching and invalidation - the bug won't show up as a type error.
import { eventKeys, orderKeys, userKeys } from "@/lib/queries/queryKeys";

describe("eventKeys", () => {
  it("nests list/detail keys under all()", () => {
    expect(eventKeys.lists()).toEqual(["events", "list"]);
    expect(eventKeys.details()).toEqual(["events", "detail"]);
  });

  it("list() is deep-equal for identical arguments", () => {
    expect(eventKeys.list(1, 12, "cat_1", "jazz")).toEqual(
      eventKeys.list(1, 12, "cat_1", "jazz"),
    );
  });

  it("list() differs when any argument differs", () => {
    expect(eventKeys.list(1, 12)).not.toEqual(eventKeys.list(2, 12));
  });

  it("detail() is scoped under details() by id", () => {
    expect(eventKeys.detail("evt_1")).toEqual(["events", "detail", "evt_1"]);
  });
});

describe("orderKeys", () => {
  it("list() is deep-equal for identical arguments", () => {
    expect(orderKeys.list(1, "paid")).toEqual(orderKeys.list(1, "paid"));
  });

  it("list() differs when status differs", () => {
    expect(orderKeys.list(1, "paid")).not.toEqual(orderKeys.list(1, "pending"));
  });

  it("detail() is scoped under details() by id", () => {
    expect(orderKeys.detail("ord_1")).toEqual(["orders", "detail", "ord_1"]);
  });
});

describe("userKeys", () => {
  it("me() and stats() are distinct keys under all()", () => {
    expect(userKeys.me()).toEqual(["users", "me"]);
    expect(userKeys.stats()).toEqual(["users", "stats"]);
  });
});
