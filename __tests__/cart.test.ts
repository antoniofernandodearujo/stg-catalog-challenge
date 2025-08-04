import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCart } from '../src/hooks/useCart'
import { renderHook, act } from '@testing-library/react'

// Mock product data
const mockProduct = {
  id: '1',
  name: 'Test Product',
  price: 100,
  description: 'Test Description',
  image_url: 'test.jpg',
  category: 'Test Category',
  created_at: new Date().toISOString()
}

describe('Cart Module', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  describe('Cart Operations', () => {
    it('should add item to cart', async () => {
      const { result } = renderHook(() => useCart())

      await act(async () => {
        await result.current.addToCart(mockProduct)
      })

      expect(result.current.cartItems).toHaveLength(1)
      expect(result.current.cartItems[0].product).toEqual(mockProduct)
      expect(result.current.cartItems[0].quantity).toBe(1)
    })

    it('should update quantity of existing item', async () => {
      const { result } = renderHook(() => useCart())

      await act(async () => {
        await result.current.addToCart(mockProduct)
        await result.current.updateQuantity(mockProduct.id, 3)
      })

      expect(result.current.cartItems).toHaveLength(1)
      expect(result.current.cartItems[0].quantity).toBe(3)
    })

    it('should remove item from cart', async () => {
      const { result } = renderHook(() => useCart())

      await act(async () => {
        await result.current.addToCart(mockProduct)
        await result.current.removeFromCart(mockProduct.id)
      })

      expect(result.current.cartItems).toHaveLength(0)
    })

    it('should clear cart', async () => {
      const { result } = renderHook(() => useCart())

      await act(async () => {
        await result.current.addToCart(mockProduct)
        await result.current.addToCart({ ...mockProduct, id: '2' })
        await result.current.clearCart()
      })

      expect(result.current.cartItems).toHaveLength(0)
    })
  })

  describe('Cart Calculations', () => {
    it('should calculate correct cart total', async () => {
      const { result } = renderHook(() => useCart())

      await act(async () => {
        await result.current.addToCart(mockProduct) // quantity: 1, price: 100
        await result.current.addToCart({ ...mockProduct, id: '2', price: 200 }) // quantity: 1, price: 200
      })

      const total = result.current.getCartTotal()
      expect(total).toBe(300)
    })

    it('should calculate correct total with quantity updates', async () => {
      const { result } = renderHook(() => useCart())

      await act(async () => {
        await result.current.addToCart(mockProduct)
        await result.current.updateQuantity(mockProduct.id, 3)
      })

      const total = result.current.getCartTotal()
      expect(total).toBe(300) // 3 x 100
    })
  })

  describe('Cart Persistence', () => {
    it('should persist cart items in localStorage', async () => {
      const { result } = renderHook(() => useCart())

      await act(async () => {
        await result.current.addToCart(mockProduct)
      })

      const storedCart = JSON.parse(localStorage.getItem('cart-items') || '[]')
      expect(storedCart).toHaveLength(1)
      expect(storedCart[0].product).toEqual(mockProduct)
    })

    it('should load cart items from localStorage', () => {
      // Pre-populate localStorage
      localStorage.setItem('cart-items', JSON.stringify([
        { product: mockProduct, quantity: 2 }
      ]))

      const { result } = renderHook(() => useCart())

      expect(result.current.cartItems).toHaveLength(1)
      expect(result.current.cartItems[0].quantity).toBe(2)
    })
  })
})
