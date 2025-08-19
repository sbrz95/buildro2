import { createClient } from "@/lib/supabase/server"

// Data access logging for privacy compliance
export interface DataAccessLog {
  id: string
  user_id: string
  resource_type: string
  resource_id: string
  action: "read" | "write" | "delete"
  ip_address?: string
  user_agent?: string
  timestamp: string
}

export async function logDataAccess(
  userId: string,
  resourceType: string,
  resourceId: string,
  action: "read" | "write" | "delete",
  metadata?: {
    ip_address?: string
    user_agent?: string
  },
) {
  const supabase = createClient()

  try {
    await supabase.from("data_access_logs").insert([
      {
        user_id: userId,
        resource_type: resourceType,
        resource_id: resourceId,
        action,
        ip_address: metadata?.ip_address,
        user_agent: metadata?.user_agent,
        timestamp: new Date().toISOString(),
      },
    ])
  } catch (error) {
    console.error("Failed to log data access:", error)
  }
}

// Privacy-focused data retrieval with automatic logging
export async function getDataWithLogging<T>(
  userId: string,
  resourceType: string,
  resourceId: string,
  dataFetcher: () => Promise<T>,
  metadata?: {
    ip_address?: string
    user_agent?: string
  },
): Promise<T> {
  // Log the data access
  await logDataAccess(userId, resourceType, resourceId, "read", metadata)

  // Fetch and return the data
  return await dataFetcher()
}

// Data anonymization utilities
export function anonymizeEmail(email: string): string {
  const [localPart, domain] = email.split("@")
  if (localPart.length <= 2) {
    return `${localPart[0]}***@${domain}`
  }
  return `${localPart.substring(0, 2)}***@${domain}`
}

export function anonymizeUserData(userData: any) {
  return {
    ...userData,
    email: userData.email ? anonymizeEmail(userData.email) : undefined,
    full_name: userData.full_name ? userData.full_name.charAt(0) + "***" : undefined,
    // Remove sensitive fields
    id: undefined,
    created_at: undefined,
    updated_at: undefined,
  }
}

// GDPR compliance utilities
export async function exportUserData(userId: string) {
  const supabase = createClient()

  try {
    // Fetch all user data
    const [userProfile, projects, agents, demos, bulkTests] = await Promise.all([
      supabase.from("users").select("*").eq("id", userId).single(),
      supabase.from("projects").select("*").eq("user_id", userId),
      supabase.from("agents").select("*").eq("user_id", userId),
      supabase.from("demos").select("*").eq("user_id", userId),
      supabase.from("bulk_tests").select("*").eq("user_id", userId),
    ])

    return {
      user_profile: userProfile.data,
      projects: projects.data || [],
      agents: agents.data || [],
      demos: demos.data || [],
      bulk_tests: bulkTests.data || [],
      export_date: new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error exporting user data:", error)
    throw new Error("Failed to export user data")
  }
}

export async function deleteAllUserData(userId: string) {
  const supabase = createClient()

  try {
    // Delete in correct order due to foreign key constraints
    await supabase.from("bulk_tests").delete().eq("user_id", userId)
    await supabase.from("demos").delete().eq("user_id", userId)
    await supabase.from("agents").delete().eq("user_id", userId)
    await supabase.from("projects").delete().eq("user_id", userId)
    await supabase.from("data_access_logs").delete().eq("user_id", userId)
    await supabase.from("users").delete().eq("id", userId)

    // Also delete from auth.users
    await supabase.auth.admin.deleteUser(userId)

    return true
  } catch (error) {
    console.error("Error deleting user data:", error)
    throw new Error("Failed to delete user data")
  }
}
