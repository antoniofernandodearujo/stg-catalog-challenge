/// <reference types="vitest/globals" />

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCart, CartProvider } from '../src/hooks/useCart';
import { renderHook, act } from '@testing-library/react';
import type { CartItem, Product } from '../src/lib/types';
import type { User } from '@supabase/supabase-js';

// Mocks
const mockProduct = {
  id: '1',
  name: 'Test Product',
  price: 100,
  description: 'Test Description',
  image_url: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
  category: 'Test Category',
  created_at: new Date().toISOString()
} as Product;

const mockUser: User = {
  id: 'user-123',
  aud: '',
  role: '',
  email: 'test@example.com',
  email_confirmed_at: '',
  phone: '',
  created_at: '',
  updated_at: '',
  app_metadata: {},
  user_metadata: {},
};

// Mocks globais para evitar hoisting
// Eles serão redefinidos em cada teste
const useAuthMock = vi.fn();
const createClientMock = vi.fn();
const toastMock = vi.fn();

// Mock do Supabase
const supabaseMock = {
  from: vi.fn(() => supabaseMock),
  select: vi.fn(() => supabaseMock),
  insert: vi.fn(() => supabaseMock),
  update: vi.fn(() => supabaseMock),
  delete: vi.fn(() => supabaseMock),
  eq: vi.fn(() => supabaseMock),
};

// Vi.mock é elevado, então ele precisa ser self-contained
vi.mock('../src/lib/supabase/client', () => ({
  createClient: createClientMock,
}));

vi.mock('../src/hooks/useAuth', () => ({
  useAuth: useAuthMock,
}));

vi.mock('../src/hooks/useToast', () => ({
  toast: toastMock,
}));

describe('Cart Module', () => {
  let cartItemsData: CartItem[] = [];

  beforeEach(() => {
    vi.clearAllMocks();
    cartItemsData = [];
    useAuthMock.mockReturnValue({ user: mockUser });
    createClientMock.mockReturnValue(supabaseMock);

    // Simula o comportamento do Supabase
    (supabaseMock.select as vi.MockedFunction<any>).mockResolvedValue({ data: cartItemsData, error: null });

    (supabaseMock.insert as vi.MockedFunction<any>).mockImplementation((item: any) => {
      const newCartItem = {
        ...item,
        id: `item-${Date.now()}`,
        product: mockProduct,
      };
      cartItemsData.push(newCartItem);
      (supabaseMock.select as vi.MockedFunction<any>).mockResolvedValue({ data: cartItemsData, error: null });
      return { data: [newCartItem], error: null };
    });

    (supabaseMock.update as vi.MockedFunction<any>).mockImplementation(({ quantity }) => {
      const itemId = (supabaseMock.eq as vi.MockedFunction<any>).mock.calls[0][1];
      const itemToUpdate = cartItemsData.find(item => item.id === itemId);
      if (itemToUpdate) {
        itemToUpdate.quantity = quantity;
      }
      (supabaseMock.select as vi.MockedFunction<any>).mockResolvedValue({ data: cartItemsData, error: null });
      return { data: itemToUpdate ? [itemToUpdate] : [], error: null };
    });

    (supabaseMock.delete as vi.MockedFunction<any>).mockImplementation(() => {
      const itemId = (supabaseMock.eq as vi.MockedFunction<any>).mock.calls[0][1];
      cartItemsData = cartItemsData.filter(cartItem => cartItem.id !== itemId);
      (supabaseMock.select as vi.MockedFunction<any>).mockResolvedValue({ data: cartItemsData, error: null });
      return { data: [], error: null };
    });
  });

  describe('Cart Operations', () => {
    it('should add item to cart', async () => {
      const { result } = renderHook(() => useCart(), { wrapper: CartProvider });
      
      // Simula a resposta inicial vazia do Supabase
      (supabaseMock.select as vi.MockedFunction<any>).mockResolvedValueOnce({ data: [], error: null });

      await act(async () => {
        await result.current.addToCart(mockProduct);
      });

      expect(result.current.cartItems).toHaveLength(1);
      expect(result.current.cartItems[0].product).toEqual(mockProduct);
      expect(result.current.cartItems[0].quantity).toBe(1);
    });

    it('should add item to cart if it already exists', async () => {
      cartItemsData.push({ product: mockProduct, quantity: 1, product_id: mockProduct.id, id: 'item-1', user_id: mockUser.id });
      const { result } = renderHook(() => useCart(), { wrapper: CartProvider });

      await act(async () => {
        await result.current.addToCart(mockProduct);
      });

      expect(result.current.cartItems).toHaveLength(1);
      expect(result.current.cartItems[0].quantity).toBe(2);
    });

    it('should update quantity of existing item', async () => {
      cartItemsData.push({ product: mockProduct, quantity: 1, product_id: mockProduct.id, id: 'item-1', user_id: mockUser.id });
      const { result } = renderHook(() => useCart(), { wrapper: CartProvider });

      await act(async () => {
        await result.current.updateQuantity('item-1', 3);
      });

      expect(result.current.cartItems).toHaveLength(1);
      expect(result.current.cartItems[0].quantity).toBe(3);
    });

    it('should remove item from cart', async () => {
      cartItemsData.push({ product: mockProduct, quantity: 1, product_id: mockProduct.id, id: 'item-1', user_id: mockUser.id });
      const { result } = renderHook(() => useCart(), { wrapper: CartProvider });

      await act(async () => {
        await result.current.removeFromCart('item-1');
      });

      expect(result.current.cartItems).toHaveLength(0);
    });

    it('should clear cart', async () => {
      cartItemsData.push(
        { product: mockProduct, quantity: 1, product_id: mockProduct.id, id: 'item-1', user_id: mockUser.id },
        { product: { ...mockProduct, id: '2' }, quantity: 1, product_id: '2', id: 'item-2', user_id: mockUser.id }
      );
      const { result } = renderHook(() => useCart(), { wrapper: CartProvider });

      await act(async () => {
        await result.current.clearCart();
      });

      expect(result.current.cartItems).toHaveLength(0);
    });
  });

  describe('Cart Calculations', () => {
    it('should calculate correct cart total', async () => {
      cartItemsData.push(
        { product: mockProduct, quantity: 1, product_id: mockProduct.id, id: 'item-1', user_id: mockUser.id },
        { product: { ...mockProduct, id: '2', price: 200 }, quantity: 1, product_id: '2', id: 'item-2', user_id: mockUser.id }
      );
      const { result } = renderHook(() => useCart(), { wrapper: CartProvider });

      const total = result.current.getCartTotal();
      expect(total).toBe(300);
    });

    it('should calculate correct total with quantity updates', async () => {
      cartItemsData.push({ product: mockProduct, quantity: 3, product_id: mockProduct.id, id: 'item-1', user_id: mockUser.id });
      const { result } = renderHook(() => useCart(), { wrapper: CartProvider });

      const total = result.current.getCartTotal();
      expect(total).toBe(300);
    });
  });
});