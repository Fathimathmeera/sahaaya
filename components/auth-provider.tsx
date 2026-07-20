"use client";

import { createContext, useContext, useEffect, useState } from "react";

type DemoUser = { name: string; email: string };
type AuthContextValue = { user: DemoUser | null; loading: boolean; login: (user: DemoUser) => void; logout: () => void };
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { const saved = localStorage.getItem("sahaya-user"); if (saved) setUser(JSON.parse(saved) as DemoUser); setLoading(false); }, []);
  const login = (next: DemoUser) => { localStorage.setItem("sahaya-user", JSON.stringify(next)); setUser(next); };
  const logout = () => { localStorage.removeItem("sahaya-user"); setUser(null); };
  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error("useAuth must be used within AuthProvider"); return value; }
