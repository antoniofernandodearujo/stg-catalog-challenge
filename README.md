# STG Catalog – E-commerce com Checkout via WhatsApp

## 📝 Sobre o Projeto
O **STG Catalog** é um sistema de e-commerce completo, desenvolvido em **Next.js 15** com foco em performance, acessibilidade e escalabilidade.  
Ele permite:
1. Navegar por um catálogo de produtos com fotos, preços e descrições detalhadas.  
2. Autenticar-se com e-mail/senha (Supabase Auth).  
3. Adicionar itens ao carrinho com persistência por usuário.  
4. Finalizar o pedido gerando uma mensagem automática e pré-formatada no **WhatsApp**, onde a conversa de pagamento e entrega acontece.

O objetivo é demonstrar um fluxo de compra enxuto – do browse ao checkout – sem depender de gateways de pagamento reais, reduzindo custos e complexidade para MVPs ou pequenos negócios.

---

## 🔧 Tecnologias Utilizadas
| Tecnologia | Versão | Por quê? |
|------------|--------|----------|
| **Next.js 15** (App Router) | `15.2.x` | Renderização híbrida (SSR/SSG), roteamento de arquivos e ótima DX. |
| **TypeScript** | `5.x` | Tipagem estática ⇒ menos bugs em produção. |
| **Tailwind CSS** | `4.x` | Utilitários de estilo rápidos + pré-configurado para dark mode. |
| **Headless UI** + **Radix UI** | `@headlessui/*`, `@radix-ui/*` | Componentes acessíveis; layout 100 % personalizável com Tailwind. |
| **Supabase** (`@supabase/supabase-js`) | `2.x` | Auth + Banco de dados relacional (PostgreSQL) em tempo real. |
| **@tanstack/react-query** | `5.x` | Cache, sincronização e mutações de dados declarativas. |
| **Zod** | `3.x` | Validação e inferência de tipos. |
| **Lucide-react** | `0.x` | Ícones leves de código aberto. |
| **Netlify** | — | CI/CD e hospedagem serverless com previews por pull request. |

> Sinta-se livre para incluir outras bibliotecas, mas **prefira Headless UI + Tailwind** quando possível.

---

## 🤖 IA Utilizada
| Ferramenta de IA | Como ajudou? | Conteúdo gerado vs. manual |
|------------------|-------------|----------------------------|
| **ChatGPT 4o** | Brainstorm de arquitetura, geração de trechos de código e refatoração. | ~40 % gerado, revisado manualmente. |
| **Claude 3 Sonnet** | Criação de documentação e testes unitários. | ~15 % gerado. |
| **Cursor** | Autocomplete em IDE, jump-to-definition, explicação de código legado. | Suporte contínuo. |
| **v0.dev (Vercel)** | Protótipos rápidos de layout e componentes UI. | Protótipos descartados ou adaptados. |

Todas as saídas de IA passaram por revisão humana para garantir legibilidade, padrões de código e segurança.

---

## ▶️ Como Rodar o Projeto
1. **Clone o repositório**
   ```bash
   git clone https://github.com/antoniofernandodearuji/stg-catalog.git
   cd stg-catalog
   ```
2. **Instale as dependências** (Node 18 +)
   ```bash
   pnpm install # ou npm/yarn
   ```
3. **Configure as variáveis de ambiente**
   Crie `.env.local` na raiz:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://<ID>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<SUA_CHAVE_ANON>
   ```
4. **Prepare o banco Supabase**
   - Importe `scripts/create-tables.sql` e `scripts/seed-products.sql` no **SQL Editor** do projeto.
5. **Execute em modo dev**
   ```bash
   pnpm dev
   # Acesse http://localhost:3000
   ```

---

## 🌐 Links
- **Deploy (Netlify)**: https://stg-catalog.netlify.app  
- **Projeto Supabase (público)**: https://app.supabase.com/project/<ID>

> Se clonar este repositório, substitua pelos seus próprios links de produção.

---

## ✅ Funcionalidades
### Obrigatórias
- [x] Autenticação de usuários (e-mail/senha)
- [x] Listagem de produtos paginada e responsiva
- [x] Detalhe do produto com galeria de imagens
- [x] Carrinho de compras com update de quantidades
- [x] Persistência do carrinho por usuário (Supabase)
- [x] Checkout via geração de mensagem no WhatsApp

### Opcionais / Diferenciais
- [x] Busca e filtro por nome/categoria
- [x] Dark mode automático (sistema / toggle)
- [x] Testes unitários básicos com Vitest
- [x] Deploy contínuo (CI) na Netlify
---

## 📄 Licença
Distribuído sob licença MIT. Veja `LICENSE` para mais detalhes.
