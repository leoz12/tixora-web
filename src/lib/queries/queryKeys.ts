export const eventKeys = {
  all: ["events"] as const,
  lists: () => [...eventKeys.all, "list"] as const,
  list: (
    page: number,
    limit: number,
    categoryId?: string | null,
    search?: string,
  ) => [...eventKeys.lists(), { page, limit, categoryId, search }] as const,
  details: () => [...eventKeys.all, "detail"] as const,
  detail: (id: string) => [...eventKeys.details(), id] as const,
  categories: () => [...eventKeys.all, "categories"] as const,
};

export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (page: number, status?: string) =>
    [...orderKeys.lists(), { page, status }] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
};

export const userKeys = {
  all: ["users"] as const,
  me: () => [...userKeys.all, "me"] as const,
  stats: () => [...userKeys.all, "stats"] as const,
};
