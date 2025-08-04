"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from 'framer-motion'
import type { Product } from "@/src/lib/types"
import type { User } from "@supabase/supabase-js"
import { useCart } from "@/src/hooks/useCart"
import { useApp } from "@/src/contexts/AppContext"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardFooter } from "@/src/components/ui/card"
import { formatPrice } from "@/src/lib/utils"
import { ShoppingCart, Plus } from "lucide-react"

interface ProductCardProps {
  product: Product
  user?: User | null
}

export function ProductCard({ product, user }: ProductCardProps) {
  const { addToCart } = useCart()
  const { addRecentlyViewed, addNotification } = useApp()
  const router = useRouter()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    
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

    addToCart(product)
    addNotification({
      type: 'success',
      title: 'Produto adicionado',
      message: `${product.name} foi adicionado ao carrinho`
    })
  }

  const handleProductClick = () => {
    addRecentlyViewed(product.id)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <Card className="group hover:shadow-lg transition-all duration-200 h-full flex flex-col relative overflow-hidden">
        <Link href={`/catalog/product/${product.id}`} className="flex-1" onClick={handleProductClick}>
          <CardContent className="p-3 md:p-4">
            <div className="relative">
              <div className="aspect-square relative mb-3 md:mb-4 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                <Image
                  src={
                    product.image_url || `/placeholder.svg?height=300&width=300&query=${encodeURIComponent(product.name)}`
                  }
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-base md:text-lg mb-1 md:mb-2 line-clamp-2 leading-tight text-foreground">
                {product.name}
              </h3>

              <p className="text-muted-foreground text-xs md:text-sm mb-2 md:mb-3 line-clamp-2 leading-relaxed">
                {product.description}
              </p>

              <p className="text-xl md:text-2xl font-bold text-primary">
                {formatPrice(product.price)}
              </p>
            </div>
          </CardContent>
        </Link>

        <CardFooter className="p-3 md:p-4 pt-0 mt-auto">
          <Button 
            onClick={handleAddToCart} 
            className="w-full text-sm md:text-base" 
            size="sm"
          >
            <ShoppingCart className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">
              {user ? 'Adicionar ao Carrinho' : 'Fazer Login'}
            </span>
            <span className="sm:hidden">
              {user ? 'Adicionar' : 'Login'}
            </span>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
