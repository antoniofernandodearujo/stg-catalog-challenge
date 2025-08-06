"use client"

import { motion } from 'framer-motion'
import { Button } from '@/src/components/ui/button'
import { Sun, Moon } from 'lucide-react'
import { useApp } from '@/src/contexts/AppContext'

interface ThemeToggleProps {
  size?: 'sm' | 'lg' | 'icon'
  variant?: 'default' | 'outline' | 'ghost'
}

export function ThemeToggle({ size = 'sm', variant = 'ghost' }: ThemeToggleProps) {
  const { state, toggleDarkMode } = useApp()
  
  const iconSize = size === 'sm' ? 16 : size === 'icon' ? 16 : 20

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        variant={variant}
        size={size}
        onClick={toggleDarkMode}
        className="transition-colors duration-200"
      >
        <motion.div
          initial={false}
          animate={{ rotate: state.darkMode ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {state.darkMode ? (
            <>
            <Sun className={`h-${iconSize} w-${iconSize}`} />
            </>
          ) : (
            <Moon className={`h-${iconSize} w-${iconSize}`} />
          )}
        </motion.div>
      </Button>
    </motion.div>
  )
} 