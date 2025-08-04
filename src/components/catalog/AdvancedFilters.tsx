"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/src/components/ui/button'
import { Slider } from '@/src/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select'
import { Badge } from '@/src/components/ui/badge'
import { 
  Filter, 
  X, 
  ChevronDown,
  ChevronUp,
  DollarSign,
  SortAsc,
  SortDesc
} from 'lucide-react'
import { formatPrice } from '@/src/lib/utils'

interface AdvancedFiltersProps {
  categories: string[]
  maxPrice: number
}

export function AdvancedFilters({ categories, maxPrice }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Estado local para os filtros
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<string>('date')

  // Sincronizar com URL params
  useEffect(() => {
    const category = searchParams.get('category')
    const minPrice = searchParams.get('minPrice')
    const maxPriceParam = searchParams.get('maxPrice')
    const sort = searchParams.get('sort')

    if (category) {
      setSelectedCategories([category])
    } else {
      setSelectedCategories([])
    }

    if (minPrice && maxPriceParam) {
      setPriceRange([Number(minPrice), Number(maxPriceParam)])
    } else {
      setPriceRange([0, maxPrice])
    }

    if (sort) {
      setSortBy(sort)
    } else {
      setSortBy('date')
    }
  }, [searchParams, maxPrice])

  const updateURL = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })
    
    // Reset page when filters change
    params.set('page', '1')
    
    router.push(`/catalog?${params.toString()}`)
  }

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]])
    updateURL({
      minPrice: value[0].toString(),
      maxPrice: value[1].toString()
    })
  }

  const handleCategoryToggle = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category]
    
    setSelectedCategories(newCategories)
    
    if (newCategories.length === 0) {
      updateURL({ category: null })
    } else if (newCategories.length === 1) {
      updateURL({ category: newCategories[0] })
    } else {
      // Para múltiplas categorias, usar a primeira como principal
      updateURL({ category: newCategories[0] })
    }
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    updateURL({ sort: value })
  }

  const handleClearFilters = () => {
    setPriceRange([0, maxPrice])
    setSelectedCategories([])
    setSortBy('date')
    
    const params = new URLSearchParams(searchParams.toString())
    params.delete('category')
    params.delete('minPrice')
    params.delete('maxPrice')
    params.delete('sort')
    params.set('page', '1')
    
    router.push(`/catalog?${params.toString()}`)
  }

  const activeFiltersCount = selectedCategories.length + 
    (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0) +
    (sortBy !== 'date' ? 1 : 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 w-full sm:w-auto"
        >
          <Filter className="h-4 w-4" />
          <span className="text-sm sm:text-base">Filtros Avançados</span>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>

        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-muted-foreground hover:text-foreground text-sm"
          >
            <X className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Limpar</span>
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-card border border-border rounded-lg p-4 space-y-6"
          >
            {/* Price Range */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-medium text-sm sm:text-base text-foreground">Faixa de Preço</h4>
              </div>
              
              <div className="px-2">
                <Slider
                  value={priceRange}
                  onValueChange={handlePriceChange}
                  max={maxPrice}
                  min={0}
                  step={10}
                  className="w-full"
                />
              </div>
              
              <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
                <span>{formatPrice(priceRange[0])}</span>
                <span>{formatPrice(priceRange[1])}</span>
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm sm:text-base text-foreground">Categorias</h4>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategories.includes(category) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCategoryToggle(category)}
                    className="capitalize text-xs sm:text-sm whitespace-nowrap"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <SortAsc className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-medium text-sm sm:text-base text-foreground">Ordenar por</h4>
              </div>
              
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Mais Recentes</SelectItem>
                  <SelectItem value="name">Nome A-Z</SelectItem>
                  <SelectItem value="price">Menor Preço</SelectItem>
                  <SelectItem value="rating">Melhor Avaliados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters Summary */}
            {activeFiltersCount > 0 && (
              <div className="pt-4 border-t border-border">
                <h5 className="text-xs sm:text-sm font-medium mb-2 text-foreground">Filtros Ativos:</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.map((category) => (
                    <Badge key={category} variant="secondary" className="capitalize text-xs">
                      {category}
                    </Badge>
                  ))}
                  {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                    <Badge variant="secondary" className="text-xs">
                      Preço: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                    </Badge>
                  )}
                  {sortBy !== 'date' && (
                    <Badge variant="secondary" className="text-xs">
                      Ordenar: {sortBy === 'name' ? 'Nome' : sortBy === 'price' ? 'Preço' : 'Avaliação'}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 