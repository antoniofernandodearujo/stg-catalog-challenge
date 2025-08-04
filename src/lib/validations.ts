import { z } from "zod"

// Schema para login
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email inválido"),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(6, "Senha deve ter pelo menos 6 caracteres"),
})

export type LoginFormData = z.infer<typeof loginSchema>

// Schema para registro
export const registerSchema = z.object({
  fullName: z
    .string()
    .min(1, "Nome completo é obrigatório")
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email inválido"),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número"),
  confirmPassword: z
    .string()
    .min(1, "Confirmação de senha é obrigatória"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
})

export type RegisterFormData = z.infer<typeof registerSchema>

// Schema para busca
export const searchSchema = z.object({
  search: z
    .string()
    .min(1, "Termo de busca é obrigatório")
    .max(100, "Termo de busca deve ter no máximo 100 caracteres"),
})

export type SearchFormData = z.infer<typeof searchSchema>

// Schema para filtros
export const filterSchema = z.object({
  category: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  sort: z.enum(["date", "name", "price", "rating"]).optional(),
})

export type FilterFormData = z.infer<typeof filterSchema> 