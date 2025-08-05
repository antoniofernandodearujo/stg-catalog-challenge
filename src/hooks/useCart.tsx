"use client"

import type React from "react"

import { createClient } from "../lib/supabase/client"
import type { CartItem, Product } from "../lib/types"
import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./useAuth"
import { toast } from "./useToast"

interface CartContextType {
  cartItems: CartItem[]
  loading: boolean
  addToCart: (product: Product, quantity?: number) => Promise<void>
  removeFromCart: (itemId: string) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  getCartTotal: () => number
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType>({
  cartItems: [],
  loading: false,
  addToCart: async () => {},
  removeFromCart: async () => {},
  updateQuantity: async () => {},
  clearCart: async () => {},
  getCartTotal: () => 0,
  refreshCart: async () => {},
})

export function useCart() {
  return useContext(CartContext)
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const supabase = createClient()

  const fetchCartItems = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("cart_items")
        .select(`
          *,
          product:products(*)
        `)
        .eq("user_id", user.id)

      if (error) throw error
      setCartItems(data || [])
    } catch (error) {
      console.error("Error fetching cart items:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar o carrinho",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchCartItems()
    } else {
      setCartItems([])
    }
  }, [user])

  const addToCart = async (product: Product, quantity = 1) => {
    if (!user) return

    try {
      // Check if item already exists in cart
      const existingItem = cartItems.find((item) => item.product_id === product.id)

      if (existingItem) {
        await updateQuantity(existingItem.id, existingItem.quantity + quantity)
      } else {
        const { error } = await supabase.from("cart_items").insert({
          user_id: user.id,
          product_id: product.id,
          quantity,
        })

        if (error) throw error
        await fetchCartItems()
      }

      toast({
        title: "Produto adicionado",
        description: `${product.name} foi adicionado ao carrinho`,
      })
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o produto ao carrinho",
        variant: "destructive",
      })
    }
  }

  const removeFromCart = async (itemId: string) => {
    try {
      const { error } = await supabase.from("cart_items").delete().eq("id", itemId)

      if (error) throw error
      await fetchCartItems()

      toast({
        title: "Produto removido",
        description: "O produto foi removido do carrinho",
      })
    } catch (error) {
      console.error("Error removing from cart:", error)
      toast({
        title: "Erro",
        description: "Não foi possível remover o produto do carrinho",
        variant: "destructive",
      })
    }
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId)
      return
    }

    try {
      const { error } = await supabase.from("cart_items").update({ quantity }).eq("id", itemId)

      if (error) throw error
      await fetchCartItems()
    } catch (error) {
      console.error("Error updating quantity:", error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a quantidade",
        variant: "destructive",
      })
    }
  }

  const clearCart = async () => {
    if (!user) return

    try {
      const { error } = await supabase.from("cart_items").delete().eq("user_id", user.id)

      if (error) throw error
      setCartItems([])

      toast({
        title: "Carrinho limpo",
        description: "Todos os produtos foram removidos do carrinho",
      })
    } catch (error) {
      console.error("Error clearing cart:", error)
      toast({
        title: "Erro",
        description: "Não foi possível limpar o carrinho",
        variant: "destructive",
      })
    }
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.product.price * item.quantity
    }, 0)
  }

  const refreshCart = async () => {
    await fetchCartItems()
  }

  return (
    <CartContext.Provider
      value={{
        cartItems: cartItems,
        loading: loading,
        addToCart: addToCart,
        removeFromCart: removeFromCart,
        updateQuantity: updateQuantity,
        clearCart: clearCart,
        getCartTotal: getCartTotal,
        refreshCart: refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
