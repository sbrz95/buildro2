-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('user', 'admin', 'super_admin');
CREATE TYPE subscription_plan AS ENUM ('starter', 'pro', 'custom');
CREATE TYPE project_status AS ENUM ('draft', 'active', 'archived');
CREATE TYPE marketplace_agent_status AS ENUM ('pending', 'approved', 'rejected', 'archived');

-- Users table with role management
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    role user_role DEFAULT 'user',
    subscription_plan subscription_plan DEFAULT 'starter',
    subscription_active BOOLEAN DEFAULT false,
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status project_status DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agents table (user's private agents)
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    model VARCHAR(100),
    temperature DECIMAL(3,2),
    system_prompt TEXT,
    configuration JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marketplace agents table (public agents for sale)
CREATE TABLE marketplace_agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    detailed_description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100),
    tags TEXT[],
    model VARCHAR(100),
    temperature DECIMAL(3,2),
    system_prompt TEXT,
    configuration JSONB,
    status marketplace_agent_status DEFAULT 'pending',
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    featured BOOLEAN DEFAULT false,
    downloads_count INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marketplace purchases table
CREATE TABLE marketplace_purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES marketplace_agents(id) ON DELETE CASCADE,
    price_paid DECIMAL(10,2) NOT NULL,
    stripe_session_id VARCHAR(255),
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marketplace reviews table
CREATE TABLE marketplace_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES marketplace_agents(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, agent_id)
);

-- Demos table
CREATE TABLE demos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    configuration JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bulk tests table
CREATE TABLE bulk_tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    test_data JSONB,
    results JSONB,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API keys table
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    key_hash VARCHAR(255) NOT NULL,
    key_preview VARCHAR(20) NOT NULL,
    permissions JSONB,
    last_used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Data access logs for GDPR compliance
CREATE TABLE data_access_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id UUID,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE demos ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulk_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_access_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for projects table
CREATE POLICY "Users can view own projects" ON projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON projects FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for agents table
CREATE POLICY "Users can view own agents" ON agents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own agents" ON agents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own agents" ON agents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own agents" ON agents FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for marketplace_agents table
CREATE POLICY "Everyone can view approved marketplace agents" ON marketplace_agents FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can view own marketplace agents" ON marketplace_agents FOR SELECT USING (auth.uid() = creator_id);
CREATE POLICY "Users can create marketplace agents" ON marketplace_agents FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Users can update own marketplace agents" ON marketplace_agents FOR UPDATE USING (auth.uid() = creator_id);
CREATE POLICY "Admins can approve marketplace agents" ON marketplace_agents FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- RLS Policies for marketplace_purchases table
CREATE POLICY "Users can view own purchases" ON marketplace_purchases FOR SELECT USING (auth.uid() = buyer_id);
CREATE POLICY "Users can create purchases" ON marketplace_purchases FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- RLS Policies for marketplace_reviews table
CREATE POLICY "Everyone can view reviews" ON marketplace_reviews FOR SELECT USING (true);
CREATE POLICY "Users can create own reviews" ON marketplace_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON marketplace_reviews FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for demos table
CREATE POLICY "Users can view own demos" ON demos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own demos" ON demos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own demos" ON demos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own demos" ON demos FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for bulk_tests table
CREATE POLICY "Users can view own bulk tests" ON bulk_tests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own bulk tests" ON bulk_tests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bulk tests" ON bulk_tests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own bulk tests" ON bulk_tests FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for api_keys table
CREATE POLICY "Users can view own API keys" ON api_keys FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own API keys" ON api_keys FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own API keys" ON api_keys FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own API keys" ON api_keys FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for data_access_logs table
CREATE POLICY "Users can view own access logs" ON data_access_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can create access logs" ON data_access_logs FOR INSERT WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_agents_user_id ON agents(user_id);
CREATE INDEX idx_agents_project_id ON agents(project_id);
CREATE INDEX idx_marketplace_agents_status ON marketplace_agents(status);
CREATE INDEX idx_marketplace_agents_category ON marketplace_agents(category);
CREATE INDEX idx_marketplace_agents_featured ON marketplace_agents(featured);
CREATE INDEX idx_marketplace_purchases_buyer_id ON marketplace_purchases(buyer_id);
CREATE INDEX idx_marketplace_purchases_agent_id ON marketplace_purchases(agent_id);
CREATE INDEX idx_marketplace_reviews_agent_id ON marketplace_reviews(agent_id);
CREATE INDEX idx_demos_user_id ON demos(user_id);
CREATE INDEX idx_bulk_tests_user_id ON bulk_tests(user_id);
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_data_access_logs_user_id ON data_access_logs(user_id);

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON agents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_marketplace_agents_updated_at BEFORE UPDATE ON marketplace_agents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_demos_updated_at BEFORE UPDATE ON demos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bulk_tests_updated_at BEFORE UPDATE ON bulk_tests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample admin user (you should change this email and add proper authentication)
INSERT INTO users (email, name, role, subscription_plan, subscription_active) 
VALUES ('admin@fercon.de', 'Admin User', 'admin', 'custom', true);
