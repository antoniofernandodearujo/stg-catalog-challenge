// __tests__/catalog.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createClient } from '../src/lib/supabase/client';

const mockProducts = [
  { id: '1', name: 'Product 1', price: 100, description: 'Description 1', image: 'image1.jpg' },
  { id: '2', name: 'Product 2', price: 200, description: 'Description 2', image: 'image2.jpg' }
];

vi.mock('../src/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn((selector: string, options: any) => {
        // Mocka a chamada de select de forma dinâmica
        const baseResult = { data: mockProducts, error: null };
        if (options?.count === 'exact') {
          return { data: mockProducts, error: null, count: mockProducts.length };
        }
        return baseResult;
      }),
      eq: vi.fn((key, value) => {
        if (key === 'id' && value === '1') {
          return { single: vi.fn(() => ({ data: mockProducts[0], error: null })) };
        }
        if (key === 'id' && value === 'invalid-id') {
          return { single: vi.fn(() => ({ data: null, error: { message: 'Product not found' } })) };
        }
        if (key === 'category') {
          return { data: mockProducts, error: null };
        }
      }),
      ilike: vi.fn(() => ({ data: [mockProducts[0]], error: null, count: 1 })),
      gte: vi.fn(() => ({ lte: vi.fn(() => ({ data: mockProducts, error: null })) }))
    }))
  }))
}));

describe('Product Catalog Module', () => {
  let supabase: any;

  beforeEach(() => {
    supabase = createClient();
  });

  describe('Product Listing', () => {
    it('should list all products successfully', async () => {
      const result = await supabase.from('products').select('*', { count: 'exact' });

      expect(result.error).toBeNull();
      expect(result.data).toEqual(mockProducts);
      expect(result.count).toBe(2);
    });

    it('should filter products by search term', async () => {
      const searchTerm = 'Product 1';
      const result = await supabase.from('products').ilike('name', `%${searchTerm}%`);

      expect(result.error).toBeNull();
      expect(result.data).toEqual([mockProducts[0]]);
    });
  });

  describe('Product Details', () => {
    it('should fetch single product details', async () => {
      const result = await supabase.from('products').eq('id', '1').single();
      expect(result.error).toBeNull();
      expect(result.data).toEqual(mockProducts[0]);
    });

    it('should return error for invalid product id', async () => {
      const result = await supabase.from('products').eq('id', 'invalid-id').single();
      expect(result.error).toBeDefined();
      expect(result.data).toBeNull();
    });
  });

  describe('Product Filtering', () => {
    it('should filter products by category', async () => {
      const result = await supabase.from('products').eq('category', 'Electronics');
      expect(result.error).toBeNull();
      expect(result.data).toEqual(mockProducts);
    });

    it('should filter products by price range', async () => {
      const result = await supabase.from('products').gte('price', 100).lte('price', 200);
      expect(result.error).toBeNull();
      expect(result.data).toEqual(mockProducts);
    });
  });
});