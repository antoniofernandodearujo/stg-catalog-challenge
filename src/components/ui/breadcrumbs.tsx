"use client"

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/src/lib/utils'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav className={cn("flex items-center space-x-1 text-sm text-gray-500 dark:text-white", className)}>
      <Link 
        href="/" 
        className="flex items-center hover:text-gray-700 transition-colors duration-200"
      >
        <Home className="h-4 w-4" />
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-1 dark:text-white">
          <ChevronRight className="h-4 w-4 text-gray-400" />
          {item.href && index < items.length - 1 ? (
            <Link
              href={item.href}
              className="hover:text-gray-700 transition-colors duration-200 dark:text-white"
            >
              {item.label}
            </Link>
          ) : (
            <span className={cn(
              index === items.length - 1 ? "text-gray-900 font-medium dark:text-white" : "text-gray-500"
            )}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
} 