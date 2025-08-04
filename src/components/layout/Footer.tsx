"use client"

export function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-6 border-t border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400 md:text-base">
          &copy; {new Date().getFullYear()} STG Catalog. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
