"use client"

import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { ShoppingCart, LogOut, User, LogIn } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useApp } from "@/contexts/app-context"

export function Header() {
  const { user, signOut } = useAuth()
  const { cartItems } = useCart()
  const { state } = useApp()

  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/catalog" className="text-2xl font-bold text-primary">
              STG Catalog
            </Link>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Cart */}
            <Link href="/cart" className="relative">
              <Button variant="outline" size="sm">
                <ShoppingCart className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Carrinho</span>
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">
                    {user?.user_metadata?.full_name || user?.email}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={user ? signOut : () => window.location.href = '/auth/login'}>

                  {
                    user ? (
                      <>
                        <LogOut className="h-4 w-4 mr-2" />
                        Sair
                      </>
                    ) : (
                      <>
                        <LogIn className="h-4 w-4 mr-2" />
                        Fazer Login
                      </>
                    )
                  }

                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
