/**
 * Side drawer that shows order details including items.
 */
import { useOrder } from "../hooks/useOrders";

export function OrderDetailDrawer({
  orderId,
  onClose,
}: {
  orderId: string;
  onClose: () => void;
}) {
  const { data: order, isLoading } = useOrder(orderId);

  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div className="drawer">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h2>Order Details</h2>
          <button onClick={onClose}>Close</button>
        </div>
        {isLoading && <p>Loading...</p>}
        {order && (
          <div>
            <p>
              <strong>{order.number}</strong>
            </p>
            <p>Customer: {order.customer.name}</p>
            <p>Email: {order.customer.email}</p>
            <p>Total: ${(order.totalCents / 100).toFixed(2)}</p>
            <p>Status: {order.status}</p>
            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>

            <h3>Items</h3>
            <table>
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Name</th>
                  <th>Qty</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.sku}>
                    <td>{item.sku}</td>
                    <td>{item.name}</td>
                    <td>{item.qty}</td>
                    <td>${(item.priceCents / 100).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
