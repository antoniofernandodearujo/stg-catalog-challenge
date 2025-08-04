import { createClient } from "@/lib/supabase/server"
import { CartPage } from "@/components/cart/cart-page"
import { Header } from "@/components/layout/Header"
import { redirect } from "next/navigation"

export default async function Cart() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CartPage />
      </main>
    </div>
  )
}
