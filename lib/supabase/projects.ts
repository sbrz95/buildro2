import { createClient } from "./server"
import type { Project, Agent, Demo, BulkTest } from "./client"

// Project CRUD operations
export async function getUserProjects(userId: string): Promise<Project[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })

  if (error) {
    console.error("Error fetching projects:", error)
    return []
  }

  return data || []
}

export async function createProject(
  projectData: Omit<Project, "id" | "created_at" | "updated_at">,
): Promise<Project | null> {
  const supabase = createClient()

  const { data, error } = await supabase.from("projects").insert([projectData]).select().single()

  if (error) {
    console.error("Error creating project:", error)
    return null
  }

  return data
}

export async function updateProject(
  projectId: string,
  userId: string,
  updates: Partial<Project>,
): Promise<Project | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("projects")
    .update(updates)
    .eq("id", projectId)
    .eq("user_id", userId)
    .select()
    .single()

  if (error) {
    console.error("Error updating project:", error)
    return null
  }

  return data
}

export async function deleteProject(projectId: string, userId: string): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase.from("projects").delete().eq("id", projectId).eq("user_id", userId)

  if (error) {
    console.error("Error deleting project:", error)
    return false
  }

  return true
}

// Agent CRUD operations
export async function getUserAgents(userId: string, projectId?: string): Promise<Agent[]> {
  const supabase = createClient()

  let query = supabase.from("agents").select("*").eq("user_id", userId)

  if (projectId) {
    query = query.eq("project_id", projectId)
  }

  const { data, error } = await query.order("updated_at", { ascending: false })

  if (error) {
    console.error("Error fetching agents:", error)
    return []
  }

  return data || []
}

export async function createAgent(agentData: Omit<Agent, "id" | "created_at" | "updated_at">): Promise<Agent | null> {
  const supabase = createClient()

  const { data, error } = await supabase.from("agents").insert([agentData]).select().single()

  if (error) {
    console.error("Error creating agent:", error)
    return null
  }

  return data
}

export async function updateAgent(agentId: string, userId: string, updates: Partial<Agent>): Promise<Agent | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("agents")
    .update(updates)
    .eq("id", agentId)
    .eq("user_id", userId)
    .select()
    .single()

  if (error) {
    console.error("Error updating agent:", error)
    return null
  }

  return data
}

export async function deleteAgent(agentId: string, userId: string): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase.from("agents").delete().eq("id", agentId).eq("user_id", userId)

  if (error) {
    console.error("Error deleting agent:", error)
    return false
  }

  return true
}

// Demo CRUD operations
export async function getUserDemos(userId: string, projectId?: string): Promise<Demo[]> {
  const supabase = createClient()

  let query = supabase.from("demos").select("*").eq("user_id", userId)

  if (projectId) {
    query = query.eq("project_id", projectId)
  }

  const { data, error } = await query.order("updated_at", { ascending: false })

  if (error) {
    console.error("Error fetching demos:", error)
    return []
  }

  return data || []
}

export async function createDemo(demoData: Omit<Demo, "id" | "created_at" | "updated_at">): Promise<Demo | null> {
  const supabase = createClient()

  const { data, error } = await supabase.from("demos").insert([demoData]).select().single()

  if (error) {
    console.error("Error creating demo:", error)
    return null
  }

  return data
}

export async function updateDemo(demoId: string, userId: string, updates: Partial<Demo>): Promise<Demo | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("demos")
    .update(updates)
    .eq("id", demoId)
    .eq("user_id", userId)
    .select()
    .single()

  if (error) {
    console.error("Error updating demo:", error)
    return null
  }

  return data
}

export async function deleteDemo(demoId: string, userId: string): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase.from("demos").delete().eq("id", demoId).eq("user_id", userId)

  if (error) {
    console.error("Error deleting demo:", error)
    return false
  }

  return true
}

// Bulk Test CRUD operations
export async function getUserBulkTests(userId: string, projectId?: string): Promise<BulkTest[]> {
  const supabase = createClient()

  let query = supabase.from("bulk_tests").select("*").eq("user_id", userId)

  if (projectId) {
    query = query.eq("project_id", projectId)
  }

  const { data, error } = await query.order("updated_at", { ascending: false })

  if (error) {
    console.error("Error fetching bulk tests:", error)
    return []
  }

  return data || []
}

export async function createBulkTest(
  bulkTestData: Omit<BulkTest, "id" | "created_at" | "updated_at">,
): Promise<BulkTest | null> {
  const supabase = createClient()

  const { data, error } = await supabase.from("bulk_tests").insert([bulkTestData]).select().single()

  if (error) {
    console.error("Error creating bulk test:", error)
    return null
  }

  return data
}

export async function updateBulkTest(
  bulkTestId: string,
  userId: string,
  updates: Partial<BulkTest>,
): Promise<BulkTest | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("bulk_tests")
    .update(updates)
    .eq("id", bulkTestId)
    .eq("user_id", userId)
    .select()
    .single()

  if (error) {
    console.error("Error updating bulk test:", error)
    return null
  }

  return data
}

export async function deleteBulkTest(bulkTestId: string, userId: string): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase.from("bulk_tests").delete().eq("id", bulkTestId).eq("user_id", userId)

  if (error) {
    console.error("Error deleting bulk test:", error)
    return false
  }

  return true
}
