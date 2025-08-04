import { describe, it, expect, vi } from 'vitest'
import { generateWhatsAppMessage } from '../src/lib/utils'

describe('WhatsApp Integration', () => {
  const mockUser = {
    id: '1',
    email: 'test@example.com',
    user_metadata: {
      full_name: 'Test User'
    }
  }

  const mockCartItems = [
    {
      product: {
        id: '1',
        name: 'Product 1',
        price: 100,
        description: 'Description 1',
        image_url: 'image1.jpg',
        category: 'Category 1',
        created_at: new Date().toISOString()
      },
      quantity: 2
    },
    {
      product: {
        id: '2',
        name: 'Product 2',
        price: 150,
        description: 'Description 2',
        image_url: 'image2.jpg',
        category: 'Category 2',
        created_at: new Date().toISOString()
      },
      quantity: 1
    }
  ]

  describe('Message Generation', () => {
    it('should generate correctly formatted WhatsApp message', () => {
      const total = 350 // (2 * 100) + (1 * 150)
      const message = generateWhatsAppMessage(mockUser, mockCartItems, total)

      // Verify message contains all required components
      expect(message).toContain('NOVO PEDIDO')
      expect(message).toContain(mockUser.user_metadata.full_name)
      expect(message).toContain(mockUser.email)
      expect(message).toContain('Product 1')
      expect(message).toContain('Product 2')
      expect(message).toContain('R$ 350,00') // Total formatado em BRL
    })

    it('should handle user without full_name', () => {
      const userWithoutName = { ...mockUser, user_metadata: {} }
      const total = 350
      const message = generateWhatsAppMessage(userWithoutName, mockCartItems, total)

      expect(message).toContain(userWithoutName.email)
      expect(message).not.toContain('undefined')
    })

    it('should format currency correctly', () => {
      const total = 1234.56
      const message = generateWhatsAppMessage(mockUser, mockCartItems, total)

      expect(message).toContain('R$ 1.234,56')
    })
  })

  describe('Cart Integration', () => {
    it('should generate correct total from cart items', () => {
      const expectedTotal = mockCartItems.reduce(
        (sum, item) => sum + (item.product.price * item.quantity), 
        0
      )

      expect(expectedTotal).toBe(350)
    })

    it('should include correct quantities in message', () => {
      const total = 350
      const message = generateWhatsAppMessage(mockUser, mockCartItems, total)

      mockCartItems.forEach(item => {
        expect(message).toContain(`Qtd: ${item.quantity}`)
      })
    })
  })

  describe('URL Generation', () => {
    it('should generate valid WhatsApp URL', () => {
      const total = 350
      const message = generateWhatsAppMessage(mockUser, mockCartItems, total)
      const whatsappUrl = `https://wa.me/5511999999999?text=${message}`

      expect(whatsappUrl).toMatch(/^https:\/\/wa\.me\/\d+\?text=.+/)
      expect(decodeURIComponent(whatsappUrl)).not.toContain('undefined')
      expect(decodeURIComponent(whatsappUrl)).not.toContain('null')
    })
  })
})
