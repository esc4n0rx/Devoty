# Devoty - Seu Devocional Diário

<div align="center">
  <img src="./public/images/logo.png" alt="Devoty Logo" width="150">
</div>

<p align="center">
  <strong>Fortaleça sua caminhada espiritual com devocionais diários, reflexões bíblicas e um espaço para registrar sua jornada.</strong>
</p>

---

## ✨ Visão Geral

O **Devoty** é um aplicativo web moderno e interativo, projetado para ser o companheiro diário na jornada espiritual de seus usuários. Ele oferece devocionais gerados por IA, acesso completo à Bíblia, um diário pessoal para anotações e um sistema de gamificação para incentivar a consistência.

Construído como um Progressive Web App (PWA), o Devoty oferece uma experiência de usuário fluida e pode ser "instalado" na tela inicial de qualquer dispositivo, funcionando de forma semelhante a um aplicativo nativo.

## 🚀 Funcionalidades Principais

- **Devocionais Diários:** Receba uma nova devocional todos os dias, com título, versículo base, reflexão e oração.
- **Geração por IA:** Gere devocionais personalizadas sob demanda utilizando a API da Groq.
- **Leitura da Bíblia:** Um leitor de Bíblia completo com as versões NVI e ACF, navegação por livro e capítulo, e cache para acesso offline.
- **Diário Pessoal:** Um espaço privado para registrar pensamentos, orações e reflexões, com suporte a Markdown.
- **Gamificação (Chama):** Mantenha uma "chama" de dias consecutivos de leitura para se manter motivado.
- **Audição de Devocionais:** Ouça as devocionais com controles de reprodução e configurações de voz (velocidade, tom e tipo de voz).
- **Progressive Web App (PWA):** Instale o Devoty em seu celular ou desktop para uma experiência de aplicativo nativo.
- **Autenticação Segura:** Sistema completo de login, registro e recuperação de senha utilizando Supabase.

## 🛠️ Tecnologias Utilizadas

O projeto foi construído com um conjunto de tecnologias modernas para garantir performance, escalabilidade e uma ótima experiência de desenvolvimento.

- **Framework Principal:** [Next.js](https://nextjs.org/) (v14 com App Router)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/) com [Shadcn/UI](https://ui.shadcn.com/) para componentes pré-construídos e acessíveis.
- **Animações:** [Framer Motion](https://www.framer.com/motion/) e [Lottie](https://lottiefiles.com/) para animações fluidas e interativas.
- **Backend & Autenticação:** [Supabase](https://supabase.io/) para banco de dados, autenticação e APIs.
- **Geração de Conteúdo (IA):** [Groq SDK](https://wow.groq.com/) para geração de texto rápida.
- **Gerenciamento de Estado:** React Context API e hooks customizados.
- **Validação de Formulários:** [React Hook Form](https://react-hook-form.com/) com [Zod](https://zod.dev/) para validação de schemas.
- **Deployment:** [Vercel](https://vercel.com/) / [Netlify](https://www.netlify.com/) (configurado para ambos).

## 📂 Estrutura do Projeto

A estrutura de pastas foi organizada para manter o código modular, escalável e fácil de navegar.

```
/Devoty
├── app/                # Rotas do Next.js 14 (App Router)
│   ├── api/            # Endpoints de API (server-side)
│   ├── (telas)/        # Grupos de rotas para as telas principais
│   └── layout.tsx      # Layout principal da aplicação
│   └── page.tsx        # Página de entrada da aplicação
├── components/         # Componentes React reutilizáveis
│   ├── screens/        # Componentes que representam telas inteiras
│   ├── settings/       # Componentes específicos da tela de ajustes
│   └── ui/             # Componentes de UI (gerados pelo Shadcn)
├── contexts/           # Provedores de contexto React (AuthProvider, AudioProvider)
├── hooks/              # Hooks customizados (useAuth, useAudio, etc.)
├── lib/                # Funções utilitárias, clientes de API, etc.
│   ├── supabase/       # Configuração do cliente Supabase (client/server)
│   └── utils.ts        # Funções utilitárias gerais
├── public/             # Arquivos estáticos (imagens, fontes, manifest.json)
├── styles/             # Estilos globais
└── types/              # Definições de tipos e interfaces TypeScript
```

## 🏁 Começando

Siga os passos abaixo para configurar e rodar o projeto em seu ambiente local.

### Pré-requisitos

- [Node.js](https://nodejs.org/en/) (v18 ou superior)
- [pnpm](https://pnpm.io/installation) (recomendado, mas `npm` ou `yarn` também funcionam)

### 1. Clonar o Repositório

```bash
git clone https://github.com/esc4n0rx/devoty.git
cd devoty
```

### 2. Instalar as Dependências

```bash
pnpm install
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo chamado `.env.local` na raiz do projeto e adicione as chaves de API do Supabase e Groq. Você pode usar o arquivo `.env.example` como modelo.

```env
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=SUA_URL_DO_PROJETO_SUPABASE
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_SUPABASE

# Groq AI
GROQ_API_KEY=SUA_CHAVE_DE_API_DO_GROQ
```

### 4. Rodar o Servidor de Desenvolvimento

```bash
pnpm run dev
```

Abra [http://localhost:3000](http://localhost:3000) em seu navegador para ver a aplicação em funcionamento.

## 📜 Scripts Disponíveis

- `pnpm run dev`: Inicia o servidor de desenvolvimento.
- `pnpm run build`: Compila a aplicação para produção.
- `pnpm run start`: Inicia um servidor de produção.
- `pnpm run lint`: Executa o linter (ESLint) para verificar a qualidade do código.

---

*Este projeto foi desenvolvido como um exemplo de aplicação web moderna e completa.*
