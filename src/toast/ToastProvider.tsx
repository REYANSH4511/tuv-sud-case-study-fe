import { createPortal } from "react-dom";
import { createContext, useContext, useEffect, useMemo, useState } from "react";


export type Toast = { id: number; message: string; kind?: "success" | "error" };


const ToastCtx = createContext<{ push: (t: Omit<Toast, "id">) => void } | null>(null);


export function useToast() {
    const ctx = useContext(ToastCtx);
    if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
    return ctx;
}


export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);


    const push = (t: Omit<Toast, "id">) =>
        setToasts((prev) => [...prev, { ...t, id: Date.now() + Math.random() }]);


    useEffect(() => {
        if (!toasts.length) return;
        const id = setTimeout(() => setToasts((prev) => prev.slice(1)), 2500);
        return () => clearTimeout(id);
    }, [toasts]);


    const value = useMemo(() => ({ push }), []);


    return (
        <ToastCtx.Provider value={value}>
            {children}
            {createPortal(
                toasts.map((t) => (
                    <div key={t.id} className="toast" role="status" aria-live="polite">
                        {t.message}
                    </div>
                )),
                document.getElementById("toaster") as HTMLElement
            )}
        </ToastCtx.Provider>
    );
}