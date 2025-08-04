import { createClient } from "@/src/lib/supabase/server"
import { ProductDetail } from "@/src/components/catalog/ProductDetail"
import { Header } from "@/src/components/layout/Header"
import { notFound } from "next/navigation"

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient()
  
  // Verificar se o usuário está logado (opcional)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Await the params promise in Next.js 15
  const { id } = await params
  const { data: product, error } = await supabase.from("products").select("*").eq("id", id).single()

  if (error || !product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductDetail product={product} user={user} />
      </main>
    </div>
  )
}
