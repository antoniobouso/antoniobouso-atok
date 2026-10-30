"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { cartTotals, type CartItem } from "@/lib/orders";

const STORAGE_KEY = "atok.cart.v1";

interface CartApi {
  items: CartItem[];
  ready: boolean;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (item: CartItem) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  totals: ReturnType<typeof cartTotals>;
}

const CartContext = createContext<CartApi | null>(null);

function read(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setItems(read());
    setReady(true);
    const onStorage = (e: StorageEvent) => e.key === STORAGE_KEY && setItems(read());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable (private mode) — cart still works for this visit */
    }
  }, [items, ready]);

  const add = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.key === item.key);
      if (existing) return prev.map((i) => (i.key === item.key ? { ...i, qty: Math.min(i.qty + item.qty, 20) } : i));
      return [...prev, item];
    });
  }, []);
  const setQty = useCallback(
    (key: string, qty: number) =>
      setItems((prev) => prev.map((i) => (i.key === key ? { ...i, qty: Math.max(1, Math.min(qty, 20)) } : i))),
    [],
  );
  const remove = useCallback((key: string) => setItems((prev) => prev.filter((i) => i.key !== key)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({ items, ready, open, setOpen, add, setQty, remove, clear, totals: cartTotals(items) }),
    [items, ready, open, add, setQty, remove, clear],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
