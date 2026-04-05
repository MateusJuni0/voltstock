# VoltStock — Loop de Melhoria Continua

> Documento vivo. Actualizar a cada sessao de trabalho.
> Objectivo: tornar VoltStock o #1 e-commerce de hardware em Portugal.

## Concorrencia (PT)

| Loja | Pontos Fortes | Onde VoltStock Ganha |
|------|--------------|---------------------|
| PCDiga | Catalogo enorme, marca conhecida | UX premium, velocidade, dark mode unico |
| GlobalData | Precos competitivos | Estetica, mobile-first, trust signals |
| Chip7 | Rede fisica | Checkout limpo, MBWay nativo, envio 24-48h |
| Worten | Volume, brand awareness | Curadoria, experiencia focada em entusiastas |

## Estado Actual (2026-04-05)

### Completo
- [x] 216 produtos com supplier_url (resale/dropship model)
- [x] 12 categorias completas
- [x] SEO: robots.txt, sitemap.xml, structured data (JSON-LD)
- [x] GEO: geo.region PT, ICBM, hreflang pt-PT
- [x] Trust signals: payment logos, security badges, Livro de Reclamacoes
- [x] Search: autocomplete fuzzy com Ctrl+K
- [x] Stock indicators: Em Stock / So restam X / Esgotado
- [x] Cart sidebar com payment logos e free shipping reminder
- [x] Mobile responsive (testado 375px)
- [x] Dark theme premium (glassmorphism, gradients)
- [x] Loading skeletons para todas as paginas
- [x] Error boundaries (404, global error)
- [x] Breadcrumbs em todas as paginas
- [x] Paginas: Home, Produtos, Produto Detail, Sobre, Contacto, Termos, Privacidade, Envios, Devolucoes
- [x] Dynamic OG images (opengraph-image, twitter-image)
- [x] WhatsApp floating button

### Pendente (por prioridade)

#### P0 — Critico para Lancamento
- [ ] NIF real no footer (substituir "[A PREENCHER]")
- [ ] Google Search Console verification code
- [ ] Stripe integration (checkout funcional)
- [ ] Supabase DB migration (produtos, orders, users)
- [ ] Email transacional (confirmacao de compra)
- [ ] SSL certificado no dominio voltstock.pt
- [ ] Deploy no Vercel com dominio custom

#### P1 — Competitividade
- [ ] Comparacao de produtos (side-by-side)
- [ ] Paginas de marca (/marcas/msi, /marcas/asus, etc.)
- [ ] Filtros avancados no catalogo (preco min/max, marca, rating)
- [ ] Ordenacao por preco, popularidade, novidade
- [ ] Wishlist persistente (localStorage ou Supabase)
- [ ] Historico de precos (grafico sparkline)
- [ ] Reviews/avaliacoes de clientes
- [ ] Sticky add-to-cart CTA no product detail (scroll)
- [ ] Notificacao de stock (email quando voltar a ter)

#### P2 — Conversao
- [ ] Exit-intent popup com desconto
- [ ] Upsell/cross-sell no checkout
- [ ] Bundle deals (compre 3 pague 2)
- [ ] Cupoes de desconto
- [ ] Free shipping progress bar no cart
- [ ] Garantia visual (selos, certificacoes)
- [ ] Live chat / chatbot com IA
- [ ] Programa de fidelidade (pontos por compra)

#### P3 — SEO/GEO Avancado
- [ ] Blog com artigos de hardware (SEO content)
- [ ] Paginas de landing por categoria optimizadas
- [ ] FAQ expandida com schema markup
- [ ] Backlinks strategy (tech blogs PT)
- [ ] Google Merchant Center feed
- [ ] Meta/Instagram Shopping integration
- [ ] Paginas AMP para mobile search
- [ ] Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1

#### P4 — Operacoes
- [ ] Admin dashboard (gestao de stock, pedidos)
- [ ] Integracao com fornecedores (auto-update de precos/stock)
- [ ] Notificacoes Telegram/WhatsApp para novas encomendas
- [ ] Analytics (Plausible ou Umami — privacy-first)
- [ ] A/B testing framework
- [ ] Automated backup de dados

## Metricas de Sucesso

| Metrica | Target | Como Medir |
|---------|--------|-----------|
| Tempo no site | > 3 min | Analytics |
| Bounce rate | < 40% | Analytics |
| Conversao (visit to cart) | > 5% | Analytics |
| Conversao (cart to purchase) | > 30% | Stripe dashboard |
| Mobile score (Lighthouse) | > 90 | Lighthouse CI |
| SEO score | > 95 | Lighthouse CI |
| Produtos com imagem real | 100% | Audit manual |
| Uptime | 99.9% | Vercel / UptimeRobot |

## Processo de Iteracao

1. **Sessao de trabalho** → Escolher 1-3 items da lista P0/P1
2. **Implementar** → TDD, code review, build pass
3. **Auditar visualmente** → Preview tool ou browser real
4. **Medir impacto** → Lighthouse, analytics
5. **Actualizar este documento** → Marcar como [x], adicionar novos items
6. **Repetir**

## Notas

- Modelo de negocio: revenda/dropship. Cada produto TEM que ter `supplier_url`
- Stack: Next.js 16, React 19, Tailwind v4, Framer Motion 12
- Deploy target: Vercel (web) + Supabase VPS (DB/auth)
- Prioridade do Mateus: "entrar com tudo no mercado" — agressividade comercial
