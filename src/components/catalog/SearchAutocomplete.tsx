"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/src/components/ui/input'
import { Button } from '@/src/components/ui/button'
import { Search, X, Clock, TrendingUp } from 'lucide-react'
import { useApp } from '@/src/contexts/AppContext'

interface SearchAutocompleteProps {
  initialValue?: string
  suggestions?: string[]
}

export function SearchAutocomplete({ initialValue = "", suggestions = [] }: SearchAutocompleteProps) {
  const [search, setSearch] = useState(initialValue)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { state, addSearchHistory } = useApp()
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Memoize suggestions to prevent unnecessary recalculations
  const allSuggestions = useMemo(() => {
    return [...new Set([...suggestions, ...state.searchHistory])]
  }, [suggestions, state.searchHistory])

  // Memoize filtered suggestions
  const filteredSuggestions = useMemo(() => {
    if (!search.trim()) return []
    
    return allSuggestions
      .filter(suggestion =>
        suggestion.toLowerCase().includes(search.toLowerCase())
      )
      .slice(0, 8)
  }, [search, allSuggestions])

  // Update search when initialValue changes
  useEffect(() => {
    setSearch(initialValue)
  }, [initialValue])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle search input changes
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
    
    if (value.trim()) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }, [])

  const handleSearch = useCallback((searchTerm: string = search) => {
    if (!searchTerm.trim()) return

    const params = new URLSearchParams(searchParams)
    params.set("search", searchTerm.trim())
    params.set("page", "1")
    
    addSearchHistory(searchTerm.trim())
    router.push(`/catalog?${params.toString()}`)
    setIsOpen(false)
  }, [search, searchParams, addSearchHistory, router])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    handleSearch()
  }, [handleSearch])

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setSearch(suggestion)
    handleSearch(suggestion)
  }, [handleSearch])

  const clearSearch = useCallback(() => {
    setSearch("")
    const params = new URLSearchParams(searchParams)
    params.delete("search")
    router.push(`/catalog?${params.toString()}`)
    setIsOpen(false)
  }, [searchParams, router])

  const getSuggestionIcon = useCallback((suggestion: string, index: number) => {
    if (state.searchHistory.includes(suggestion)) {
      return <Clock className="h-4 w-4 text-gray-400" />
    }
    if (index < 3) {
      return <TrendingUp className="h-4 w-4 text-blue-500" />
    }
    return <Search className="h-4 w-4 text-gray-400" />
  }, [state.searchHistory])

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Buscar produtos..."
            value={search}
            onChange={handleSearchChange}
            onFocus={() => search.trim() && setIsOpen(true)}
            className="pr-8 text-sm md:text-base bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
          />
          {search && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button type="submit" size="sm" className="px-3 md:px-4">
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline ml-1">Buscar</span>
        </Button>
      </form>

      <AnimatePresence>
        {isOpen && filteredSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
          >
            {filteredSuggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors duration-150 text-sm"
              >
                {getSuggestionIcon(suggestion, index)}
                <span className="truncate">{suggestion}</span>
                {state.searchHistory.includes(suggestion) && (
                  <span className="text-xs text-gray-400 ml-auto flex-shrink-0">Histórico</span>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 