import { createClient } from "@/src/lib/server"
import { ProductDetail } from "@/src/components/catalog/ProductDetail"
import { Header } from "@/src/components/layout/Header"
import { notFound } from "next/navigation"

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Espera o ID do produto
  const { id } = await params
  const { data: product, error } = await supabase.from("products").select("*").eq("id", id).single()

  if (error || !product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductDetail product={product} user={user} />
      </main>
    </div>
  )
}
