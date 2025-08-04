"use client"

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { cn } from "@/src/lib/utils"
import Link from "next/link"

interface MobilePaginationProps {
  currentPage: number
  totalPages: number
  searchTerm?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: string
  maxPriceForFilters?: number
}

export function MobilePagination({
  currentPage,
  totalPages,
  searchTerm,
  category,
  minPrice,
  maxPrice,
  sortBy,
  maxPriceForFilters = 10000,
}: MobilePaginationProps) {
  if (totalPages <= 1) return null

  const generatePageUrl = (page: number) => {
    const params = new URLSearchParams()
    if (searchTerm) params.set("search", searchTerm)
    if (category) params.set("category", category)
    if (minPrice && minPrice > 0) params.set("minPrice", minPrice.toString())
    if (maxPrice && maxPrice < maxPriceForFilters) params.set("maxPrice", maxPrice.toString())
    if (sortBy && sortBy !== "date") params.set("sort", sortBy)
    params.set("page", String(page))
    return `/catalog?${params.toString()}`
  }

  const getVisiblePages = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const pages = []
    
    // Sempre incluir a primeira página
    pages.push(1)
    
    if (currentPage <= 3) {
      // Se estamos no início: 1, 2, 3, 4, ..., último
      for (let i = 2; i <= Math.min(4, totalPages - 1); i++) {
        pages.push(i)
      }
      if (totalPages > 4) {
        pages.push('...')
        pages.push(totalPages)
      }
    } else if (currentPage >= totalPages - 2) {
      // Se estamos no final: 1, ..., últimas 4 páginas
      if (totalPages > 4) {
        pages.push('...')
      }
      for (let i = Math.max(2, totalPages - 3); i <= totalPages; i++) {
        if (!pages.includes(i)) {
          pages.push(i)
        }
      }
    } else {
      // Se estamos no meio: 1, ..., atual-1, atual, atual+1, ..., último
      pages.push('...')
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(totalPages)
    }

    return pages
  }

  const visiblePages = getVisiblePages()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 md:hidden z-50">
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <Link href={generatePageUrl(Math.max(1, currentPage - 1))}>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          
          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 min-w-[60px] sm:min-w-[80px] text-center">
            Página {currentPage} de {totalPages}
          </span>
          
          <Link href={generatePageUrl(Math.min(totalPages, currentPage + 1))}>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="flex items-center space-x-1">
          {visiblePages.map((page, index) => (
            <div key={index}>
              {page === '...' ? (
                <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8">
                  <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                </div>
              ) : (
                <Link href={generatePageUrl(page as number)}>
                  <Button
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "h-6 w-6 sm:h-8 sm:w-8 p-0 text-xs",
                      page === currentPage && "bg-blue-600 text-white hover:bg-blue-700"
                    )}
                  >
                    {page}
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 