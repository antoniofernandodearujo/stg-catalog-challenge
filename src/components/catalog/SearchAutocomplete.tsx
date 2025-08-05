"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/src/components/ui/input'
import { Button } from '@/src/components/ui/button'
import { Search, X, Clock, TrendingUp } from 'lucide-react'
import { useApp } from '@/src/contexts/AppContext'

// Hook para gerenciar os parâmetros de busca
const useSearchQuery = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSearch = searchParams.get("search") || ""

  const updateSearchParam = useCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set("search", term.trim())
      params.set("page", "1")
    } else {
      params.delete("search")
      params.delete("page")
    }
    router.push(`/catalog?${params.toString()}`)
  }, [router, searchParams])

  return { currentSearch, updateSearchParam }
}

interface SearchAutocompleteProps {
  suggestions?: string[]
}

export function SearchAutocomplete({ suggestions = [] }: SearchAutocompleteProps) {
  const { currentSearch, updateSearchParam } = useSearchQuery()
  const [search, setSearch] = useState(currentSearch)
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  const { state, addSearchHistory } = useApp()
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Sincroniza o estado local 'search' com o parâmetro de URL
  useEffect(() => {
    setSearch(currentSearch)
  }, [currentSearch])

  // Lógica de fechamento ao clicar fora do componente
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Combina e filtra as sugestões de forma otimizada
  const { filteredSuggestions, isHistory } = useMemo(() => {
    const all = [...new Set([...suggestions, ...state.searchHistory])]

    // Se o campo de busca estiver vazio, mostre as sugestões padrão (histórico)
    if (!search.trim()) {
      return {
        filteredSuggestions: all.slice(0, 8),
        isHistory: new Set(state.searchHistory)
      }
    }

    // Caso contrário, filtre as sugestões com base no que foi digitado
    const filtered = all
      .filter(s => s.toLowerCase().includes(search.toLowerCase()))
      .slice(0, 8)

    return {
      filteredSuggestions: filtered,
      isHistory: new Set(state.searchHistory)
    }
  }, [search, suggestions, state.searchHistory])

  // Lógica para lidar com a busca
  const handleSearch = useCallback((searchTerm: string) => {
    if (searchTerm.trim()) {
      addSearchHistory(searchTerm.trim())
      updateSearchParam(searchTerm.trim())
    }
    setIsOpen(false)
  }, [addSearchHistory, updateSearchParam])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (filteredSuggestions.length > 0 && highlightedIndex !== -1) {
      handleSearch(filteredSuggestions[highlightedIndex])
    } else {
      handleSearch(search)
    }
    setHighlightedIndex(-1)
  }, [handleSearch, search, filteredSuggestions, highlightedIndex])

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setSearch(suggestion) // Atualiza o input com a sugestão clicada
    handleSearch(suggestion)
  }, [handleSearch])

  const clearSearch = useCallback(() => {
    setSearch("")
    updateSearchParam("")
    setIsOpen(false)
  }, [updateSearchParam])

  // Lógica para navegação com teclado
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || filteredSuggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex(prev => (prev + 1) % filteredSuggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex(prev => (prev - 1 + filteredSuggestions.length) % filteredSuggestions.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (highlightedIndex !== -1) {
        // Ação de busca ao pressionar enter com item destacado
        handleSearch(filteredSuggestions[highlightedIndex])
      } else {
        // Ação de busca com o texto digitado
        handleSearch(search)
      }
      setHighlightedIndex(-1)
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }, [isOpen, filteredSuggestions, highlightedIndex, handleSearch, search])

  // Efeito para rolar para a sugestão destacada
  useEffect(() => {
    if (highlightedIndex !== -1 && containerRef.current) {
      const highlightedItem = containerRef.current.querySelector(`.highlighted-${highlightedIndex}`)
      highlightedItem?.scrollIntoView({ block: 'nearest' })
    }
  }, [highlightedIndex])

  // Função central para lidar com a mudança do input
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    setIsOpen(true); // Sempre abre o menu ao digitar
    setHighlightedIndex(-1);
    // Chama a função de atualização da URL diretamente aqui
    updateSearchParam(value);
  }, [updateSearchParam]);


  return (
    // Div pai para o layout responsivo
    <div className="w-full flex justify-center">
      <div ref={containerRef} className="relative w-full max-w-lg md:max-w-2xl lg:max-w-3xl">
        <form onSubmit={handleSubmit} className="flex gap-2 w-full">
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Buscar produtos..."
              value={search}
              onChange={handleInputChange} // Usando a nova função centralizada
              onFocus={() => {
                setIsOpen(true) // Abre o menu ao focar
              }}
              onBlur={() => {
                // Use setTimeout para dar tempo de clicar em uma sugestão antes de fechar
                setTimeout(() => setIsOpen(false), 200)
              }}
              onKeyDown={handleKeyDown}
              className="pr-8 text-sm md:text-base bg-white border-gray-300"
            />
            {search && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={clearSearch}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Button type="submit" size="sm" className="px-3 md:px-4 dark:text-white">
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
              className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
            >
              {filteredSuggestions.map((suggestion, index) => (
                <motion.button
                  key={suggestion}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onMouseDown={(e) => { // Use onMouseDown para evitar o onBlur de fechar o menu
                    e.preventDefault()
                    handleSuggestionClick(suggestion)
                  }}
                  className={`
                    w-full px-4 py-3 text-left flex items-center space-x-3 transition-colors duration-150 text-sm
                    hover:bg-gray-100
                    ${highlightedIndex === index ? 'bg-gray-100' : 'bg-transparent'}
                    highlighted-${index}
                  `}
                >
                  {isHistory.has(suggestion) ? (
                    <Clock className="h-4 w-4 text-gray-400" />
                  ) : (
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                  )}
                  <span className="truncate">{suggestion}</span>
                  {isHistory.has(suggestion) && (
                    <span className="text-xs text-gray-400 ml-auto flex-shrink-0">Histórico</span>
                  )}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}