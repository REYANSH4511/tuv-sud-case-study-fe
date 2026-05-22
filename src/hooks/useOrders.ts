import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listOrders, getOrder, patchOrderStatus, type ListParams } from "../api";
import type { OrderStatus } from "../types";

/**
 * Custom hook to fetch a paginated, filterable list of orders.
 */
export function useOrders(params: ListParams) {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => listOrders(params),
  });
}

/**
 * Custom hook to fetch a single order by id.
 */
export function useOrder(id: string | null) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrder(id!),
    enabled: !!id,
  });
}

/**
 * Custom hook to update an order's status.
 * Invalidates the orders cache on success.
 */
export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      patchOrderStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["order"] });
    },
  });
}
