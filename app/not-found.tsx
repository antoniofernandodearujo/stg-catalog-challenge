import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/layout/Header"
import { BackButton } from "@/components/ui/back-button"
import { Home, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="text-center space-y-8 max-w-md">
          {/* 404 Number */}
          <div className="space-y-4">
            <h1 className="text-8xl sm:text-9xl font-bold text-primary/20 select-none">
              404
            </h1>
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Página não encontrada
              </h2>
              <p className="text-muted-foreground">
                A página que você está procurando não existe ou foi movida.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/">
              <Button className="w-full sm:w-auto">
                <Home className="w-4 h-4 mr-2" />
                Ir para o Início
              </Button>
            </Link>
            
            <Link href="/catalog">
              <Button variant="outline" className="w-full sm:w-auto">
                <Search className="w-4 h-4 mr-2" />
                Explorar Catálogo
              </Button>
            </Link>
          </div>

          {/* Back Button */}
          <div className="pt-4">
            <BackButton />
          </div>

          {/* Help Text */}
          <div className="pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Se você acredita que isso é um erro, entre em contato conosco.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
} 