import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Check if Supabase environment variables are available
export const isSupabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0

// Create a singleton instance of the Supabase client for Client Components
export const supabase = createClientComponentClient()

// Database types
export interface User {
  id: string
  email: string
  full_name?: string
  subscription_plan: "starter" | "pro" | "custom"
  subscription_status: "active" | "inactive" | "cancelled"
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  user_id: string
  name: string
  description?: string
  type: "agent" | "demo" | "bulk_test"
  status: "draft" | "active" | "archived"
  configuration: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Agent {
  id: string
  project_id: string
  user_id: string
  name: string
  description?: string
  prompt?: string
  model: string
  temperature: number
  max_tokens: number
  system_instructions?: string
  created_at: string
  updated_at: string
}

export interface Demo {
  id: string
  project_id: string
  user_id: string
  name: string
  description?: string
  agent_id?: string
  is_public: boolean
  public_url?: string
  settings: Record<string, any>
  created_at: string
  updated_at: string
}

export interface BulkTest {
  id: string
  project_id: string
  user_id: string
  name: string
  agent_id?: string
  test_type: "assistant" | "chat_completion"
  test_data: any[]
  results: Record<string, any>
  status: "pending" | "running" | "completed" | "failed"
  created_at: string
  updated_at: string
}
