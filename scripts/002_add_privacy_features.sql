-- Create data access logs table for privacy compliance
CREATE TABLE IF NOT EXISTS public.data_access_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('read', 'write', 'delete')),
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create privacy settings table
CREATE TABLE IF NOT EXISTS public.privacy_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  data_processing_consent BOOLEAN DEFAULT FALSE,
  marketing_consent BOOLEAN DEFAULT FALSE,
  analytics_consent BOOLEAN DEFAULT FALSE,
  data_retention_days INTEGER DEFAULT 365,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE public.data_access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.privacy_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for data_access_logs
CREATE POLICY "Users can view own access logs" ON public.data_access_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Create RLS policies for privacy_settings
CREATE POLICY "Users can view own privacy settings" ON public.privacy_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own privacy settings" ON public.privacy_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own privacy settings" ON public.privacy_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_data_access_logs_user_id ON public.data_access_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_data_access_logs_timestamp ON public.data_access_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_privacy_settings_user_id ON public.privacy_settings(user_id);

-- Create function to automatically create privacy settings for new users
CREATE OR REPLACE FUNCTION public.create_privacy_settings_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.privacy_settings (user_id, data_processing_consent)
  VALUES (NEW.id, TRUE); -- Default consent for basic functionality
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for privacy settings creation
DROP TRIGGER IF EXISTS on_user_created_privacy_settings ON public.users;
CREATE TRIGGER on_user_created_privacy_settings
  AFTER INSERT ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.create_privacy_settings_for_user();

-- Add updated_at trigger for privacy_settings
CREATE TRIGGER update_privacy_settings_updated_at BEFORE UPDATE ON public.privacy_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function for data retention cleanup
CREATE OR REPLACE FUNCTION public.cleanup_old_data()
RETURNS void AS $$
DECLARE
  user_record RECORD;
BEGIN
  -- Clean up old data based on user privacy settings
  FOR user_record IN 
    SELECT u.id, ps.data_retention_days 
    FROM public.users u
    JOIN public.privacy_settings ps ON u.id = ps.user_id
    WHERE ps.data_retention_days IS NOT NULL
  LOOP
    -- Delete old access logs
    DELETE FROM public.data_access_logs 
    WHERE user_id = user_record.id 
    AND timestamp < NOW() - INTERVAL '1 day' * user_record.data_retention_days;
    
    -- Archive old projects (mark as archived instead of deleting)
    UPDATE public.projects 
    SET status = 'archived'
    WHERE user_id = user_record.id 
    AND updated_at < NOW() - INTERVAL '1 day' * user_record.data_retention_days
    AND status != 'archived';
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
