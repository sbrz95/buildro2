import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getUserAgents, createAgent } from "@/lib/supabase/projects"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: userData, error: userError } = await supabase.from("users").select("role").eq("id", user.id).single()

    if (userError) {
      console.error("Error fetching user role:", userError)
      return NextResponse.json({ error: "Failed to verify user permissions" }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("project_id")
    const isAdmin = userData?.role === "admin" || userData?.role === "super_admin"

    let agents

    if (isAdmin) {
      const { data: allAgents, error: agentsError } = await supabase
        .from("agents")
        .select(`
          *,
          users!agents_user_id_fkey(name, email)
        `)
        .order("created_at", { ascending: false })

      if (agentsError) {
        console.error("Error fetching all agents:", agentsError)
        return NextResponse.json({ error: "Failed to fetch agents" }, { status: 500 })
      }

      agents = allAgents || []
    } else {
      agents = await getUserAgents(user.id, projectId || undefined)
    }

    // Transform database format to expected frontend format
    const transformedAgents = agents.map((agent) => ({
      id: agent.id,
      name: agent.name,
      description: agent.description || "",
      model: agent.model,
      temperature: agent.temperature,
      max_tokens: agent.max_tokens,
      system_instructions: agent.system_instructions,
      prompt: agent.prompt,
      created_at: agent.created_at,
      updated_at: agent.updated_at,
      user_id: agent.user_id,
      creator:
        isAdmin && agent.users
          ? {
              name: agent.users.name,
              email: agent.users.email,
            }
          : undefined,
      // Mock versions for compatibility with existing frontend
      versions: [
        {
          version: "v1.0",
          createdAt: agent.created_at,
          isLatest: true,
        },
      ],
    }))

    return NextResponse.json({
      agents: transformedAgents,
      isAdmin,
      totalCount: transformedAgents.length,
    })
  } catch (error) {
    console.error("Error fetching agents:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      project_id,
      name,
      description,
      model = "gpt-4",
      temperature = 0.7,
      max_tokens = 1000,
      system_instructions,
      prompt,
      system_prompt,
      settings,
      status = "active",
    } = body

    if (!name) {
      return NextResponse.json({ error: "Agent name is required" }, { status: 400 })
    }

    const agentData = {
      project_id: project_id || null,
      user_id: user.id,
      name,
      description,
      model,
      temperature,
      max_tokens,
      system_instructions: system_instructions || system_prompt,
      prompt,
      configuration: settings ? JSON.stringify(settings) : null,
    }

    const agent = await createAgent(agentData)

    if (!agent) {
      return NextResponse.json({ error: "Failed to create agent" }, { status: 500 })
    }

    // Transform to expected format
    const transformedAgent = {
      id: agent.id,
      name: agent.name,
      description: agent.description || "",
      model: agent.model,
      temperature: agent.temperature,
      max_tokens: agent.max_tokens,
      system_instructions: agent.system_instructions,
      prompt: agent.prompt,
      created_at: agent.created_at,
      updated_at: agent.updated_at,
      user_id: agent.user_id,
      versions: [
        {
          version: "v1.0",
          createdAt: agent.created_at,
          isLatest: true,
        },
      ],
    }

    return NextResponse.json({ agent: transformedAgent }, { status: 201 })
  } catch (error) {
    console.error("Error creating agent:", error)
    return NextResponse.json({ error: "Failed to create agent" }, { status: 500 })
  }
}
