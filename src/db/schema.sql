CREATE TABLE IF NOT EXISTS tenants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  plan TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  reset_token TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  owner_id TEXT,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  source TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  website TEXT,
  industry TEXT,
  annual_revenue NUMERIC,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS deals (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  contact_id TEXT,
  account_id TEXT,
  title TEXT,
  stage TEXT,
  amount NUMERIC,
  priority INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  body TEXT,
  created_by TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS files (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  owner_id TEXT,
  original_name TEXT,
  storage_path TEXT,
  mime_type TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS api_keys (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  key_value TEXT NOT NULL,
  description TEXT,
  created_by TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  tenant_id TEXT,
  user_id TEXT,
  action TEXT,
  details TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS credit_ledger (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  deal_id TEXT NOT NULL,
  credits INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'open',
  due_date TEXT,
  assignee_id TEXT,
  metadata TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tickets (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'new',
  reporter_id TEXT,
  metadata TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS campaigns (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  channel TEXT,
  budget NUMERIC,
  status TEXT DEFAULT 'draft',
  starts_on TEXT,
  ends_on TEXT,
  metadata TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS invoices (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  account_id TEXT,
  reference TEXT,
  amount NUMERIC,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending',
  due_date TEXT,
  metadata TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS activities (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  actor_id TEXT,
  entity_type TEXT,
  entity_id TEXT,
  action TEXT,
  metadata TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS webhooks (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  event_name TEXT NOT NULL,
  target_url TEXT NOT NULL,
  secret TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  metadata TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workflows (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  trigger_event TEXT NOT NULL,
  definition_json TEXT,
  is_enabled BOOLEAN DEFAULT TRUE,
  metadata TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  query_template TEXT,
  visibility TEXT DEFAULT 'private',
  last_generated_at TEXT,
  metadata TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  sku TEXT,
  name TEXT NOT NULL,
  category TEXT,
  unit_price NUMERIC,
  status TEXT DEFAULT 'active',
  metadata TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  account_id TEXT,
  plan_name TEXT,
  billing_cycle TEXT DEFAULT 'monthly',
  status TEXT DEFAULT 'active',
  renews_on TEXT,
  metadata TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contracts (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  account_id TEXT,
  contract_name TEXT,
  owner_id TEXT,
  status TEXT DEFAULT 'draft',
  expires_on TEXT,
  metadata TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quotes (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  account_id TEXT,
  deal_id TEXT,
  quote_number TEXT,
  total_amount NUMERIC,
  status TEXT DEFAULT 'created',
  metadata TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS forecasts (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  period TEXT,
  owner_id TEXT,
  expected_revenue NUMERIC,
  confidence INTEGER,
  status TEXT DEFAULT 'open',
  metadata TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS segments (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  segment_name TEXT,
  criteria_json TEXT,
  audience_size INTEGER,
  status TEXT DEFAULT 'active',
  metadata TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS playbooks (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  name TEXT,
  owner_id TEXT,
  trigger_event TEXT,
  step_count INTEGER,
  status TEXT DEFAULT 'active',
  metadata TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS escalations (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  source_type TEXT,
  source_id TEXT,
  assigned_to TEXT,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'open',
  metadata TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS onboardings (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  customer_name TEXT,
  owner_id TEXT,
  stage TEXT DEFAULT 'kickoff',
  completion_pct INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  metadata TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS integrations (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  provider TEXT,
  config_name TEXT,
  endpoint_url TEXT,
  status TEXT DEFAULT 'connected',
  last_sync_at TEXT,
  metadata TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  channel TEXT,
  recipient_id TEXT,
  message TEXT,
  severity TEXT DEFAULT 'info',
  status TEXT DEFAULT 'queued',
  metadata TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS announcements (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  title TEXT,
  body TEXT,
  audience TEXT,
  status TEXT DEFAULT 'published',
  published_at TEXT,
  metadata TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
