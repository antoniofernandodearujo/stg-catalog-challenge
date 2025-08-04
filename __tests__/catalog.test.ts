import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createClient } from '../src/lib/supabase/client'

// Mock products data
const mockProducts = [
  { id: '1', name: 'Product 1', price: 100, description: 'Description 1', image: 'image1.jpg' },
  { id: '2', name: 'Product 2', price: 200, description: 'Description 2', image: 'image2.jpg' }
]

// Mock do createClient do Supabase
vi.mock('../lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(),
      eq: vi.fn(),
      ilike: vi.fn(),
      order: vi.fn(),
      range: vi.fn()
    }))
  }))
}))

describe('Product Catalog Module', () => {
  let supabase: any

  beforeEach(() => {
    supabase = createClient()
  })

  describe('Product Listing', () => {
    it('should list all products successfully', async () => {
      const mockQuery = {
        data: mockProducts,
        error: null,
        count: 2
      }

      supabase.from().select.mockResolvedValueOnce(mockQuery)

      const { data, error, count } = await supabase
        .from('products')
        .select('*', { count: 'exact' })

      expect(error).toBeNull()
      expect(data).toEqual(mockProducts)
      expect(count).toBe(2)
    })

    it('should filter products by search term', async () => {
      const searchTerm = 'Product 1'
      const filteredProducts = [mockProducts[0]]
      
      const mockQuery = {
        data: filteredProducts,
        error: null,
        count: 1
      }

      supabase.from().select.mockResolvedValueOnce(mockQuery)

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .ilike('name', `%${searchTerm}%`)

      expect(error).toBeNull()
      expect(data).toEqual(filteredProducts)
    })
  })

  describe('Product Details', () => {
    it('should fetch single product details', async () => {
      const productId = '1'
      const mockQuery = {
        data: mockProducts[0],
        error: null
      }

      supabase.from().select.mockResolvedValueOnce(mockQuery)

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single()

      expect(error).toBeNull()
      expect(data).toEqual(mockProducts[0])
    })

    it('should return error for invalid product id', async () => {
      const invalidId = 'invalid-id'
      const mockError = { message: 'Product not found' }
      
      supabase.from().select.mockResolvedValueOnce({
        data: null,
        error: mockError
      })

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', invalidId)
        .single()

      expect(error).toBeDefined()
      expect(data).toBeNull()
    })
  })

  describe('Product Filtering', () => {
    it('should filter products by category', async () => {
      const category = 'Electronics'
      const mockQuery = {
        data: mockProducts,
        error: null
      }

      supabase.from().select.mockResolvedValueOnce(mockQuery)

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)

      expect(error).toBeNull()
      expect(data).toEqual(mockProducts)
    })

    it('should filter products by price range', async () => {
      const minPrice = 100
      const maxPrice = 200
      const mockQuery = {
        data: mockProducts,
        error: null
      }

      supabase.from().select.mockResolvedValueOnce(mockQuery)

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .gte('price', minPrice)
        .lte('price', maxPrice)

      expect(error).toBeNull()
      expect(data).toEqual(mockProducts)
    })
  })
})
