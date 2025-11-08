# Copilot instructions for agrohack-project

Purpose: Help AI coding agents work productively in this Next.js 16 + App Router project using shadcn/ui, Radix UI, Tailwind v4.

## Regras de desenvolvimento
- Todos os componentes devem usar shadcn/ui como base de estilização e Radix UI para garantir acessibilidade.
- Cada página deve deixar explícito se é renderizada via SSR ou CSR, utilizando client components apenas quando realmente necessário.
- Respeite a arquitetura de pastas do App Router do Next.js para qualquer nova rota ou página adicionada.
- Sempre utilize o provider `context7` para buscar dados ou compartilhar estado global.
