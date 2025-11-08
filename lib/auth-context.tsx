"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const STORAGE_KEY = "currentUser";

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

function readStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as User;
    if (!parsed?.id) return null;
    return parsed;
  } catch {
    return null;
  }
}

function persistCookie(user: User | null) {
  if (typeof document === "undefined") return;
  if (!user) {
    document.cookie = `currentUser=; Max-Age=0; path=/; SameSite=Lax`;
    return;
  }
  const payload = encodeURIComponent(
    JSON.stringify({
      email: user.email,
      loggedInAt: user.createdAt,
    })
  );
  document.cookie = `currentUser=${payload}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => readStoredUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = readStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        try {
          setUser(event.newValue ? JSON.parse(event.newValue) : null);
        } catch {
          setUser(null);
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const syncUser = (nextUser: User | null) => {
    if (typeof window !== "undefined") {
      if (nextUser) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    persistCookie(nextUser);
    setUser(nextUser);
  };

  const login = (nextUser: User) => {
    syncUser(nextUser);
  };

  const logout = () => {
    syncUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
