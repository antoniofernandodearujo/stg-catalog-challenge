"use client"

import type React from "react"

import { AuthProvider as AuthContextProvider } from "@/src/hooks/useAuth"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <AuthContextProvider>{children}</AuthContextProvider>
}
