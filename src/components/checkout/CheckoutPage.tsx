"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/src/hooks/useCart"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { formatPrice, generateWhatsAppMessage } from "@/src/lib/utils"
import type { User } from "@supabase/supabase-js"
import { MessageCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface CheckoutPageProps {
  user: User
}

export function CheckoutPage({ user }: CheckoutPageProps) {
  const [loading, setLoading] = useState(false)
  const { cartItems, getCartTotal, clearCart } = useCart()
  const router = useRouter()

  const handleWhatsAppCheckout = async () => {
    setLoading(true)

    try {
      const total = getCartTotal()
      const message = generateWhatsAppMessage(user, cartItems, total)
      const whatsappUrl = `https://wa.me/5583996160776?text=${message}`

      window.open(whatsappUrl, "_blank")

      // Limpar o carrinho após o checkout
      await clearCart()

      // Redirecionar para o catálogo
      router.push("/catalog")
    } catch (error) {
      console.error("Error during checkout:", error)
    } finally {
      setLoading(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-8 sm:py-12 px-4">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-foreground">Carrinho vazio</h2>
        <p className="text-muted-foreground mb-6 sm:mb-8">Adicione produtos ao carrinho antes de finalizar o pedido</p>
        <Link href="/catalog">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Ir para o Catálogo
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="mb-4 sm:mb-6">
        <Link href="/cart">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Carrinho
          </Button>
        </Link>
      </div>

      <h1 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-foreground">Finalizar Pedido</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Dados do Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm sm:text-base">
                <strong className="text-foreground">Nome:</strong>{" "}
                <span className="text-muted-foreground">{user.user_metadata?.full_name || "Não informado"}</span>
              </p>
              <p className="text-sm sm:text-base">
                <strong className="text-foreground">Email:</strong>{" "}
                <span className="text-muted-foreground">{user.email}</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Produtos do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-start py-2 border-b border-border last:border-b-0">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base text-foreground truncate">{item.product.name}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Qtd: {item.quantity} × {formatPrice(item.product.price)}
                    </p>
                  </div>
                  <p className="font-semibold text-sm sm:text-base text-foreground ml-2 flex-shrink-0">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-base sm:text-lg font-semibold">
                <span className="text-foreground">Total:</span>
                <span className="text-primary">{formatPrice(getCartTotal())}</span>
              </div>

              <div className="pt-4 border-t border-border">
                <Button 
                  onClick={handleWhatsAppCheckout} 
                  disabled={loading} 
                  className="w-full dark:text-white" 
                  size="lg"
                >
                  <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  {loading ? "Processando..." : "Finalizar via WhatsApp"}
                </Button>

                <p className="text-xs sm:text-sm text-muted-foreground mt-2 text-center">
                  Você será redirecionado para o WhatsApp para confirmar seu pedido
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
