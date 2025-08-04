"use client"

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { useApp } from '@/contexts/app-context'

const toastVariants = {
  initial: { opacity: 0, y: 50, scale: 0.3 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } }
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info
}

export function ToastNotifications() {
  const { state, removeNotification } = useApp()

  useEffect(() => {
    state.notifications.forEach(notification => {
      if (notification.duration !== 0) {
        const timer = setTimeout(() => {
          removeNotification(notification.id)
        }, notification.duration || 5000)

        return () => clearTimeout(timer)
      }
    })
  }, [state.notifications, removeNotification])

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {state.notifications.map((notification) => {
          const Icon = icons[notification.type]
          return (
            <motion.div
              key={notification.id}
              variants={toastVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={`
                flex items-center p-4 rounded-lg shadow-lg max-w-sm border
                ${notification.type === 'success' 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                  : ''
                }
                ${notification.type === 'error' 
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' 
                  : ''
                }
                ${notification.type === 'warning' 
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' 
                  : ''
                }
                ${notification.type === 'info' 
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
                  : ''
                }
              `}
            >
              <div className={`
                flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center
                ${notification.type === 'success' ? 'bg-green-500' : ''}
                ${notification.type === 'error' ? 'bg-red-500' : ''}
                ${notification.type === 'warning' ? 'bg-yellow-500' : ''}
                ${notification.type === 'info' ? 'bg-blue-500' : ''}
              `}>
                <Icon className="w-3 h-3 text-white" />
              </div>
              
              <div className="ml-3 flex-1">
                <p className={`
                  text-sm font-medium
                  ${notification.type === 'success' ? 'text-green-800 dark:text-green-200' : ''}
                  ${notification.type === 'error' ? 'text-red-800 dark:text-red-200' : ''}
                  ${notification.type === 'warning' ? 'text-yellow-800 dark:text-yellow-200' : ''}
                  ${notification.type === 'info' ? 'text-blue-800 dark:text-blue-200' : ''}
                `}>
                  {notification.title}
                </p>
                {notification.message && (
                  <p className={`
                    text-sm mt-1
                    ${notification.type === 'success' ? 'text-green-600 dark:text-green-300' : ''}
                    ${notification.type === 'error' ? 'text-red-600 dark:text-red-300' : ''}
                    ${notification.type === 'warning' ? 'text-yellow-600 dark:text-yellow-300' : ''}
                    ${notification.type === 'info' ? 'text-blue-600 dark:text-blue-300' : ''}
                  `}>
                    {notification.message}
                  </p>
                )}
              </div>
              
              <button
                onClick={() => removeNotification(notification.id)}
                className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
} 