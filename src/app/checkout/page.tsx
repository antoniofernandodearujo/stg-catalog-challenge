import { createClient } from "@/src/lib/supabase/server"
import { CheckoutPage } from "@/src/components/checkout/CheckoutPage"
import { Header } from "@/src/components/layout/Header"
import { redirect } from "next/navigation"

export default async function Checkout() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <CheckoutPage user={user} />
      </main>
    </div>
  )
}
