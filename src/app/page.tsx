import { redirect } from "next/navigation"

export default async function Home() {
  // Redirecionar diretamente para o catálogo
  // Os usuários podem ver os produtos sem estar logados
  // O login será solicitado apenas quando tentarem adicionar ao carrinho
  redirect("/catalog")
}
