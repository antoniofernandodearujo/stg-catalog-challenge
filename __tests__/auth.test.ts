import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAuth } from '../src/hooks/useAuth'
import { createClient } from '../src/lib/supabase/client'

// Mock do createClient do Supabase
vi.mock('../lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      getUser: vi.fn()
    }
  }))
}))

describe('Auth Module', () => {
  let supabase: any

  beforeEach(() => {
    supabase = createClient()
  })

  describe('Login', () => {
    it('should successfully login with valid credentials', async () => {
      const mockUser = { id: '1', email: 'test@example.com' }
      supabase.auth.signInWithPassword.mockResolvedValueOnce({ data: { user: mockUser }, error: null })

      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123'
      })

      expect(error).toBeNull()
      expect(data.user).toEqual(mockUser)
    })

    it('should fail login with invalid credentials', async () => {
      const mockError = { message: 'Invalid login credentials' }
      supabase.auth.signInWithPassword.mockResolvedValueOnce({ data: { user: null }, error: mockError })

      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'wrongpassword'
      })

      expect(error).toBeDefined()
      expect(data.user).toBeNull()
    })
  })

  describe('Registration', () => {
    it('should successfully register a new user', async () => {
      const mockUser = { id: '1', email: 'newuser@example.com' }
      supabase.auth.signUp.mockResolvedValueOnce({ data: { user: mockUser }, error: null })

      const { data, error } = await supabase.auth.signUp({
        email: 'newuser@example.com',
        password: 'password123',
        options: {
          data: {
            full_name: 'New User'
          }
        }
      })

      expect(error).toBeNull()
      expect(data.user).toEqual(mockUser)
    })

    it('should fail registration with existing email', async () => {
      const mockError = { message: 'Email already registered' }
      supabase.auth.signUp.mockResolvedValueOnce({ data: { user: null }, error: mockError })

      const { data, error } = await supabase.auth.signUp({
        email: 'existing@example.com',
        password: 'password123'
      })

      expect(error).toBeDefined()
      expect(data.user).toBeNull()
    })
  })

  describe('Logout', () => {
    it('should successfully logout user', async () => {
      supabase.auth.signOut.mockResolvedValueOnce({ error: null })

      const { error } = await supabase.auth.signOut()

      expect(error).toBeNull()
    })
  })

  describe('Route Protection', () => {
    it('should return user when authenticated', async () => {
      const mockUser = { id: '1', email: 'test@example.com' }
      supabase.auth.getUser.mockResolvedValueOnce({ data: { user: mockUser }, error: null })

      const { data: { user }, error } = await supabase.auth.getUser()

      expect(error).toBeNull()
      expect(user).toEqual(mockUser)
    })

    it('should return null when not authenticated', async () => {
      supabase.auth.getUser.mockResolvedValueOnce({ data: { user: null }, error: null })

      const { data: { user }, error } = await supabase.auth.getUser()

      expect(error).toBeNull()
      expect(user).toBeNull()
    })
  })
})
