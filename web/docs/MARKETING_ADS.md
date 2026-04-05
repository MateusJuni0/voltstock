# VoltStock - Estrategia de Publicidade Paga

**Dominio:** voltstock.pt
**Mercado:** Portugal
**Orcamento inicial recomendado:** 500-1.000 EUR/mes
**Ultima actualizacao:** Abril 2026

---

## 1. Google Ads - Keywords e Lances Sugeridos

### 1.1 Keywords de Marca (Proteccao)

| Keyword | Tipo | Lance Sugerido | Prioridade |
|---------|------|---------------|-----------|
| voltstock | Exacta | 0.20 EUR | Alta |
| voltstock.pt | Exacta | 0.20 EUR | Alta |
| voltstock portugal | Exacta | 0.25 EUR | Alta |
| loja voltstock | Exacta | 0.20 EUR | Alta |
| volt stock | Exacta | 0.20 EUR | Alta |

### 1.2 Keywords de Categoria (Alta Intencao)

| Keyword | Tipo | Lance Sugerido | CPC Estimado | Prioridade |
|---------|------|---------------|-------------|-----------|
| comprar placa grafica portugal | Exacta | 0.80 EUR | 0.60-1.00 | Alta |
| comprar gpu online | Ampla Mod. | 0.75 EUR | 0.50-0.90 | Alta |
| loja hardware portugal | Exacta | 0.70 EUR | 0.50-0.85 | Alta |
| comprar componentes pc online | Ampla Mod. | 0.65 EUR | 0.45-0.80 | Alta |
| loja electronica online portugal | Exacta | 0.70 EUR | 0.50-0.85 | Alta |
| comprar perifericos gaming | Ampla Mod. | 0.60 EUR | 0.40-0.75 | Alta |
| comprar monitor gaming portugal | Exacta | 0.75 EUR | 0.55-0.90 | Alta |
| loja informatica online portugal | Exacta | 0.65 EUR | 0.45-0.80 | Media |
| comprar teclado mecanico portugal | Exacta | 0.55 EUR | 0.35-0.65 | Media |
| comprar rato gaming portugal | Exacta | 0.55 EUR | 0.35-0.65 | Media |
| comprar headset gaming | Ampla Mod. | 0.50 EUR | 0.30-0.60 | Media |
| comprar ssd nvme portugal | Exacta | 0.50 EUR | 0.30-0.60 | Media |
| loja tech portugal | Ampla Mod. | 0.60 EUR | 0.40-0.75 | Media |
| comprar memoria ram portugal | Exacta | 0.45 EUR | 0.25-0.55 | Media |
| comprar fonte alimentacao pc | Exacta | 0.40 EUR | 0.25-0.50 | Baixa |

### 1.3 Keywords de Produto (Especificas)

| Keyword | Tipo | Lance Sugerido | CPC Estimado | Prioridade |
|---------|------|---------------|-------------|-----------|
| rtx 4070 preco portugal | Exacta | 1.00 EUR | 0.70-1.20 | Alta |
| rtx 4060 comprar | Exacta | 0.90 EUR | 0.60-1.10 | Alta |
| rtx 4080 portugal | Exacta | 1.10 EUR | 0.80-1.30 | Alta |
| rx 7800 xt preco | Exacta | 0.85 EUR | 0.60-1.00 | Alta |
| ryzen 7 7800x3d preco | Exacta | 0.90 EUR | 0.65-1.10 | Alta |
| logitech g pro x superlight | Exacta | 0.70 EUR | 0.45-0.85 | Media |
| corsair k70 preco | Exacta | 0.60 EUR | 0.35-0.70 | Media |
| samsung 990 pro 2tb | Exacta | 0.65 EUR | 0.40-0.75 | Media |
| razer deathadder v3 | Exacta | 0.55 EUR | 0.35-0.65 | Media |
| hyperx cloud iii preco | Exacta | 0.50 EUR | 0.30-0.60 | Media |

### 1.4 Keywords de Comparacao (Alto CTR)

| Keyword | Tipo | Lance Sugerido | CPC Estimado |
|---------|------|---------------|-------------|
| rtx 4070 vs rtx 4060 ti | Ampla Mod. | 0.55 EUR | 0.35-0.65 |
| nvidia vs amd 2026 | Ampla Mod. | 0.50 EUR | 0.30-0.60 |
| melhor placa grafica custo beneficio | Ampla Mod. | 0.65 EUR | 0.40-0.80 |
| melhor monitor gaming 2026 | Ampla Mod. | 0.60 EUR | 0.35-0.70 |
| melhor teclado mecanico 2026 | Ampla Mod. | 0.50 EUR | 0.30-0.60 |

### 1.5 Keywords de Intencao Local

| Keyword | Tipo | Lance Sugerido | CPC Estimado |
|---------|------|---------------|-------------|
| loja informatica lisboa | Exacta | 0.70 EUR | 0.50-0.85 |
| loja informatica porto | Exacta | 0.70 EUR | 0.50-0.85 |
| hardware portugal entrega rapida | Ampla Mod. | 0.60 EUR | 0.40-0.75 |
| comprar pc gaming portugal | Exacta | 0.80 EUR | 0.55-0.95 |
| electronica online portugal envio gratis | Ampla Mod. | 0.55 EUR | 0.35-0.65 |

### 1.6 Keywords Negativas (OBRIGATORIO)

Adicionar estas keywords negativas para evitar desperdicio:

```
gratis
free
download
driver
software
emprego
trabalho
estagio
reparacao
reparar
arranjar
segunda mao
usado
usados
recondicionado
aliexpress
amazon
pcdiga
globaldata
review
analise
benchmark
especificacoes
specs
manual
como funciona
```

---

## 2. Google Shopping - Guia de Configuracao

### 2.1 Pre-Requisitos

1. **Google Merchant Center** — Criar conta em merchant.google.com
2. **Feed de produtos** — Gerar via sitemap ou plugin (recomendado: feed XML automatico)
3. **Verificacao de dominio** — voltstock.pt verificado no Merchant Center
4. **Politicas publicadas** — Devolucoes, envio, privacidade visiveis no site
5. **Precos correctos** — Feed e site devem ter precos identicos

### 2.2 Atributos Obrigatorios do Feed

| Atributo | Descricao | Exemplo |
|----------|-----------|---------|
| id | SKU unico | VS-GPU-RTX4070-001 |
| title | Nome completo do produto | NVIDIA GeForce RTX 4070 Super 12GB GDDR6X |
| description | Descricao detalhada (min 150 chars) | Placa grafica NVIDIA RTX 4070 Super com 12GB... |
| link | URL da pagina de produto | https://voltstock.pt/placas-graficas/rtx-4070-super |
| image_link | URL da imagem principal | https://voltstock.pt/images/rtx-4070-super.webp |
| price | Preco com moeda | 549.99 EUR |
| availability | Disponibilidade | in_stock / out_of_stock / preorder |
| brand | Marca | NVIDIA |
| gtin | Codigo EAN/UPC | 1234567890123 |
| condition | Estado | new |
| shipping | Info de envio | PT:::4.99 EUR |
| google_product_category | Categoria Google | Electronics > Computer Components > Graphics Cards |

### 2.3 Optimizacao do Feed

1. **Titulos optimizados**: [Marca] + [Produto] + [Specs chave] + [Tamanho/Cor se aplicavel]
   - Bom: "NVIDIA GeForce RTX 4070 Super 12GB GDDR6X"
   - Mau: "Placa grafica top"

2. **Imagens de alta qualidade**: Fundo branco, sem texto, sem marcas de agua, 800x800px minimo

3. **Precos competitivos**: Google Shopping mostra precos lado a lado — verificar concorrencia

4. **Reviews**: Integrar Google Product Reviews para aparecer estrelas nos Shopping ads

### 2.4 Estrutura de Campanhas Shopping

| Campanha | Produtos | Lance | Orcamento Diario |
|----------|----------|-------|-----------------|
| Shopping - Priority High | Best sellers (top 20% por receita) | 0.80 EUR | 10 EUR |
| Shopping - Priority Medium | Catalogo geral | 0.50 EUR | 8 EUR |
| Shopping - Priority Low | Acessorios e produtos de baixo valor | 0.30 EUR | 5 EUR |
| Performance Max | Todo o catalogo (automatizado) | Auto | 10 EUR |

---

## 3. Meta Ads - Estrutura de Campanhas

### 3.1 Configuracao Inicial

1. **Business Manager** configurado em business.facebook.com
2. **Pixel do Facebook** instalado no site (via GTM ou script directo)
3. **Conversions API** configurada (server-side tracking)
4. **Catalogo de produtos** sincronizado com o site
5. **Eventos standard** configurados: ViewContent, AddToCart, InitiateCheckout, Purchase

### 3.2 Audiencias

#### Audiencias Custom (Retargeting)

| Nome | Criterio | Janela | Uso |
|------|---------|--------|-----|
| Visitantes do site | Todos os visitantes | 30 dias | Retargeting geral |
| Visitantes de produto | Visitaram pagina de produto | 14 dias | Retargeting de produto |
| Adicionaram ao carrinho | AddToCart sem Purchase | 7 dias | Recuperacao de carrinho |
| Compradores | Purchase | 180 dias | Exclusao + Lookalike |
| Instagram engagers | Interagiram com perfil IG | 90 dias | Retargeting social |
| Video viewers 75%+ | Viram 75%+ de um video | 30 dias | Retargeting quente |

#### Audiencias Lookalike

| Fonte | Tamanho | Uso |
|-------|---------|-----|
| Compradores | 1% (Portugal) | Prospeccao — maior qualidade |
| Compradores | 2-3% (Portugal) | Prospeccao — maior alcance |
| AddToCart | 1% (Portugal) | Prospeccao — intencao alta |
| Top spenders | 1% (Portugal) | Prospeccao — alto valor |

#### Audiencias de Interesse

| Interesse | Publico Estimado (PT) |
|-----------|----------------------|
| PC Gaming | 200-400K |
| Hardware de computador | 150-300K |
| Jogos de computador | 300-500K |
| Tecnologia da informacao | 250-400K |
| Perifericos de computador | 100-200K |
| NVIDIA / AMD / Intel | 100-300K |
| Setup de escritorio | 50-100K |
| Esports | 100-200K |

### 3.3 Estrutura de Campanhas

#### Campanha 1: Awareness (Topo do Funil)

**Objectivo:** Reconhecimento de marca
**Orcamento:** 20% do total Meta (45 EUR/mes em orcamento de 225 EUR)
**Audiencia:** Interesses tech + Lookalike compradores 2-3%
**Formato:** Video 15-30s (apresentacao marca) + Carrossel categorias

**Ad Set A - Video awareness:**
- Formato: Video 15s
- Copy: "A VoltStock chegou a Portugal. Hardware premium, precos justos, envio rapido. Descobre."
- CTA: "Saber Mais"

**Ad Set B - Carrossel categorias:**
- Formato: Carrossel 5 cards (GPU, Monitor, Teclado, Rato, SSD)
- Copy: "Tudo para o teu setup. De placas graficas a perifericos — encontra na VoltStock."
- CTA: "Comprar Agora"

#### Campanha 2: Consideracao (Meio do Funil)

**Objectivo:** Trafego para site
**Orcamento:** 35% do total Meta (79 EUR/mes)
**Audiencia:** Interesses tech refinados + Lookalike 1%
**Formato:** Carrossel de produtos + Imagem unica com oferta

**Ad Set A - Best sellers:**
- Formato: Carrossel Dynamic Product Ads
- Copy: "Os mais vendidos da semana na VoltStock. Envio gratis acima de 50 EUR."
- CTA: "Comprar Agora"

**Ad Set B - Oferta especifica:**
- Formato: Imagem unica com preco
- Copy: "[Produto] por apenas [Preco] EUR. Stock limitado. Envia para todo Portugal."
- CTA: "Comprar Agora"

#### Campanha 3: Conversao (Fundo do Funil)

**Objectivo:** Vendas (Purchase)
**Orcamento:** 30% do total Meta (67 EUR/mes)
**Audiencia:** Retargeting (visitantes 14 dias + AddToCart 7 dias)
**Formato:** Dynamic Product Ads + Carrossel personalizado

**Ad Set A - Retargeting visitantes:**
- Formato: DPA (mostra produtos que viram)
- Copy: "Ainda a pensar nisto? Os teus produtos estao a espera na VoltStock."
- CTA: "Comprar Agora"

**Ad Set B - Carrinho abandonado:**
- Formato: DPA com desconto
- Copy: "Esqueceste-te de algo? Usa o codigo VOLTA5 para 5% extra. Valido por 48h."
- CTA: "Finalizar Compra"

#### Campanha 4: Retencao

**Objectivo:** Repeat purchase
**Orcamento:** 15% do total Meta (34 EUR/mes)
**Audiencia:** Compradores 30-180 dias (excluindo compradores 7 dias)
**Formato:** Novos produtos + Ofertas exclusivas

**Ad Set A - Novidades:**
- Formato: Carrossel novos produtos
- Copy: "Novidades na VoltStock esta semana. Como nosso cliente, es o primeiro a saber."
- CTA: "Ver Novidades"

### 3.4 Criativos - Boas Praticas

**Imagens:**
- Resolucao: 1080x1080 (feed) ou 1080x1920 (stories/reels)
- Fundo escuro (alinhado com branding VoltStock)
- Produto em destaque com iluminacao dramatica
- Preco visivel e legivel
- Logo VoltStock no canto (discreto)
- Texto maximo 20% da imagem

**Videos:**
- Duracao: 15-30s (awareness), 6-15s (stories)
- Hook nos primeiros 3 segundos
- Legendas sempre (80% ve sem som)
- Formato vertical (9:16) prioritario
- CTA claro no final

**Copy:**
- Primeira linha = hook (deve funcionar sozinha)
- Mencionar Portugal/envio/MBWay
- Precos especificos (nao "desde X")
- Emojis com moderacao (1-2 max)
- CTA directo

---

## 4. Estrategia de Retargeting Completa

### 4.1 Funil de Retargeting

```
Visitou o site (sem accao)
  → Anuncio generico: "Descobre a VoltStock" (30 dias)
    ↓
Visitou pagina de produto
  → DPA: Mostra o produto que viu (14 dias)
    ↓
Adicionou ao carrinho (nao comprou)
  → DPA com desconto: "O teu carrinho espera" + VOLTA5 (7 dias)
    ↓
Iniciou checkout (nao completou)
  → Urgencia: "Finaliza agora. Stock limitado." (3 dias)
    ↓
Comprou
  → Cross-sell: Produtos complementares (30-90 dias)
  → Upsell: Versao superior do que comprou (60 dias)
```

### 4.2 Implementacao Tecnica

**Google Ads Retargeting:**
- Criar audiencias no Google Ads baseadas em visitas de pagina
- Campanhas Display para visitantes do site
- RLSA (Remarketing Lists for Search Ads) para ajustar lances em search

**Meta Retargeting:**
- Pixel events: ViewContent, AddToCart, InitiateCheckout, Purchase
- Custom Audiences baseadas em eventos
- Exclusao de compradores recentes (evitar irritar)

**Email Retargeting:**
- Trigger automatico de carrinho abandonado (ver MARKETING_EMAIL.md)
- Sincronizar com Meta Custom Audiences

### 4.3 Frequencia e Fadiga

| Audiencia | Frequencia maxima | Accao se exceder |
|-----------|------------------|------------------|
| Visitantes gerais | 3 impressoes/semana | Reduzir lance |
| Visitantes de produto | 5 impressoes/semana | Rodar criativos |
| Carrinho abandonado | 7 impressoes/semana | Mudar formato |
| Compradores | 2 impressoes/semana | Conteudo de valor, nao vendas |

---

## 5. Recomendacoes de Orcamento

### Cenario 1: Orcamento Minimo (500 EUR/mes)

| Canal | Valor | % | Foco |
|-------|-------|---|------|
| Google Shopping | 175 EUR | 35% | Conversao directa |
| Google Search | 75 EUR | 15% | Keywords de marca + alta intencao |
| Meta Ads | 175 EUR | 35% | Awareness + Retargeting |
| Ferramentas | 50 EUR | 10% | Canva, email marketing |
| Reserva | 25 EUR | 5% | Testes e ajustes |

**ROI esperado Mes 1:** 1.5-2x (750-1000 EUR em vendas)
**ROI esperado Mes 3:** 3-4x (1500-2000 EUR em vendas)

### Cenario 2: Orcamento Recomendado (1.000 EUR/mes)

| Canal | Valor | % | Foco |
|-------|-------|---|------|
| Google Shopping | 300 EUR | 30% | Conversao directa (catalogo completo) |
| Google Search | 150 EUR | 15% | Keywords de produto + categoria |
| Meta Ads (Conversao) | 200 EUR | 20% | Retargeting + DPA |
| Meta Ads (Awareness) | 150 EUR | 15% | Video + Lookalike |
| Influencers | 100 EUR | 10% | 1-2 micro-influencers/mes |
| Ferramentas | 75 EUR | 7.5% | Canva Pro, email, analytics |
| Testes | 25 EUR | 2.5% | A/B testing novos canais |

**ROI esperado Mes 1:** 2-2.5x (2000-2500 EUR em vendas)
**ROI esperado Mes 3:** 4-5x (4000-5000 EUR em vendas)

### Cenario 3: Orcamento de Escala (2.500 EUR/mes)

| Canal | Valor | % | Foco |
|-------|-------|---|------|
| Google Shopping | 625 EUR | 25% | Performance Max + Shopping standard |
| Google Search | 375 EUR | 15% | Expansao de keywords |
| Meta Ads | 625 EUR | 25% | Full funnel (awareness → conversao) |
| TikTok Ads | 250 EUR | 10% | Testar plataforma nova |
| Influencers | 250 EUR | 10% | 3-5 influencers/mes |
| SEO/Conteudo | 200 EUR | 8% | Freelancer para blog posts |
| Ferramentas | 100 EUR | 4% | Suite completa |
| Testes | 75 EUR | 3% | Novos canais e formatos |

**ROI esperado Mes 3:** 4-6x (10.000-15.000 EUR em vendas)

---

## 6. Metricas e Optimizacao

### KPIs por Canal

| Canal | Metrica Principal | Meta | Metrica Secundaria | Meta |
|-------|------------------|------|-------------------|------|
| Google Shopping | ROAS | 4x+ | CPC | < 0.50 EUR |
| Google Search | ROAS | 3x+ | CTR | > 5% |
| Meta Awareness | CPM | < 5 EUR | Reach | > 50K/mes |
| Meta Conversao | ROAS | 3x+ | CPA | < 15 EUR |
| Meta Retargeting | ROAS | 6x+ | Frequencia | < 5/semana |

### Calendario de Optimizacao

| Frequencia | Accao |
|-----------|-------|
| Diaria | Verificar gastos vs orcamento, pausar ads com CPA > 2x meta |
| Semanal | Review de performance por ad set, ajustar lances, rodar criativos |
| Quinzenal | A/B test novos criativos, testar novas audiencias |
| Mensal | Review completa, realocar orcamento, analisar tendencias |
| Trimestral | Auditoria de conta completa, estrategia de escala |

### Sinais de Alarme (Pausar Imediatamente)

- ROAS < 1x por mais de 7 dias consecutivos
- CPA > 3x o valor medio da margem por venda
- Frequencia > 10 para qualquer audiencia de retargeting
- CTR < 0.5% em campanhas de search
- Taxa de bounce > 80% em landing pages de ads
