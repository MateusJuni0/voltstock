# SPEC.md - cm-ecommerce-tech (V2.0 - SAGA Elite)

**Status:** Em Construção (Fase 1 - Frontend Core)
**Arquiteto:** Dante
**Data:** 30/03/2026

## 1. Visão Geral do Projeto
Plataforma E-commerce Premium de Eletrónica. Idioma nativo: **Português de Portugal**.
Foco absoluto em performance, animações fluidas (Framer Motion) e vivacidade visual com fundos imersivos.

## 2. Identidade Visual (Design System)
- **Estética:** Premium, Linear Dark Mode adaptado (Fundos fotográficos/vídeo dinâmicos com *glassmorphism*).
- **Animações:** Framer Motion (Page transitions, scroll effects, parallax no hero).
- **Tipografia e Cores:** Paleta high-end (Preto profundo, acentos néon suaves para tech, tipografia sans-serif geométrica).
- **Idioma:** pt-PT obrigatório em toda a interface e copies.

## 3. Stack Tecnológica
- **Frontend:** Next.js 14+ (App Router), React 18, TypeScript, Tailwind CSS, Framer Motion, Radix UI.
- **Backend/DB:** Supabase (Auth, Postgres, Storage de imagens do catálogo). Aproveitar schema existente.
- **Gateway de Pagamento:** Stripe (Cartões de Crédito + **MBWay** nativo para Portugal).
- **E-mails Transacionais:** Resend (Faturas, Recibos, Confirmações de Encomenda).
- **Deploy:** Localhost (porta 3000) sem túneis, posterior Vercel.

## 4. Estrutura de Pastas (Padrão SAGA V14)
```
/workspace/projects/cm-ecommerce-tech/
├── /web/                 # Aplicação Next.js (Domínio NEXUS)
│   ├── /src/
│   │   ├── /app/
│   │   ├── /components/
│   │   │   ├── /ui/
│   │   │   ├── /hero/
│   │   │   └── /bento-grid/
│   │   └── /lib/
├── /supabase/            # Domínio VALKYRIE
└── vercel.json           # Domínio VULKAN
```

## 5. Rotas (Frontend)
- `/`: Homepage (Hero immersivo, Produtos em destaque, Categorias, Bento Grid).
- `/produtos`: Catálogo completo com filtros (Preço, Categoria, Marca).
- `/produto/[slug]`: Página de detalhe (Galeria 3D/Motion, Especificações, Add to Cart).
- `/carrinho`: Modal ou página de resumo.
- `/checkout`: Checkout Stripe integrado com MBWay.

## 6. Fases de Execução (SAGA)
1. **[IN_PROGRESS] Fase 1 (NEXUS):** Scaffold do Next.js 14, UI/UX Core, Layout, Hero imersivo com Framer Motion, e design base do catálogo de produtos.
2. **[PENDING] Fase 2 (VALKYRIE):** Reconectar infraestrutura Supabase, expor rotas API e regenerar tipos TypeScript.
3. **[PENDING] Fase 3 (NEXUS + VALKYRIE):** Integração do Carrinho e do gateway Stripe (MBWay).
4. **[PENDING] Fase 4 (LÚCIO):** Auditoria QA (Score >= 9.0) e preparação final.

---
*Assinado: Dante (Arquiteto Soberano)*
