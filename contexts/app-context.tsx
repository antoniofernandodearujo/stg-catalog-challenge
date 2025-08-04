"use client"

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { useTheme } from 'next-themes'

interface AppState {
  darkMode: boolean
  wishlist: string[]
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
  | { type: 'ADD_TO_WISHLIST'; payload: string }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
  | { type: 'ADD_SEARCH_HISTORY'; payload: string }
  | { type: 'ADD_RECENTLY_VIEWED'; payload: string }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'UPDATE_FILTERS'; payload: Partial<AppState['filters']> }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'INITIALIZE_STATE'; payload: Partial<AppState> } // Nova ação para inicialização

const initialState: AppState = {
  darkMode: false, // Será sobrescrito pelo resolvedTheme ou localStorage
  wishlist: [],
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
    case 'INITIALIZE_STATE':
      // Mescla o estado carregado com o estado atual,
      // garantindo que o darkMode venha do payload (que será o resolvedTheme)
      return { ...state, ...action.payload };

    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode }
    
    case 'ADD_TO_WISHLIST':
      return {
        ...state,
        wishlist: state.wishlist.includes(action.payload)
          ? state.wishlist
          : [...state.wishlist, action.payload]
      }
    
    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        wishlist: state.wishlist.filter(id => id !== action.payload)
      }
    
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
  addToWishlist: (productId: string) => void
  removeFromWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  addSearchHistory: (query: string) => void
  addRecentlyViewed: (productId: string) => void
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  updateFilters: (filters: Partial<AppState['filters']>) => void
  clearFilters: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)
  const { setTheme, resolvedTheme } = useTheme() // Obtenha resolvedTheme aqui

  // Efeito para carregar o estado do localStorage E sincronizar o darkMode com next-themes
  useEffect(() => {
    let loadedState: Partial<AppState> = {};
    const savedState = localStorage.getItem('app-state');
    if (savedState) {
      try {
        loadedState = JSON.parse(savedState);
      } catch (e) {
        console.error("Falha ao analisar o estado do aplicativo do localStorage", e);
      }
    }

    // Sobrescreva o darkMode do localStorage (ou o padrão) com o resolvedTheme do next-themes
    // Isso é crucial para a sincronização inicial
    if (resolvedTheme !== undefined) { // resolvedTheme pode ser undefined na primeira renderização
      loadedState.darkMode = resolvedTheme === 'dark';
    }

    // Despache uma ação para inicializar o estado
    dispatch({ type: 'INITIALIZE_STATE', payload: loadedState });

  }, [resolvedTheme]); // Depende de resolvedTheme para garantir que ele esteja disponível

  // Persistir estado no localStorage (este useEffect está bom como está)
  useEffect(() => {
    localStorage.setItem('app-state', JSON.stringify(state))
  }, [state])

  // Sincronizar dark mode com next-themes (este useEffect está bom como está)
  useEffect(() => {
    if (state.darkMode) {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }, [state.darkMode, setTheme])

  const toggleDarkMode = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' })
  }

  const addToWishlist = (productId: string) => {
    dispatch({ type: 'ADD_TO_WISHLIST', payload: productId })
  }

  const removeFromWishlist = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId })
  }

  const isInWishlist = (productId: string) => {
    return state.wishlist.includes(productId)
  }

  const addSearchHistory = (query: string) => {
    dispatch({ type: 'ADD_SEARCH_HISTORY', payload: query })
  }

  const addRecentlyViewed = (productId: string) => {
    dispatch({ type: 'ADD_RECENTLY_VIEWED', payload: productId })
  }

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    dispatch({ type: 'ADD_NOTIFICATION', payload: { ...notification, id } })
  }

  const removeNotification = (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id })
  }

  const updateFilters = (filters: Partial<AppState['filters']>) => {
    dispatch({ type: 'UPDATE_FILTERS', payload: filters })
  }

  const clearFilters = () => {
    dispatch({ type: 'CLEAR_FILTERS' })
  }

  const value: AppContextType = {
    state,
    dispatch,
    toggleDarkMode,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    addSearchHistory,
    addRecentlyViewed,
    addNotification,
    removeNotification,
    updateFilters,
    clearFilters
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