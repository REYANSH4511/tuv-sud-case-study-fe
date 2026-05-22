import type { Order, OrderStatus } from "../types";
import { StatusBadge } from "./StatusBadge";

interface OrdersTableProps {
  orders: Order[];
  onStatusChange: (id: string, status: OrderStatus) => void;
  onViewDetail: (order: Order) => void;
}

/**
 * Format a price in cents to a dollar string like "$29.99".
 */
function formatDollars(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/**
 * Format an ISO date string to a readable local date.
 */
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString();
}

export function OrdersTable({
  orders,
  onStatusChange,
  onViewDetail,
}: OrdersTableProps) {
  return (
    <table className="orders-table">
      <thead>
        <tr>
          <th>Order Number</th>
          <th>Customer</th>
          <th>Total</th>
          <th>Date</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td>{order.number}</td>
            <td>{order.customer.name}</td>
            <td>{formatDollars(order.totalCents)}</td>
            <td>{formatDate(order.createdAt)}</td>
            <td>
              <StatusBadge status={order.status} />
              <select
                value={order.status}
                onChange={(e) =>
                  onStatusChange(order.id, e.target.value as OrderStatus)
                }
                aria-label={`Change status for ${order.number}`}
              >
                <option value="pending">pending</option>
                <option value="fulfilled">fulfilled</option>
                <option value="cancelled">cancelled</option>
              </select>
            </td>
            <td>
              <button onClick={() => onViewDetail(order)}>View</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
