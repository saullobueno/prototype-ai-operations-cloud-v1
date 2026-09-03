"use client";

import { createContext, useContext, type ReactNode } from "react";
import { CURRENT_USER_ID, getUserById } from "@/data/mock";
import { useLocalStorageState } from "@/lib/use-local-storage-state";
import type { User } from "@/types";

interface AuthContextValue {
  user: User | undefined;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "aiops.auth.isAuthenticated";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [value, setValue] = useLocalStorageState<"true" | "false">(STORAGE_KEY, "false");
  const isAuthenticated = value === "true";

  return (
    <AuthContext.Provider
      value={{
        user: getUserById(CURRENT_USER_ID),
        isAuthenticated,
        login: () => setValue("true"),
        logout: () => setValue("false"),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
