"use client"

import type { Product } from "@/src/lib/types"
import type { User } from "@supabase/supabase-js"
import { ProductCard } from "./ProductCard"
import { useMemo } from "react"

interface ProductGridProps {
  products: Product[]
  user?: User | null
}

export function ProductGrid({ products, user }: ProductGridProps) {
  // Remove duplicatas baseado no ID do produto
  const uniqueProducts = useMemo(() => {
    const seen = new Set()
    return products.filter(product => {
      if (seen.has(product.id)) {
        return false
      }
      seen.add(product.id)
      return true
    })
  }, [products])

  if (uniqueProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">Nenhum produto encontrado</h3>
          <p className="text-muted-foreground dark:text-white">Tente ajustar os filtros ou buscar por outro termo.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
      {uniqueProducts.map((product) => (
        <ProductCard key={`${product.id}-${product.name}`} product={product} user={user} />
      ))}
    </div>
  )
}
