"use client"

import Image from "next/image"
import type { CartItem as CartItemType } from "@/src/lib/types"
import { useCart } from "@/src/hooks/useCart"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent } from "@/src/components/ui/card"
import { formatPrice } from "@/src/lib/utils"
import { Plus, Minus, Trash2 } from "lucide-react"

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart()

  const incrementQuantity = () => {
    updateQuantity(item.id, item.quantity + 1)
  }

  const decrementQuantity = () => {
    updateQuantity(item.id, item.quantity - 1)
  }

  const handleRemove = () => {
    removeFromCart(item.id)
  }

  return (
    <Card className="border-gray-200 dark:border-gray-700">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-24 h-24 relative overflow-hidden rounded-lg flex-shrink-0 bg-gray-100 dark:bg-gray-800">
            <Image
              src={
                item.product.image_url ||
                `/placeholder.svg?height=96&width=96&query=${encodeURIComponent(item.product.name)}`
              }
              alt={item.product.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1 space-y-2">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{item.product.name}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{item.product.description}</p>
            <p className="text-lg font-bold text-primary">{formatPrice(item.product.price)}</p>
          </div>

          <div className="flex flex-col justify-between items-end space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRemove}
              className="text-red-600 hover:text-red-700 bg-transparent border-red-200 dark:border-red-800"
            >
              <Trash2 className="h-4 w-4" />
            </Button>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={decrementQuantity} disabled={item.quantity <= 1}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-lg font-semibold w-8 text-center text-gray-900 dark:text-white">{item.quantity}</span>
              <Button variant="outline" size="sm" onClick={incrementQuantity}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-lg font-bold text-gray-900 dark:text-white">{formatPrice(item.product.price * item.quantity)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
