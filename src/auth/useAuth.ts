import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import type { AuthState } from "./types";

export function useAuth(): AuthState {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
