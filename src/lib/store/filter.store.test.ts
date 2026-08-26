import { useFilterStore } from "@/lib/store/filter.store";

describe("useFilterStore", () => {
  beforeEach(() => {
    useFilterStore.setState({ categoryId: null, searchQuery: "" });
  });

  it("starts with no category and an empty search query", () => {
    const state = useFilterStore.getState();
    expect(state.categoryId).toBeNull();
    expect(state.searchQuery).toBe("");
  });

  it("setCategory updates categoryId", () => {
    useFilterStore.getState().setCategory("cat_1");
    expect(useFilterStore.getState().categoryId).toBe("cat_1");
  });

  it("setSearchQuery updates searchQuery without touching categoryId", () => {
    useFilterStore.getState().setCategory("cat_1");
    useFilterStore.getState().setSearchQuery("concert");

    const state = useFilterStore.getState();
    expect(state.searchQuery).toBe("concert");
    expect(state.categoryId).toBe("cat_1");
  });

  it("reset clears both category and search query", () => {
    useFilterStore.getState().setCategory("cat_1");
    useFilterStore.getState().setSearchQuery("concert");
    useFilterStore.getState().reset();

    const state = useFilterStore.getState();
    expect(state.categoryId).toBeNull();
    expect(state.searchQuery).toBe("");
  });
});
