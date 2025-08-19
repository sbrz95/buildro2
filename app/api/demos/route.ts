import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getUserDemos, createDemo } from "@/lib/supabase/projects"

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

    const demos = await getUserDemos(user.id, projectId || undefined)
    return NextResponse.json({ demos })
  } catch (error) {
    console.error("Error fetching demos:", error)
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
    const { project_id, name, description, agent_id, is_public = false, settings = {} } = body

    if (!project_id || !name) {
      return NextResponse.json({ error: "Project ID and demo name are required" }, { status: 400 })
    }

    const demoData = {
      project_id,
      user_id: user.id,
      name,
      description,
      agent_id,
      is_public,
      public_url: is_public ? `${crypto.randomUUID()}` : undefined,
      settings,
    }

    const demo = await createDemo(demoData)

    if (!demo) {
      return NextResponse.json({ error: "Failed to create demo" }, { status: 500 })
    }

    return NextResponse.json({ demo }, { status: 201 })
  } catch (error) {
    console.error("Error creating demo:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
