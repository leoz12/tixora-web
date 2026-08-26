import { create } from "zustand";

interface FilterStore {
  categoryId: string | null;
  searchQuery: string;
  setCategory: (categoryId: string | null) => void;
  setSearchQuery: (query: string) => void;
  reset: () => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  categoryId: null,
  searchQuery: "",
  setCategory: (categoryId) => set({ categoryId }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  reset: () => set({ categoryId: null, searchQuery: "" }),
}));
