import type { OrderStatus } from "../types";


export function StatusBadge({ status }: { status: OrderStatus }) {
    return <span className={`badge ${status}`}>{status}</span>;
}