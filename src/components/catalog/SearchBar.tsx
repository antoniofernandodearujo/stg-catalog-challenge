"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/src/components/ui/input"
import { Button } from "@/src/components/ui/button"
import { Search, X } from "lucide-react"

interface SearchBarProps {
  initialValue?: string
}

export function SearchBar({ initialValue = "" }: SearchBarProps) {
  const [search, setSearch] = useState(initialValue)
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams)

    if (search.trim()) {
      params.set("search", search.trim())
    } else {
      params.delete("search")
    }

    router.push(`/catalog?${params.toString()}`)
  }

  const clearSearch = () => {
    setSearch("")
    const params = new URLSearchParams(searchParams)
    params.delete("search")
    router.push(`/catalog?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-md">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Buscar produtos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pr-8 text-sm md:text-base"
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
  )
}
