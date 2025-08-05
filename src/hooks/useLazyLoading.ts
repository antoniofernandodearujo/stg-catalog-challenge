"use client"

import { useState, useEffect, useCallback } from 'react'
import { useInView } from 'react-intersection-observer'

interface UseLazyLoadingOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

export function useLazyLoading(options: UseLazyLoadingOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    triggerOnce = true
  } = options

  const [isLoaded, setIsLoaded] = useState(false)
  const { ref, inView } = useInView({
    threshold,
    rootMargin,
    triggerOnce
  })

  useEffect(() => {
    if (inView && !isLoaded) {
      setIsLoaded(true)
    }
  }, [inView, isLoaded])

  return { ref, isLoaded, inView }
}

export function useInfiniteScroll<T>(
  fetchData: (page: number) => Promise<T[]>,
  options: UseLazyLoadingOptions = {}
) {
  const [data, setData] = useState<T[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: '100px',
    triggerOnce: false,
    ...options
  })

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)
    setError(null)

    try {
      const newData = await fetchData(page)
      
      if (newData.length === 0) {
        setHasMore(false)
      } else {
        setData(prev => [...prev, ...newData])
        setPage(prev => prev + 1)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }, [fetchData, page, loading, hasMore])

  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMore()
    }
  }, [inView, hasMore, loading, loadMore])

  const reset = useCallback(() => {
    setData([])
    setPage(1)
    setHasMore(true)
    setLoading(false)
    setError(null)
  }, [])

  return {
    data,
    loading,
    error,
    hasMore,
    ref,
    reset,
    loadMore
  }
} 