import { renderHook, act } from '@testing-library/react';
import type { CartItem, Product } from '../src/lib/types';
import type { User } from '@supabase/supabase-js';
import { useCart, CartProvider } from '../src/hooks/useCart';

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

// Mock para o cliente Supabase
const supabaseMock = {
  from: jest.fn(() => supabaseMock),
  select: jest.fn(() => supabaseMock),
  insert: jest.fn(() => supabaseMock),
  update: jest.fn(() => supabaseMock),
  delete: jest.fn(() => supabaseMock),
  eq: jest.fn(() => supabaseMock),
  then: jest.fn(() => supabaseMock),
};

jest.mock('../src/lib/supabase/client', () => ({
  createClient: jest.fn(() => supabaseMock),
}));

// Mock para o hook de autenticação
jest.mock('../src/hooks/useAuth', () => ({
  useAuth: jest.fn(() => ({ user: mockUser })),
}));

// Mock para o hook de toast
jest.mock('../src/hooks/useToast', () => ({
  toast: jest.fn(),
}));

describe('Cart Module', () => {
  let cartItemsData: CartItem[] = [];

  // Mocks do supabase, agora com implementação mais precisa
  const mockSupabaseImplementation = () => ({
    select: () => ({
      eq: (key: string, value: any) => ({
        then: (callback: (arg0: { data: CartItem[]; error: null; }) => void) => {
          const result = cartItemsData.filter(item => item[key] === value);
          callback({ data: result, error: null });
        },
      }),
    }),
    // O insert agora adiciona o item e retorna
    insert: async (item: any) => {
      const newCartItem = {
        ...item,
        id: `item-${Date.now()}`,
        product: mockProduct,
      };
      cartItemsData.push(newCartItem);
      return { data: [newCartItem], error: null };
    },
    // O update agora recebe um objeto de dados e retorna uma mock de 'eq'
    update: (updateData: any) => ({
      eq: async (key: string, value: any) => {
        const itemToUpdate = cartItemsData.find(item => item[key] === value);
        if (itemToUpdate) {
          Object.assign(itemToUpdate, updateData);
        }
        return { data: itemToUpdate ? [itemToUpdate] : [], error: null };
      },
    }),
    // O delete continua o mesmo
    delete: () => ({
      eq: async (key: string, value: any) => {
        cartItemsData = cartItemsData.filter(item => item[key] !== value);
        return { data: [], error: null };
      },
    }),
  });

  beforeEach(() => {
    jest.clearAllMocks();
    cartItemsData = [];
    
    (supabaseMock.from as jest.Mock).mockImplementation(() => mockSupabaseImplementation());
  });

  // Renderiza o hook e espera a busca inicial do carrinho.
  // O `act` garante que o estado é atualizado antes do retorno do hook.
  const renderHookAndFetchCart = async () => {
    let hookResult: any;
    await act(async () => {
      hookResult = renderHook(() => useCart(), { wrapper: CartProvider });
    });
    return hookResult;
  };

  describe('Cart Operations', () => {
    it('should add item to cart', async () => {
      const { result } = await renderHookAndFetchCart();
      
      await act(async () => {
        await result.current.addToCart(mockProduct);
      });

      expect(result.current.cartItems).toHaveLength(1);
      expect(result.current.cartItems[0].product).toEqual(mockProduct);
      expect(result.current.cartItems[0].quantity).toBe(1);
    });

    it('should add item to cart if it already exists', async () => {
      cartItemsData.push({ product: mockProduct, quantity: 1, product_id: mockProduct.id, id: 'item-1', user_id: mockUser.id });
      
      const { result } = await renderHookAndFetchCart();

      await act(async () => {
        await result.current.addToCart(mockProduct);
      });

      expect(result.current.cartItems).toHaveLength(1);
      expect(result.current.cartItems[0].quantity).toBe(2);
    });

    it('should update quantity of existing item', async () => {
      cartItemsData.push({ product: mockProduct, quantity: 1, product_id: mockProduct.id, id: 'item-1', user_id: mockUser.id });
      
      const { result } = await renderHookAndFetchCart();

      await act(async () => {
        await result.current.updateQuantity('item-1', 3);
      });

      expect(result.current.cartItems).toHaveLength(1);
      expect(result.current.cartItems[0].quantity).toBe(3);
    });

    it('should remove item from cart', async () => {
      cartItemsData.push({ product: mockProduct, quantity: 1, product_id: mockProduct.id, id: 'item-1', user_id: mockUser.id });
      
      const { result } = await renderHookAndFetchCart();

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
      
      const { result } = await renderHookAndFetchCart();

      await act(async () => {
        await result.current.clearCart();
      });

      expect(result.current.cartItems).toHaveLength(0);
    });
  });

  describe('Cart Calculations', () => {
    // Agora o beforeEach já carrega o mock inicial, então não precisa duplicar.
    beforeEach(() => {
        cartItemsData.push(
            { product: mockProduct, quantity: 1, product_id: mockProduct.id, id: 'item-1', user_id: mockUser.id },
            { product: { ...mockProduct, id: '2', price: 200 }, quantity: 1, product_id: '2', id: 'item-2', user_id: mockUser.id }
        );
    });

    it('should calculate correct cart total', async () => {
      const { result } = await renderHookAndFetchCart();

      const total = result.current.getCartTotal();
      expect(total).toBe(300);
    });

    it('should calculate correct total with quantity updates', async () => {
      const { result } = await renderHookAndFetchCart();

      await act(async () => {
        await result.current.updateQuantity('item-1', 3);
      });

      const total = result.current.getCartTotal();
      expect(total).toBe(500); // 3 * 100 + 1 * 200 = 500
    });
  });
});