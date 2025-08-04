import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AppProvider } from "@/contexts/app-context"
import { CartProvider } from "@/hooks/use-cart"
import { AuthProvider } from "@/components/providers/auth-provider"
import { ToastNotifications } from "@/components/ui/toast-notifications"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "STG Catalog - Catálogo de Produtos",
  description: "Catálogo de produtos com filtros avançados, lista de desejos e experiência mobile otimizada",
  keywords: "catálogo, produtos, e-commerce, compras online",
  authors: [{ name: "STG Catalog" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "STG Catalog - Catálogo de Produtos",
    description: "Catálogo de produtos com filtros avançados e experiência mobile otimizada",
    type: "website",
    locale: "pt_BR",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <CartProvider>
              <AppProvider>
                {children}
                <ToastNotifications />
              </AppProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
