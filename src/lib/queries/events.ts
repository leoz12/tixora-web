import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Category, Event, Pagination } from "@/types";
import { eventKeys } from "./queryKeys";

export interface EventsResponse {
  data: Event[];
  pagination: Pagination;
}

export function useEvents(
  page: number = 1,
  limit: number = 12,
  categoryId?: string | null,
  search?: string,
) {
  return useQuery<EventsResponse>({
    queryKey: eventKeys.list(page, limit, categoryId, search),
    queryFn: async () => {
      const response = await api.get<EventsResponse>("/events", {
        params: {
          page,
          limit,
          category_id: categoryId || undefined,
          search: search || undefined,
        },
      });
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: eventKeys.categories(),
    queryFn: async () => {
      const response = await api.get<{ data: Category[] }>("/categories");
      return response.data.data;
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useEventDetail(id: string) {
  return useQuery<Event>({
    queryKey: eventKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<{ data: Event }>(`/events/${id}`);
      return response.data.data;
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}
