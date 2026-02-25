"use client";

import { AuthProvider } from "./contextAPI";

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}