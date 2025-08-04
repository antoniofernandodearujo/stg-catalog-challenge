"use client"

import Link from "next/link"
import { useCart } from "@/src/hooks/useCart"
import { CartItem } from "./CartItem"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { formatPrice } from "@/src/lib/utils"
import { ShoppingBag, ArrowLeft } from "lucide-react"

export function CartPage() {
  const { cartItems, getCartTotal, clearCart } = useCart()

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <ShoppingBag className="h-24 w-24 mx-auto text-gray-300 dark:text-gray-600 mb-6" />
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Seu carrinho está vazio</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Adicione alguns produtos ao seu carrinho para continuar</p>
        <Link href="/catalog">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continuar Comprando
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/catalog">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continuar Comprando
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Carrinho de Compras</h1>

          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}

          <div className="pt-4">
            <Button variant="outline" onClick={clearCart} className="text-red-600 hover:text-red-700 bg-transparent">
              Limpar Carrinho
            </Button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-lg font-semibold">
                <span className="text-gray-900 dark:text-white">Total:</span>
                <span className="text-primary">{formatPrice(getCartTotal())}</span>
              </div>

              <Link href="/checkout" className="block">
                <Button className="w-full" size="lg">
                  Finalizar Pedido
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
