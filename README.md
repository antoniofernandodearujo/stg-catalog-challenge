# STG Catalog Challenge

## Descrição do Projeto

Este projeto é um catálogo de produtos com funcionalidades de e-commerce, como busca com autocompletar, filtros dinâmicos, integração com Supabase para gerenciamento de carrinho e autenticação, e uma interface otimizada para dispositivos móveis. Ele foi desenvolvido como parte de um desafio técnico.

## 🚀 Funcionalidades

Nosso catálogo oferece as seguintes funcionalidades:

### 🎯 Funcionalidades Principais

-   [x]  **Visualização de Produtos:** Listagem paginada de produtos com detalhes relevantes.
-   [x]  **Filtros Dinâmicos:** Filtros por categoria e preço.
-   [x]  **Busca com Autocomplete:** Sistema de busca rápida com sugestões e histórico.
-   [x]  **Autenticação de Usuário:** Login e cadastro de usuários via Supabase.
-   [x]  **Integração com Carrinho de Compras:** Adicionar, remover e gerenciar itens no carrinho.
-   [x]  **Interface Responsiva:** Design otimizado para uma experiência fluida em desktops, tablets e celulares.
-   [x]  **Modo Escuro (Dark Mode):** Alternância de tema para melhor experiência visual.
-   [x]  **Notificações (Toasts):** Feedback visual para ações do usuário.

### ⚙️ Funcionalidades Técnicas

-   [x]  **Next.js 15 (App Router):** Utilização do framework mais recente para SSR e SSG.
-   [x]  **Supabase:** Backend-as-a-Service para banco de dados, autenticação e gerenciamento do carrinho.
-   [x]  **Tailwind CSS:** Framework utilitário para estilização rápida e eficiente.
-   [x]  **React Query:** Gerenciamento de estado do servidor e caching de dados.
-   [x]  **Framer Motion:** Animações fluidas e elegantes na interface.
-   [x]  **Zustand:** Gerenciamento de estado global otimizado.
-   [x]  **Shadcn/ui:** Componentes de interface de usuário reutilizáveis.
-   [x]  **Vitest:** Ambiente de testes unitários e de integração.

---

## 🛠️ Testes Técnicos

O projeto utiliza **Vitest** para garantir a qualidade do código e a correta execução das funcionalidades. Os testes foram implementados para cobrir aspectos críticos da aplicação, como a lógica de gerenciamento de estado e as interações com a API do Supabase.

### Como Rodar os Testes

Para executar os testes e verificar a cobertura do código, siga os passos abaixo:

1.  **Instale as dependências do projeto:**
    ```bash
    yarn install
    # ou
    npm install
    ```

2.  **Execute os testes:**
    Use um dos seguintes comandos para rodar os testes unitários e de integração:

    -   **Rodar todos os testes uma única vez:**
        ```bash
        yarn test
        # ou
        npm test
        ```
    -   **Rodar os testes em modo `watch` (observa alterações nos arquivos):**
        ```bash
        yarn test:watch
        # ou
        npm run test:watch
        ```

3.  **Gerar o Relatório de Cobertura de Código:**
    Este comando executa os testes e gera um relatório detalhado na pasta `coverage/`. Você pode abri-lo no navegador para ver quais linhas de código foram testadas.

    ```bash
    yarn test:coverage
    # ou
    npm run test:coverage
    ```

    O relatório HTML estará disponível em `coverage/index.html`.

---

## ⚙️ Instalação e Execução

### Pré-requisitos

-   Node.js (versão 18 ou superior)
-   Yarn ou npm

### Configuração

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/stg-catalog-challenge.git](https://github.com/seu-usuario/stg-catalog-challenge.git)
    cd stg-catalog-challenge
    ```

2.  **Instale as dependências:**
    ```bash
    yarn install
    # ou
    npm install
    ```

3.  **Configure o Supabase:**
    Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis, obtidas no seu painel do Supabase:

    ```bash
    NEXT_PUBLIC_SUPABASE_URL="[SUA_URL_DO_PROJETO]"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="[SUA_CHAVE_ANONIMA]"
    ```

4.  **Execute o projeto em modo de desenvolvimento:**
    ```bash
    yarn dev
    # ou
    npm run dev
    ```

O aplicativo estará disponível em `http://localhost:3000`.

---