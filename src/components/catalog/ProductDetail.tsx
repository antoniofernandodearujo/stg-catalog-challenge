"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Product } from "@/src/lib/types"
import type { User } from "@supabase/supabase-js"
import { useCart } from "@/src/hooks/useCart"
import { useApp } from "@/src/contexts/AppContext"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent } from "@/src/components/ui/card"
import { formatPrice } from "@/src/lib/utils"
import { ArrowLeft, ShoppingCart, Plus, Minus } from "lucide-react"

interface ProductDetailProps {
  product: Product
  user?: User | null
}

export function ProductDetail({ product, user }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const { addNotification } = useApp()
  const router = useRouter()

  const handleAddToCart = () => {
    // Se o usuário não estiver logado, redirecionar para login
    if (!user) {
      addNotification({
        type: 'info',
        title: 'Login necessário',
        message: 'Faça login para adicionar produtos ao carrinho'
      })
      router.push('/auth/login')
      return
    }

    addToCart(product, quantity)
    addNotification({
      type: 'success',
      title: 'Produto adicionado',
      message: `${quantity}x ${product.name} foi adicionado ao carrinho`
    })
  }

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1))
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Link href="/catalog">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Catálogo
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
          <Image
            src={product.image_url || `/placeholder.svg?height=600&width=600&query=${encodeURIComponent(product.name)}`}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">{product.name}</h1>
            <p className="text-sm text-muted-foreground uppercase tracking-wide">{product.category}</p>
          </div>

          <p className="text-4xl font-bold text-primary">{formatPrice(product.price)}</p>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">Descrição</h3>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block text-foreground">Quantidade</label>
                  <div className="flex items-center space-x-3">
                    <Button variant="outline" size="sm" onClick={decrementQuantity} disabled={quantity <= 1}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-lg font-semibold w-8 text-center text-foreground">{quantity}</span>
                    <Button variant="outline" size="sm" onClick={incrementQuantity}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button onClick={handleAddToCart} className="w-full dark:text-white" size="lg">
                  <ShoppingCart className="h-5 w-5 mr-2 " />
                  {user ? `Adicionar ao Carrinho - ${formatPrice(product.price * quantity)}` : 'Fazer Login'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
