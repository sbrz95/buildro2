-- Create marketplace database schema for buildro.ai
-- This script sets up all necessary tables for the marketplace functionality

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agents table
CREATE TABLE IF NOT EXISTS public.agents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    image_url TEXT,
    category TEXT NOT NULL,
    author_id UUID REFERENCES public.profiles(id),
    features TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    documentation TEXT,
    api_access TEXT,
    download_link TEXT NOT NULL,
    requirements TEXT,
    support_email TEXT NOT NULL,
    version TEXT DEFAULT '1.0.0',
    rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    downloads INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Purchases table
CREATE TABLE IF NOT EXISTS public.purchases (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    agent_id UUID REFERENCES public.agents(id) NOT NULL,
    stripe_session_id TEXT UNIQUE,
    stripe_payment_intent_id TEXT,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'EUR',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    download_count INTEGER DEFAULT 0,
    last_downloaded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, agent_id) -- Prevent duplicate purchases
);

-- Agent reviews table
CREATE TABLE IF NOT EXISTS public.agent_reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    agent_id UUID REFERENCES public.agents(id) NOT NULL,
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(agent_id, user_id) -- One review per user per agent
);

-- Agent categories table (for better category management)
CREATE TABLE IF NOT EXISTS public.agent_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Download logs table (for analytics)
CREATE TABLE IF NOT EXISTS public.download_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    purchase_id UUID REFERENCES public.purchases(id) NOT NULL,
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    agent_id UUID REFERENCES public.agents(id) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_agents_category ON public.agents(category);
CREATE INDEX IF NOT EXISTS idx_agents_status ON public.agents(status);
CREATE INDEX IF NOT EXISTS idx_agents_created_at ON public.agents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agents_rating ON public.agents(rating DESC);
CREATE INDEX IF NOT EXISTS idx_agents_downloads ON public.agents(downloads DESC);
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON public.purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_agent_id ON public.purchases(agent_id);
CREATE INDEX IF NOT EXISTS idx_purchases_status ON public.purchases(status);
CREATE INDEX IF NOT EXISTS idx_agent_reviews_agent_id ON public.agent_reviews(agent_id);

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON public.agents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchases_updated_at BEFORE UPDATE ON public.purchases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agent_reviews_updated_at BEFORE UPDATE ON public.agent_reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update agent rating when reviews change
CREATE OR REPLACE FUNCTION update_agent_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.agents 
    SET rating = (
        SELECT COALESCE(AVG(rating), 0)
        FROM public.agent_reviews 
        WHERE agent_id = COALESCE(NEW.agent_id, OLD.agent_id)
    )
    WHERE id = COALESCE(NEW.agent_id, OLD.agent_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Create trigger to automatically update agent rating
CREATE TRIGGER update_agent_rating_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.agent_reviews
    FOR EACH ROW EXECUTE FUNCTION update_agent_rating();

-- Function to increment download count
CREATE OR REPLACE FUNCTION increment_download_count(agent_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.agents 
    SET downloads = downloads + 1 
    WHERE id = agent_uuid;
END;
$$ language 'plpgsql';
