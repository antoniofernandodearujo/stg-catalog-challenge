"use client"

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/src/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Algo deu errado
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Ocorreu um erro inesperado. Tente recarregar a página ou entre em contato com o suporte.
            </p>

            {this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Detalhes do erro
                </summary>
                <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}

            <div className="space-x-4">
              <Button onClick={this.handleRetry} className="inline-flex items-center">
                <RefreshCw className="w-4 h-4 mr-2" />
                Tentar Novamente
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
              >
                Recarregar Página
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
} 