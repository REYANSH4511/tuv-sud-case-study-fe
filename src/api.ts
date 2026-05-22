import { z } from "zod";
import type { Order, OrderStatus } from "./types";

// Zod schemas to validate API responses
const OrderItemSchema = z.object({
  sku: z.string(),
  name: z.string(),
  qty: z.number().int().min(1),
  priceCents: z.number().int().nonnegative(),
});

const CustomerSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

const OrderSchema = z.object({
  id: z.string().uuid(),
  number: z.string(),
  customer: CustomerSchema,
  totalCents: z.number().int().nonnegative(),
  createdAt: z.string().datetime(),
  status: z.enum(["pending", "fulfilled", "cancelled"]),
  items: z.array(OrderItemSchema),
});

export type ListParams = {
  q?: string;
  status?: OrderStatus | "all";
  sort?: "createdAt" | "totalCents";
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
};

function withParams(
  url: string,
  params: Record<string, string | number | undefined>
) {
  const u = new URL(url, location.origin);
  for (const [k, v] of Object.entries(params))
    if (v !== undefined) u.searchParams.set(k, String(v));
  return u.toString();
}

/**
 * Fetch a paginated list of orders from the mock backend.
 * Validates the response with zod before returning.
 */
export async function listOrders(
  params: ListParams
): Promise<{ data: Order[]; total: number }> {
  const url = withParams("/orders", {
    search: params.q || undefined,
    status:
      params.status && params.status !== "all" ? params.status : undefined,
    _sort: params.sort,
    _order: params.order,
    _page: params.page ?? 1,
    _limit: params.limit ?? 10,
  });
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch orders");
  const raw = await res.json();
  const data = z.array(OrderSchema).parse(raw);
  const total = Number(res.headers.get("X-Total-Count") ?? data.length);
  return { data, total };
}

/**
 * Fetch a single order by id.
 * Validates the response with zod before returning.
 */
export async function getOrder(id: string): Promise<Order> {
  const res = await fetch(`/orders/${id}`);
  if (!res.ok) throw new Error("Not found");
  const raw = await res.json();
  return OrderSchema.parse(raw);
}

/**
 * Update an order's status.
 * Validates the response with zod before returning.
 */
export async function patchOrderStatus(
  id: string,
  status: OrderStatus
): Promise<Order> {
  const res = await fetch(`/orders/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Update failed");
  const raw = await res.json();
  return OrderSchema.parse(raw);
}
