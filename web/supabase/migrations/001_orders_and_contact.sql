-- ============================================================================
-- Migration 001: Orders, Order Items, and Contact Messages
-- VoltStock E-commerce — CMTecnologia
-- ============================================================================

-- ── Orders ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  stripe_session_id TEXT UNIQUE NOT NULL,
  stripe_payment_intent TEXT,
  status TEXT DEFAULT 'paid' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')),
  total DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  shipping_name TEXT,
  shipping_address TEXT,
  shipping_city TEXT,
  shipping_postal_code TEXT,
  shipping_district TEXT,
  shipping_phone TEXT,
  shipping_nif TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_name TEXT NOT NULL,
  product_id TEXT,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session ON orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- RLS policies
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Users can read their own orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- Users can read their own order items
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

-- Service role can insert orders (webhook runs with service_role key, bypasses RLS)
CREATE POLICY "Service role can insert orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Service role can insert order items
CREATE POLICY "Service role can insert order items"
  ON order_items FOR INSERT
  WITH CHECK (true);

-- ── Contact Messages ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Service role manages contact messages (inserted by API route with service key)
CREATE POLICY "Service role manages contact messages"
  ON contact_messages FOR ALL
  USING (true);
