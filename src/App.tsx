import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { useOrders, useUpdateOrderStatus } from "./hooks/useOrders";
import { useDebouncedValue } from "./lib/useDebouncedValue";
import { useToast } from "./toast/ToastProvider";
import { OrdersTable } from "./components/table";
import type { OrderStatus } from "./types";
import { OrderDetailDrawer } from "./components/orderDetail";

const qc = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <OrdersScreen />
    </QueryClientProvider>
  );
}

/**
 * Main orders screen with search, table, pagination, and detail drawer.
 */
function OrdersScreen() {
  const [page, setPage] = useState(1);
  const [rawSearch, setRawSearch] = useState("");
  const debouncedSearch = useDebouncedValue(rawSearch, 350);
  const [detailId, setDetailId] = useState<string | null>(null);

  const { data, isLoading, isError } = useOrders({
    page,
    limit: 10,
    ...(debouncedSearch ? { q: debouncedSearch } : {}),
  });

  const updateStatus = useUpdateOrderStatus();
  const toast = useToast();

  function handleStatusChange(id: string, status: OrderStatus) {
    updateStatus.mutate(
      { id, status },
      {
        onSuccess: () => {
          toast.push({ message: `Status updated to ${status}`, kind: "success" });
        },
        onError: () => {
          toast.push({ message: "Failed to update status", kind: "error" });
        },
      }
    );
  }

  return (
    <div className="container">
      <h1>Orders</h1>

      {/* Search bar with debounced value */}
      <div className="controls" style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search by customer name..."
          value={rawSearch}
          onChange={(e) => {
            setRawSearch(e.target.value);
            setPage(1);
          }}
          aria-label="Search by customer name"
        />
      </div>

      {isLoading && <p className="muted">Loading...</p>}
      {isError && <p className="muted">Failed to load orders.</p>}

      {data && (
        <>
          <OrdersTable
            orders={data.data}
            onStatusChange={handleStatusChange}
            onViewDetail={(order) => setDetailId(order.id)}
          />
          <div className="spacer" />
          <Paginator
            page={page}
            pageSize={10}
            total={data.total}
            onPage={setPage}
          />
        </>
      )}

      {detailId && (
        <OrderDetailDrawer
          orderId={detailId}
          onClose={() => setDetailId(null)}
        />
      )}
    </div>
  );
}



/**
 * Pagination controls.
 */
function Paginator({
  page,
  pageSize,
  total,
  onPage,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPage: (p: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <div className="pagination" role="navigation" aria-label="Pagination">
      <button
        onClick={() => onPage(1)}
        disabled={page === 1}
        aria-label="First page"
      >
        «
      </button>
      <button
        onClick={() => onPage(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        ‹
      </button>
      <span className="muted">
        Page {page} / {pages}
      </span>
      <button
        onClick={() => onPage(page + 1)}
        disabled={page >= pages}
        aria-label="Next page"
      >
        ›
      </button>
      <button
        onClick={() => onPage(pages)}
        disabled={page === pages}
        aria-label="Last page"
      >
        »
      </button>
    </div>
  );
}
