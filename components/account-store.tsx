"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

// Front-end only: the account and orders live in this browser's storage until a backend is connected.

export type User = { name: string; email: string; phone?: string };

export type Order = {
  id: string;
  date: string;
  items: { slug: string; size: string; qty: number }[];
  total: number;
  payment: string;
  address: { name: string; phone: string; line: string; city: string };
  status: "Confirmed" | "Packed" | "Shipped" | "Delivered";
};

type AccountCtx = {
  user: User | null;
  orders: Order[];
  signIn: (u: User) => void;
  signOut: () => void;
  placeOrder: (o: Omit<Order, "id" | "date" | "status">) => Order;
};

const Ctx = createContext<AccountCtx | null>(null);

export const useAccount = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAccount must be used inside AccountProvider");
  return c;
};

const USER_KEY = "neend-user";
const ORDERS_KEY = "neend-orders";

const read = <T,>(key: string, fallback: T): T => {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key: string, value: unknown) => {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- syncing from browser storage */
    setUser(read<User | null>(USER_KEY, null));
    setOrders(read<Order[]>(ORDERS_KEY, []));
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const value = useMemo<AccountCtx>(
    () => ({
      user,
      orders,
      signIn: (u) => {
        setUser(u);
        write(USER_KEY, u);
      },
      signOut: () => {
        setUser(null);
        write(USER_KEY, null);
      },
      placeOrder: (o) => {
        const order: Order = {
          ...o,
          id: "NE" + Date.now().toString().slice(-6),
          date: new Date().toISOString(),
          status: "Confirmed",
        };
        setOrders((prev) => {
          const next = [order, ...prev];
          write(ORDERS_KEY, next);
          return next;
        });
        return order;
      },
    }),
    [user, orders],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
