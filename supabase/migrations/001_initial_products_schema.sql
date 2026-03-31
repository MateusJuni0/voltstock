-- Migration: 001_initial_products_schema
-- Description: Cria as tabelas para gerir os produtos vindos do AliExpress, incluindo categorias, fornecedores e estrutura de pricing.

-- Activar a extensão UUID para ids
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Categorias
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Produtos (O Catálogo principal sincronizado)
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aliexpress_id TEXT UNIQUE, -- ID do produto no fornecedor
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  
  -- Preços (em EUR)
  cost_price DECIMAL(10,2) NOT NULL,    -- Custo no AliExpress
  selling_price DECIMAL(10,2) NOT NULL, -- Preço na nossa loja VoltStock (calculado com margem)
  old_price DECIMAL(10,2),              -- Se estiver em promoção
  margin_percentage INT DEFAULT 0,      -- Margem de lucro (ex: 50%)

  -- Metadata e Variantes
  features JSONB DEFAULT '[]',          -- Ex: [{ "key": "Taxa Atualização", "value": "144Hz" }]
  images TEXT[] DEFAULT '{}',           -- Array de URLs das fotos do produto
  in_stock BOOLEAN DEFAULT true,
  stock_quantity INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,    -- Se vai para a página principal / "carrosel"
  badge TEXT,                           -- "Novo", "Promoção", "Exclusivo"
  
  -- Tracking do fornecedor
  supplier_url TEXT,                    -- URL do AliExpress
  shipping_time_days INT,               -- Estimativa de dias de entrega
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indices para queries rápidas
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX idx_products_slug ON products(slug);

-- RLS (Row Level Security) - Leitura pública, escrita só por Admins
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categorias visíveis a todos" ON categories FOR SELECT USING (true);
CREATE POLICY "Produtos visíveis a todos" ON products FOR SELECT USING (true);

-- Funções para atualizar o updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trg_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
