# Supabase Setup Guide für buildro.ai Marketplace

## 1. Supabase Projekt erstellen

1. Gehe zu [supabase.com](https://supabase.com) und erstelle ein neues Projekt
2. Wähle eine Region (empfohlen: EU für DSGVO-Konformität)
3. Notiere dir die Projekt-URL und API-Keys

## 2. Datenbank Schema einrichten

1. Öffne den SQL Editor in deinem Supabase Dashboard
2. Führe die folgenden Scripts in dieser Reihenfolge aus:
   - `scripts/001_create_marketplace_tables.sql`
   - `scripts/002_seed_marketplace_data.sql`

## 3. Row Level Security (RLS) konfigurieren

\`\`\`sql
-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.download_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Agents policies
CREATE POLICY "Anyone can view approved agents" ON public.agents
    FOR SELECT USING (status = 'approved');

CREATE POLICY "Authors can manage own agents" ON public.agents
    FOR ALL USING (auth.uid() = author_id);

-- Purchases policies
CREATE POLICY "Users can view own purchases" ON public.purchases
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own purchases" ON public.purchases
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON public.agent_reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can manage own reviews" ON public.agent_reviews
    FOR ALL USING (auth.uid() = user_id);

-- Download logs policies
CREATE POLICY "Users can view own downloads" ON public.download_logs
    FOR SELECT USING (auth.uid() = user_id);
\`\`\`

## 4. Environment Variables konfigurieren

Kopiere `.env.example` zu `.env.local` und fülle die Werte aus:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
\`\`\`

## 5. Storage für Agent-Bilder einrichten

1. Gehe zu Storage im Supabase Dashboard
2. Erstelle einen Bucket namens "agent-images"
3. Konfiguriere die Bucket-Policies:

\`\`\`sql
-- Allow public read access to agent images
CREATE POLICY "Public read access" ON storage.objects
    FOR SELECT USING (bucket_id = 'agent-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated upload" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'agent-images' 
        AND auth.role() = 'authenticated'
    );
\`\`\`

## 6. Webhooks für Stripe einrichten

1. Erstelle eine Edge Function für Stripe Webhooks:

\`\`\`sql
-- Create webhook handler function
CREATE OR REPLACE FUNCTION handle_stripe_webhook()
RETURNS trigger AS $$
BEGIN
    -- Handle successful payments
    IF NEW.status = 'completed' THEN
        -- Update agent download count
        UPDATE public.agents 
        SET downloads = downloads + 1 
        WHERE id = NEW.agent_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER on_purchase_completed
    AFTER UPDATE ON public.purchases
    FOR EACH ROW
    WHEN (OLD.status != NEW.status AND NEW.status = 'completed')
    EXECUTE FUNCTION handle_stripe_webhook();
\`\`\`

## 7. Testing

1. Führe die Seed-Daten aus um Test-Agenten zu erstellen
2. Teste die API-Endpoints:
   - `GET /api/marketplace/agents/supabase` - Agenten abrufen
   - `POST /api/marketplace/agents/supabase` - Agent erstellen
   - `GET /api/marketplace/purchases/supabase` - Käufe abrufen

## 8. Produktions-Deployment

1. Stelle sicher, dass alle Environment Variables gesetzt sind
2. Aktiviere RLS auf allen Tabellen
3. Konfiguriere Backup-Strategien
4. Überwache Performance mit Supabase Analytics

## Troubleshooting

### Häufige Probleme:

1. **RLS Fehler**: Stelle sicher, dass alle Policies korrekt konfiguriert sind
2. **API Fehler**: Überprüfe die Service Role Key Berechtigung
3. **Upload Fehler**: Verifiziere Storage Bucket Policies
4. **Performance**: Überprüfe Indizes und Query-Performance

### Logs überprüfen:

\`\`\`sql
-- Check recent errors
SELECT * FROM auth.audit_log_entries 
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;

-- Monitor API usage
SELECT * FROM supabase_functions.logs 
WHERE timestamp > NOW() - INTERVAL '1 hour'
ORDER BY timestamp DESC;
