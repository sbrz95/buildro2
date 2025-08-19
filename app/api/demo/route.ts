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

    // Transform database format to expected frontend format
    const transformedDemos = demos.map((demo) => ({
      id: demo.id,
      title: demo.name,
      description: demo.description || "",
      agent: demo.agent_id || "default-agent",
      agentVersion: "v1.0",
      type: demo.settings?.type || "standard-chat",
      status: demo.is_public ? "active" : "draft",
      createdAt: demo.created_at,
      updatedAt: demo.updated_at,
      brandColor: demo.settings?.brandColor || "#A855F7",
      backgroundColor: demo.settings?.backgroundColor || "#FFFFFF",
      logo: demo.settings?.logo || null,
      welcomeMessage: demo.settings?.welcomeMessage || "Hallo! Wie kann ich Ihnen heute helfen?",
      starterPrompts: demo.settings?.starterPrompts || ["Produktberatung", "Preise anfragen", "Support kontaktieren"],
      placeholder: demo.settings?.placeholder || "Schreiben Sie eine Nachricht...",
      allowUploads: demo.settings?.allowUploads || true,
      noLogging: demo.settings?.noLogging || false,
      anonymizeData: demo.settings?.anonymizeData || true,
    }))

    return NextResponse.json({ demos: transformedDemos })
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

    // Create or get default project for demos
    let projectId = body.project_id
    if (!projectId) {
      // Create a default demo project if none exists
      const { data: project } = await supabase
        .from("projects")
        .select("id")
        .eq("user_id", user.id)
        .eq("type", "demo")
        .single()

      if (project) {
        projectId = project.id
      } else {
        const { data: newProject } = await supabase
          .from("projects")
          .insert([
            {
              user_id: user.id,
              name: "Demo Projects",
              type: "demo",
              status: "active",
            },
          ])
          .select("id")
          .single()

        projectId = newProject?.id
      }
    }

    const demoSettings = {
      type: body.type || "standard-chat",
      brandColor: body.primaryColor || "#A855F7",
      backgroundColor: body.backgroundColor || "#FFFFFF",
      logo: body.logo || null,
      welcomeMessage: "Hallo! Wie kann ich Ihnen heute helfen?",
      starterPrompts: ["Produktberatung", "Preise anfragen", "Support kontaktieren"],
      placeholder: "Schreiben Sie eine Nachricht...",
      allowUploads: true,
      noLogging: body.noLogging || false,
      anonymizeData: body.anonymizeData || false,
    }

    const demoData = {
      project_id: projectId,
      user_id: user.id,
      name: body.title || "Neue Demo",
      description: body.description || "",
      agent_id: body.selectedAgent || null,
      is_public: false,
      settings: demoSettings,
    }

    const demo = await createDemo(demoData)

    if (!demo) {
      return NextResponse.json({ error: "Failed to create demo" }, { status: 500 })
    }

    // Transform to expected format
    const transformedDemo = {
      id: demo.id,
      title: demo.name,
      description: demo.description || "",
      agent: demo.agent_id || "default-agent",
      agentVersion: "v1.0",
      type: demo.settings?.type || "standard-chat",
      status: demo.is_public ? "active" : "draft",
      createdAt: demo.created_at,
      updatedAt: demo.updated_at,
      ...demoSettings,
    }

    return NextResponse.json({ demo: transformedDemo }, { status: 201 })
  } catch (error) {
    console.error("Error creating demo:", error)
    return NextResponse.json({ error: "Failed to create demo" }, { status: 400 })
  }
}
