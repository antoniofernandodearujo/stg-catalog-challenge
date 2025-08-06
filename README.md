# STG Catalog – E-commerce com Checkout via WhatsApp

## 📝 Sobre o Projeto
O **STG Catalog** é um sistema de e-commerce completo, desenvolvido em **Next.js 15** com foco em performance, acessibilidade e escalabilidade.  
Ele permite:
1. Navegar por um catálogo de produtos com foto, preço e descrição detalhada.
2. Autenticar-se com e-mail/senha (Supabase Auth).  
3. Adicionar itens ao carrinho com persistência por usuário.  
4. Finalizar o pedido gerando uma mensagem automática e pré-formatada no **WhatsApp**.

Acesse aqui: https://stg-catalog.netlify.app

---

## 🔧 Tecnologias Utilizadas
| Tecnologia | Versão | Por quê? |
|------------|--------|----------|
| **Next.js 15** (App Router) | `15.2.x` | Renderização híbrida (SSR/SSG), roteamento de arquivos e ótima DX. |
| **TypeScript** | `5.x` | Tipagem estática ⇒ menos bugs em produção. |
| **Tailwind CSS** | `4.x` | Utilitários de estilo rápidos + pré-configurado para dark mode. |
| **Headless UI** + **Radix UI** | `@headlessui/*`, `@radix-ui/*` | Componentes acessíveis; layout 100 % personalizável com Tailwind. |
| **Supabase** (`@supabase/supabase-js`) | `2.x` | Auth + Banco de dados relacional (PostgreSQL) em tempo real. |
| **Zod** | `3.x` | Validação e inferência de tipos. |
| **Lucide-react** | `0.x` | Ícones leves de código aberto. |
| **Netlify** | — | CI/CD e hospedagem serverless com previews por pull request. |

## 🤖 IA Utilizada
| Ferramenta de IA | Como ajudou? | Conteúdo gerado vs. manual |
|------------------|-------------|----------------------------|
| **Gemini Falsh 2.5** | Brainstorm de arquitetura, geração de trechos de código e refatoração. | ~40 % gerado, revisado manualmente. |
| **Claude 3.5 Sonnet** | Criação de documentação e testes unitários. | ~15 % gerado. |
| **Cursor** | Autocomplete em IDE, jump-to-definition, explicação de código. | Suporte contínuo. |
| **v0.dev (Vercel)** | Protótipos rápidos de layout e componentes UI. | Protótipos descartados e todos adaptados. |

Todas as saídas de IA passaram por revisão para garantir legibilidade, padrões de código e segurança.

---

## ▶️ Como Rodar o Projeto
1. **Clone o repositório**
   ```bash
   git clone [https://github.com/antoniofernandodearujo/stg-catalog-challenge.git](https://github.com/antoniofernandodearujo/stg-catalog-challenge.git)
   cd stg-catalog-challenge

Instale as dependências (Node 18 +)

```Bash
yarn install # ou npm install
```

### Configure as variáveis de ambiente

Crie .env na raiz:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<ID>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<SUA_CHAVE_ANON>
```

### Prepare o banco Supabase

Importe **scripts/create-tables.sql** e **scripts/seed-products.sql** no SQL Editor do projeto.

Execute em modo dev

``` Bash
yarn dev
# Acesse http://localhost:3000
```

## 🧪 Testes Técnicos

Este projeto utiliza Jest para testes unitários, garantindo a robustez de hooks e lógicas de negócio.

### Como Rodar os Testes

- Para executar todos os testes, use o comando:

```Bash
yarn test
```

### Comandos Adicionais:

- Modo de Observação (watch):

```Bash
yarn test --watch
```

- Relatório de Cobertura de Código:
O Jest gera um relatório detalhado na pasta coverage/.

```Bash
yarn test --coverage
```

-> Abra o arquivo **coverage/lcov-report/index.html** em seu navegador para uma visualização completa.

## 🌐 Links
- Deploy (Netlify): https://stg-catalog.netlify.app

Se clonar este repositório, substitua pelos seus próprios links de produção.

### 🎯 Funcionalidades Principais
### ✅ Obrigatórias
1. Login/Registro
- [x] 🔐 Formulário de login (email + senha)

- [x] ➡️ Link para registro

- [x] ✍️ Formulário de registro (nome completo, email, senha, confirmar senha)

- [x] 🔍 Validações básicas de formulário

- [x] 💬 Feedback de erro/sucesso

- [x] 🔄 Redirecionamento automático após login

2. Catálogo Principal
- [x] 🖼️ Grid de produtos responsivo (mínimo 12 produtos)

- [x] 💳 Cada produto deve mostrar: imagem, nome, preço

- [x] 🛒 Botão "Adicionar ao Carrinho" em cada produto

- [x] 🧭 Navegação para carrinho

3. Detalhes do Produto
- [x] 📄 Modal ou página com informações completas

- [x] 📸 Imagem maior, nome, descrição completa, preço

- [x] ➕ Botão "Adicionar ao Carrinho"

- [x] ⬅️ Botão para voltar ao catálogo

4. Carrinho de Compras
- [x] 📋 Lista dos produtos adicionados

- [x] 🔢 Quantidade editável para cada item

- [x] 🗑️ Botão "Remover" para cada item

- [x] 💬 Botão "Finalizar Pedido via WhatsApp"

- [x] 🛍️ Botão "Continuar Comprando"

5. Confirmação
- [x] 📝 Resumo do pedido antes do envio

- [x] 👤 Dados do cliente

- [x] 📦 Lista final dos produtos

- [x] 💲 Valor total

- [x] ✅ Botão confirmar que redireciona para WhatsApp

### ⭐ Diferenciais
### Funcionalidades Bônus

- [x] 📜 Histórico de pedidos do usuário

- [x] 🔎 Filtros avançados (categoria, faixa de preço)

- [x] 🌙 Dark mode toggle

Técnico
- [x] ⚛️ Context API para gerenciamento de estado global

- [x] 🎣 Custom hooks bem estruturados

- [x] 🧪 Testes unitários (Jest/Testing Library)

- [x] 🐞 Error boundary para tratamento de erros

- [x] 📈 SEO otimizado (se Next.js)

- [x] ⚡ Performance otimizada (lazy loading, memoization)

### UX/UI
- [x] ✨ Animações suaves (Framer Motion)

- [x] ⏳ Skeleton loading durante carregamentos

- [x] 🔔 Toast notifications para feedback

- [x] 🗺️ Breadcrumbs para navegação

- [x] ➡️ Paginação

- [x] 💡 Busca com sugestões/autocomplete

### 📄 Licença
Distribuído sob licença MIT. Veja LICENSE para mais detalhes.
