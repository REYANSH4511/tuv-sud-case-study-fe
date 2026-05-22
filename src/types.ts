export type OrderStatus = "pending" | "fulfilled" | "cancelled";

export interface OrderItem {
  sku: string;
  name: string;
  qty: number;
  priceCents: number;
}

export interface Order {
  id: string;
  number: string;
  customer: { id: string; name: string; email: string };
  totalCents: number;
  createdAt: string; // ISO
  status: OrderStatus;
  items: OrderItem[];
}
