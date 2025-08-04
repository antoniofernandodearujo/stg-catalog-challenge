import { createClient } from "@/src/lib/supabase/server"
import { ProductGrid } from "@/src/components/catalog/ProductGrid"
import { SearchAutocomplete } from "@/src/components/catalog/SearchAutocomplete"
import { AdvancedFilters } from "@/src/components/catalog/AdvancedFilters"
import { MobilePagination } from "@/src/components/catalog/MobilePagination"
import { Header } from "@/src/components/layout/Header"
import { Breadcrumbs } from "@/src/components/ui/breadcrumbs"
import { ProductGridSkeleton } from "@/src/components/ui/skeleton"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/src/components/ui/pagination"
import { Suspense } from "react"

// Use um número menor de itens por página no mobile
const ITEMS_PER_PAGE = 8

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ 
    search?: string; 
    category?: string; 
    page?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  }>
}) {
  const supabase = await createClient()
  
  // Verificar se o usuário está logado (opcional)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Await the searchParams promise in Next.js 15
  const params = await searchParams
  const searchTerm = params.search || ""
  const category = params.category
  const currentPage = Number(params.page) || 1
  const minPrice = params.minPrice ? Number(params.minPrice) : 0
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : 10000
  const sortBy = params.sort || "date"

  // Fetch categories first
  const { data: categories } = await supabase
    .from("products")
    .select("category")
    .order("category")

  // Get unique categories and remove duplicates
  const uniqueCategories = Array.from(
    new Set(categories?.map(item => item.category).filter(Boolean) || [])
  ).sort()

  // Fetch max price for filters
  const { data: maxPriceData } = await supabase
    .from("products")
    .select("price")
    .order("price", { ascending: false })
    .limit(1)

  const maxPriceForFilters = maxPriceData?.[0]?.price || 10000

  // Fetch products with filters, pagination and count
  let query = supabase
    .from("products")
    .select("*", { count: "exact" })

  // Apply search filter
  if (searchTerm) {
    query = query.ilike("name", `%${searchTerm}%`)
  }

  // Apply category filter
  if (category) {
    query = query.eq("category", category)
  }

  // Apply price range filter
  if (minPrice > 0 || maxPrice < maxPriceForFilters) {
    query = query.gte("price", minPrice).lte("price", maxPrice)
  }

  // Apply sorting
  // Apply sorting
  switch (sortBy) {
    case "name":
      query = query.order("name", { ascending: true })
      break
    case "price":
      query = query.order("price", { ascending: true })
      break
    case "rating":
      query = query.order("rating", { ascending: false })
      break
    default:
      query = query.order("created_at", { ascending: false })
  }

  // Apply pagination after filters to ensure correct counts
  query = query.range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1)

  const { data: products, error, count } = await query

  if (error) {
    console.error("Error fetching products:", error)
    return <div>Erro ao carregar produtos</div>
  }

  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE)

  // Função para gerar URL com parâmetros
  const generatePageUrl = (page: number) => {
    const params = new URLSearchParams()
    if (searchTerm) params.set("search", searchTerm)
    if (category) params.set("category", category)
    if (minPrice > 0) params.set("minPrice", minPrice.toString())
    if (maxPrice < maxPriceForFilters) params.set("maxPrice", maxPrice.toString())
    if (sortBy !== "date") params.set("sort", sortBy)
    params.set("page", String(page))
    return `/catalog?${params.toString()}`
  }

  const breadcrumbItems = [
    { label: "Catálogo", href: "/catalog" },
    ...(category ? [{ label: category, href: `/catalog?category=${category}` }] : []),
    ...(searchTerm ? [{ label: `Busca: ${searchTerm}` }] : [])
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 pb-20 md:pb-8">
        {/* Breadcrumbs */}
        <div className="mb-4 sm:mb-6">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <div className="mb-6 sm:mb-8 space-y-4 sm:space-y-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
            Catálogo de Produtos
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <SearchAutocomplete initialValue={searchTerm} />
          </div>
          
          <AdvancedFilters categories={uniqueCategories} maxPrice={maxPriceForFilters} />
        </div>

        <Suspense fallback={<ProductGridSkeleton count={8} />}>
          <ProductGrid products={products || []} user={user} />
        </Suspense>

        {/* Paginação Desktop */}
        {totalPages > 1 && (
          <div className="mt-8 hidden md:block">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href={generatePageUrl(Math.max(1, currentPage - 1))}
                  />
                </PaginationItem>
                
                {(() => {
                  const pages = [];
                  
                  if (totalPages <= 7) {
                    // Se tem 7 páginas ou menos, mostra todas
                    for (let i = 1; i <= totalPages; i++) {
                      pages.push(i);
                    }
                  } else {
                    // Sempre mostra a primeira página
                    pages.push(1);
                    
                    if (currentPage <= 4) {
                      // Se estamos no início, mostra 1,2,3,4,5...último
                      for (let i = 2; i <= 5; i++) {
                        pages.push(i);
                      }
                      pages.push('ellipsis');
                      pages.push(totalPages);
                    } else if (currentPage >= totalPages - 3) {
                      // Se estamos no final, mostra 1...últimas 5 páginas
                      pages.push('ellipsis');
                      for (let i = totalPages - 4; i <= totalPages; i++) {
                        pages.push(i);
                      }
                    } else {
                      // Se estamos no meio, mostra 1...atual-1,atual,atual+1...último
                      pages.push('ellipsis');
                      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                        pages.push(i);
                      }
                      pages.push('ellipsis');
                      pages.push(totalPages);
                    }
                  }
                  
                  return pages.map((page, index) => {
                    if (page === 'ellipsis') {
                      return (
                        <PaginationItem key={`ellipsis-${index}`}>
                          <span className="flex size-9 items-center justify-center">...</span>
                        </PaginationItem>
                      );
                    }
                    
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href={generatePageUrl(page as number)}
                          isActive={page === currentPage}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  });
                })()}
                
                <PaginationItem>
                  <PaginationNext
                    href={generatePageUrl(Math.min(totalPages, currentPage + 1))}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {/* Paginação Mobile */}
        {totalPages > 1 && (
          <MobilePagination
            currentPage={currentPage}
            totalPages={totalPages}
            searchTerm={searchTerm}
            category={category}
            minPrice={minPrice}
            maxPrice={maxPrice}
            sortBy={sortBy}
            maxPriceForFilters={maxPriceForFilters}
          />
        )}
      </main>
    </div>
  )
}
