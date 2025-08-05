"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/src/lib/supabase/client"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { useApp } from "@/src/contexts/AppContext"
import { registerSchema, type RegisterFormData } from "@/src/lib/validations"
import { Loader2, Mail, Eye, EyeOff } from "lucide-react"

export function RegisterForm() {
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Partial<RegisterFormData>>({})
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [viewPassword, setViewPassword] = useState(false)
  const [viewConfirmPassword, setViewConfirmPassword] = useState(false)

  const supabase = createClient()
  const { addNotification } = useApp()

  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Limpa o erro do campo quando o usuário começa a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      // Valida com o Zod
      const validatedData = registerSchema.parse(formData)

      const { error } = await supabase.auth.signUp({
        email: validatedData.email,
        password: validatedData.password,
        options: {
          data: {
            full_name: validatedData.fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/login`,
        },
      })

      if (error) {
        addNotification({
          type: "error",
          title: "Erro no cadastro",
          message: error.message,
        })
        return
      }

      setEmailSent(true)
      addNotification({
        type: "success",
        title: "Cadastro realizado com sucesso!",
        message: "Verifique seu email para confirmar a conta.",
      })

    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        // Erro de validação Zod
        const zodError = error as any
        const fieldErrors: Partial<RegisterFormData> = {}
        
        zodError.errors.forEach((err: any) => {
          const field = err.path[0] as keyof RegisterFormData
          fieldErrors[field] = err.message
        })
        
        setErrors(fieldErrors)
      } else {
        addNotification({
          type: "error",
          title: "Erro inesperado",
          message: "Ocorreu um erro durante o cadastro. Tente novamente.",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            Verifique seu email
          </h3>
          <p className="text-sm text-muted-foreground">
            Enviamos um link de confirmação para <strong>{formData.email}</strong>
          </p>
          <p className="text-xs text-muted-foreground">
            Clique no link no seu email para ativar sua conta e poder fazer login.
          </p>
        </div>

        <div className="pt-4 space-y-3">
          <Button 
            onClick={() => setEmailSent(false)} 
            variant="outline" 
            className="w-full"
          >
            Tentar novamente
          </Button>
          
          <Link href="/auth/login">
            <Button variant="ghost" className="w-full">
              Ir para o login
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Nome Completo</Label>
        <Input
          id="fullName"
          type="text"
          placeholder="Seu nome completo"
          value={formData.fullName}
          onChange={(e) => handleInputChange("fullName", e.target.value)}
          className={errors.fullName ? "border-red-500 focus:border-red-500" : ""}
        />
        {errors.fullName && (
          <p className="text-sm text-red-500">{errors.fullName}</p>
        )}
      </div>

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
            placeholder="Mínimo 6 caracteres"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            className={errors.password ? "border-red-500 focus:border-red-500 pr-10" : "pr-10"}
          />
          <button
            type="button"
            onClick={() => setViewPassword(!viewPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground"
          >
            {viewPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Deve conter pelo menos uma letra maiúscula, uma minúscula e um número
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar Senha</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={viewConfirmPassword ? "text" : "password" }
            placeholder="Confirme sua senha"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
            className={errors.confirmPassword ? "border-red-500 focus:border-red-500" : ""}
          />

          <button
            type="button"
            onClick={() => setViewConfirmPassword(!viewConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground"
          >
            {viewConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>

          {errors.confirmPassword && (
            <p className="text-sm text-red-500">{errors.confirmPassword}</p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full dark:text-white" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Cadastrar
      </Button>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Já tem uma conta?{" "}
          <Link href="/auth/login" className="text-primary hover:underline">
            Faça login
          </Link>
        </p>
      </div>
    </form>
  )
}
