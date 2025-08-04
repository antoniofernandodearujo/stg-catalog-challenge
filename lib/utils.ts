import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price)
}

export function generateWhatsAppMessage(user: any, cartItems: any[], total: number): string {
  const userName = user.user_metadata?.full_name || user.email
  const userEmail = user.email

  let message = `🛍️ *NOVO PEDIDO - STG CATALOG*\n\n`
  message += `👤 *Cliente:* ${userName}\n`
  message += `📧 *Email:* ${userEmail}\n\n`
  message += `📦 *PRODUTOS:*\n`

  cartItems.forEach((item) => {
    message += `- ${item.product.name} - Qtd: ${item.quantity} - ${formatPrice(item.product.price * item.quantity)}\n`
  })

  message += `\n💰 *TOTAL: ${formatPrice(total)}*\n\n`
  message += `---\nPedido realizado via STG Catalog`

  return encodeURIComponent(message)
}
