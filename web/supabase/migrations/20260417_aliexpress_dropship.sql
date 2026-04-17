-- AliExpress dropshipping schema: imported products + order tracking columns.
-- Runs AFTER 20260417_aliexpress_tokens.sql.

-- AE Products: imported from AliExpress catalog (separate from static /data/products.ts)
CREATE TABLE IF NOT EXISTS ae_products (
  id BIGSERIAL PRIMARY KEY,
  ae_product_id TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  cost_price DECIMAL(10,2) NOT NULL,
  selling_price DECIMAL(10,2) NOT NULL,
  margin_percentage INT DEFAULT 100,
  currency TEXT DEFAULT 'EUR',
  main_image TEXT,
  gallery JSONB DEFAULT '[]'::jsonb,
  description TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  supplier_url TEXT NOT NULL,
  stock_quantity INT DEFAULT 0,
  sku_list JSONB DEFAULT '[]'::jsonb,
  ship_to_country TEXT DEFAULT 'PT',
  imported_by UUID REFERENCES auth.users(id),
  imported_at TIMESTAMPTZ DEFAULT NOW(),
  last_synced_at TIMESTAMPTZ DEFAULT NOW(),
  active BOOLEAN DEFAULT true,
  raw_ae_response JSONB
);

CREATE INDEX IF NOT EXISTS idx_ae_products_slug ON ae_products(slug);
CREATE INDEX IF NOT EXISTS idx_ae_products_active ON ae_products(active);

ALTER TABLE ae_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_active_ae_products" ON ae_products;
CREATE POLICY "public_read_active_ae_products" ON ae_products
  FOR SELECT USING (active = true);

DROP POLICY IF EXISTS "service_role_manages_ae_products" ON ae_products;
CREATE POLICY "service_role_manages_ae_products" ON ae_products
  FOR ALL USING (auth.role() = 'service_role');

-- Extend orders with AE dropship tracking
ALTER TABLE orders ADD COLUMN IF NOT EXISTS ae_order_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS ae_order_status TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS ae_tracking_number TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS ae_carrier TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS ae_last_synced_at TIMESTAMPTZ;

-- Extend order_items with AE mapping
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS ae_product_id TEXT;
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS ae_sku_attr TEXT;

CREATE INDEX IF NOT EXISTS idx_orders_ae_order_id ON orders(ae_order_id) WHERE ae_order_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_order_items_ae_product_id ON order_items(ae_product_id) WHERE ae_product_id IS NOT NULL;
