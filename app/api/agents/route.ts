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

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("project_id")

    const agents = await getUserAgents(user.id, projectId || undefined)

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
      createdAt: agent.created_at,
      updatedAt: agent.updated_at,
      // Mock versions for compatibility with existing frontend
      versions: [
        {
          version: "v1.0",
          createdAt: agent.created_at,
          isLatest: true,
        },
      ],
    }))

    return NextResponse.json({ agents: transformedAgents })
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
    } = body

    if (!project_id || !name) {
      return NextResponse.json({ error: "Project ID and agent name are required" }, { status: 400 })
    }

    const agentData = {
      project_id,
      user_id: user.id,
      name,
      description,
      model,
      temperature,
      max_tokens,
      system_instructions,
      prompt,
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
      createdAt: agent.created_at,
      updatedAt: agent.updated_at,
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
