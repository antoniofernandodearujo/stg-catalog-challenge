"use client"

import type React from "react"

import { CartProvider as CartContextProvider } from "@/hooks/use-cart"

export function CartProvider({ children }: { children: React.ReactNode }) {
  return <CartContextProvider>{children}</CartContextProvider>
}
