"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useApp } from "@/contexts/app-context"
import { loginSchema, type LoginFormData } from "@/lib/validations"
import { Loader2, Eye, EyeOff } from "lucide-react"

export function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Partial<LoginFormData>>({})
  const [loading, setLoading] = useState(false)
  const [viewPassword, setViewPassword] = useState(false)
  const router = useRouter()

  const supabase = createClient()
  const { addNotification } = useApp()

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Limpar erro do campo quando o usuário começa a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      // Validar com Zod
      const validatedData = loginSchema.parse(formData)

      const { error } = await supabase.auth.signInWithPassword({
        email: validatedData.email,
        password: validatedData.password,
      })

      if (error) {
        addNotification({
          type: "error",
          title: "Erro no login",
          message: error.message,
        })
        console.error("Login error:", error)
        return
      }

      addNotification({
        type: "success",
        title: "Login realizado com sucesso!",
        message: "Redirecionando para o catálogo...",
      })

      router.push("/catalog")
      router.refresh()
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        // Erro de validação Zod
        const zodError = error as any
        const fieldErrors: Partial<LoginFormData> = {}
        
        zodError.errors.forEach((err: any) => {
          const field = err.path[0] as keyof LoginFormData
          fieldErrors[field] = err.message
        })
        
        setErrors(fieldErrors)
      } else {
        addNotification({
          type: "error",
          title: "Erro inesperado",
          message: "Ocorreu um erro durante o login. Tente novamente.",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          className={errors.email ? "border-red-500 focus:border-red-500" : ""}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <div className="relative">
          <Input
            id="password"
            type={viewPassword ? "text" : "password"}
            placeholder="Sua senha"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            className={errors.password ? "border-red-500 focus:border-red-500" : ""}
          />

          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
            onClick={() => setViewPassword(!viewPassword)}
          >
            {viewPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password}</p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Entrar
      </Button>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Não tem uma conta?{" "}
          <Link href="/auth/register" className="text-primary hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </form>
  )
}
