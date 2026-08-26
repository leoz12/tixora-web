import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import api from "@/lib/api";
import { Order, Pagination } from "@/types";
import { orderKeys } from "./queryKeys";

export interface CreateOrderRequest {
  event_id: string;
  quantity: number;
  buyer_email: string;
  buyer_name: string;
}

export interface OrderResponse {
  order_id: string;
  event_id: string;
  event_title: string;
  quantity: number;
  total_price: number;
  status: "pending" | "paid" | "expired" | "cancelled";
  ticket_reference: string;
  payment_url: string;
  snap_token: string;
  purchased_at: string; // ISO 8601
}

export interface OrdersResponse {
  data: Order[];
  pagination: Pagination;
}

export function useOrders(
  page: number = 1,
  status?: Order["status"],
  limit: number = 10,
) {
  return useQuery<OrdersResponse>({
    queryKey: orderKeys.list(page, status),
    queryFn: async () => {
      const response = await api.get<OrdersResponse>("/orders", {
        params: { page, limit, status },
      });
      return response.data;
    },
    staleTime: 60 * 1000,
  });
}

export function useOrderDetail(id: string) {
  return useQuery<Order>({
    queryKey: orderKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<{ data: Order }>(`/orders/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<{ message?: string }>, string>({
    mutationFn: async (id) => {
      await api.post(`/orders/${id}/cancel`);
    },
    onSuccess: (_data, id) => {
      toast.success("Order cancelled");
      void queryClient.invalidateQueries({ queryKey: orderKeys.all });
      void queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message =
        error.response?.data?.message || "Failed to cancel order";
      toast.error(message);
    },
  });
}

export function useContinuePayment() {
  const queryClient = useQueryClient();

  return useMutation<OrderResponse, AxiosError<{ message?: string }>, string>(
    {
      mutationFn: async (id) => {
        const response = await api.post<{ data: OrderResponse }>(
          `/orders/${id}/pay`,
        );
        return response.data.data;
      },
      onSuccess: (_data, id) => {
        void queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) });
      },
      onError: (error: AxiosError<{ message?: string }>) => {
        const message =
          error.response?.data?.message || "Failed to continue payment";
        toast.error(message);
      },
    },
  );
}

export function useDownloadTicket() {
  return useMutation<void, AxiosError<{ message?: string }>, string>({
    mutationFn: async (id) => {
      const response = await api.get<Blob>(`/orders/${id}/ticket/download`, {
        responseType: "blob",
      });

      const disposition = response.headers["content-disposition"] as
        | string
        | undefined;
      const filenameMatch = disposition?.match(/filename="?([^"]+)"?/);
      const filename = filenameMatch?.[1] || `ticket-${id}.pdf`;

      const blobUrl = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    },
    onError: async (error: AxiosError<{ message?: string }>) => {
      let message =
        error.response?.data?.message || "Failed to download ticket";
      // Error responses come back as a Blob (not parsed JSON) because the
      // request was made with responseType: "blob".
      if (error.response?.data instanceof Blob) {
        try {
          const text = await error.response.data.text();
          const parsed = JSON.parse(text) as { message?: string };
          message = parsed?.message || message;
        } catch {
          // keep fallback message
        }
      }
      toast.error(message);
    },
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation<
    OrderResponse,
    AxiosError<{ message?: string }>,
    CreateOrderRequest
  >({
    mutationFn: async (data) => {
      const response = await api.post<{ data: OrderResponse }>("/orders", data);
      return response.data.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message =
        error.response?.data?.message || "Failed to create order";
      toast.error(message);
    },
  });
}
