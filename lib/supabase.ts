import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client for API routes
export const createServerSupabaseClient = () => {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

// Database types
export interface Agent {
  id: string
  title: string
  description: string
  price: number
  image_url: string | null
  category: string
  author_id: string | null
  features: string[]
  tags: string[]
  documentation: string | null
  api_access: string | null
  download_link: string
  requirements: string | null
  support_email: string
  version: string
  rating: number
  downloads: number
  status: "pending" | "approved" | "rejected" | "archived"
  created_at: string
  updated_at: string
}

export interface Purchase {
  id: string
  user_id: string
  agent_id: string
  stripe_session_id: string | null
  stripe_payment_intent_id: string | null
  amount: number
  currency: string
  status: "pending" | "completed" | "failed" | "refunded"
  purchase_date: string
  download_count: number
  last_downloaded_at: string | null
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface AgentReview {
  id: string
  agent_id: string
  user_id: string
  rating: number
  review_text: string | null
  created_at: string
  updated_at: string
}
