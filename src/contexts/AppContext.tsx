"use client"

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { useTheme } from 'next-themes'

interface AppState {
  darkMode: boolean
  searchHistory: string[]
  recentlyViewed: string[]
  notifications: Notification[]
  filters: {
    priceRange: [number, number]
    categories: string[]
    sortBy: 'name' | 'price' | 'date' | 'rating'
  }
}

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
}

type AppAction =
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'ADD_SEARCH_HISTORY'; payload: string }
  | { type: 'ADD_RECENTLY_VIEWED'; payload: string }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'UPDATE_FILTERS'; payload: Partial<AppState['filters']> }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'SET_DARK_MODE'; payload: boolean }

const initialState: AppState = {
  darkMode: false,
  searchHistory: [],
  recentlyViewed: [],
  notifications: [],
  filters: {
    priceRange: [0, 10000],
    categories: [],
    sortBy: 'date'
  }
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_DARK_MODE':
      return { ...state, darkMode: action.payload }

    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode }
      
    case 'ADD_SEARCH_HISTORY':
      const newSearchHistory = [action.payload, ...state.searchHistory.filter(s => s !== action.payload)].slice(0, 10)
      return { ...state, searchHistory: newSearchHistory }
    
    case 'ADD_RECENTLY_VIEWED':
      const newRecentlyViewed = [action.payload, ...state.recentlyViewed.filter(id => id !== action.payload)].slice(0, 20)
      return { ...state, recentlyViewed: newRecentlyViewed }
    
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      }
    
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      }
    
    case 'UPDATE_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      }
    
    case 'CLEAR_FILTERS':
      return {
        ...state,
        filters: initialState.filters
      }
    
    default:
      return state
  }
}

interface AppContextType {
  state: AppState
  dispatch: React.Dispatch<AppAction>
  toggleDarkMode: () => void
  addSearchHistory: (query: string) => void
  addRecentlyViewed: (productId: string) => void
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  updateFilters: (filters: Partial<AppState['filters']>) => void
  clearFilters: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const initializeState = (initialState: AppState): AppState => {
  if (typeof window === 'undefined') return initialState

  try {
    const serializedState = localStorage.getItem('app-state')
    if (serializedState) {
      const savedState = JSON.parse(serializedState)
      return { ...initialState, ...savedState }
    }
  } catch (e) {
    console.error("Falha ao analisar o estado do aplicativo do localStorage", e)
  }

  return initialState
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState, initializeState)
  const { setTheme, resolvedTheme } = useTheme()

  // Efeito para sincronizar o tema resolvido do next-themes com o estado do nosso contexto
  // Este useEffect agora é a fonte de verdade para o nosso tema, evitando o "flicker"
  useEffect(() => {
    if (resolvedTheme && (resolvedTheme === 'dark') !== state.darkMode) {
      dispatch({ type: 'SET_DARK_MODE', payload: resolvedTheme === 'dark' })
    }
  }, [resolvedTheme, state.darkMode])

  // Persistir estado no localStorage
  useEffect(() => {
    localStorage.setItem('app-state', JSON.stringify(state))
  }, [state])

  const toggleDarkMode = useCallback(() => {
    // Ao alternar o tema, chamamos o dispatch para atualizar o estado interno,
    // e o next-themes se encarrega de atualizar a classe no <html>.
    // O useEffect acima irá sincronizar o resolvedTheme de volta para o estado.
    dispatch({ type: 'TOGGLE_DARK_MODE' })
    setTheme(state.darkMode ? 'light' : 'dark')
  }, [state.darkMode, setTheme])

  const addSearchHistory = useCallback((query: string) => {
    dispatch({ type: 'ADD_SEARCH_HISTORY', payload: query })
  }, [])

  const addRecentlyViewed = useCallback((productId: string) => {
    dispatch({ type: 'ADD_RECENTLY_VIEWED', payload: productId })
  }, [])

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    dispatch({ type: 'ADD_NOTIFICATION', payload: { ...notification, id } })
  }, [])

  const removeNotification = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id })
  }, [])

  const updateFilters = useCallback((filters: Partial<AppState['filters']>) => {
    dispatch({ type: 'UPDATE_FILTERS', payload: filters })
  }, [])

  const clearFilters = useCallback(() => {
    dispatch({ type: 'CLEAR_FILTERS' })
  }, [])

  const value: AppContextType = {
    state,
    dispatch,
    toggleDarkMode,
    addSearchHistory,
    addRecentlyViewed,
    addNotification,
    removeNotification,
    updateFilters,
    clearFilters,
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}