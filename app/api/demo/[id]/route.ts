import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { updateDemo, deleteDemo } from "@/lib/supabase/projects"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: demo, error } = await supabase
      .from("demos")
      .select("*")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single()

    if (error || !demo) {
      return NextResponse.json({ error: "Demo not found" }, { status: 404 })
    }

    // Transform to expected format
    const transformedDemo = {
      id: demo.id,
      title: demo.name,
      description: demo.description || "",
      agent: demo.agent_id || "default-agent",
      agentVersion: "v1.0",
      type: demo.settings?.type || "Website Widget",
      status: demo.is_public ? "active" : "draft",
      createdAt: demo.created_at,
      brandColor: demo.settings?.brandColor || "#A855F7",
      backgroundColor: demo.settings?.backgroundColor || "#FFFFFF",
      logo: demo.settings?.logo || null,
      welcomeMessage: demo.settings?.welcomeMessage || "Hallo! Wie kann ich Ihnen heute helfen?",
      starterPrompts: demo.settings?.starterPrompts || ["Produktberatung", "Preise anfragen", "Support kontaktieren"],
      placeholder: demo.settings?.placeholder || "Schreiben Sie eine Nachricht...",
      allowUploads: demo.settings?.allowUploads || true,
      noLogging: demo.settings?.noLogging || false,
      anonymizeData: demo.settings?.anonymizeData || true,
    }

    return NextResponse.json({ demo: transformedDemo })
  } catch (error) {
    console.error("Error fetching demo:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Prepare update data
    const updateData: any = {}

    if (body.title) updateData.name = body.title
    if (body.description !== undefined) updateData.description = body.description
    if (body.agent) updateData.agent_id = body.agent
    if (body.status) updateData.is_public = body.status === "active"

    // Update settings
    const currentDemo = await supabase
      .from("demos")
      .select("settings")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single()

    if (currentDemo.data) {
      const currentSettings = currentDemo.data.settings || {}
      const newSettings = {
        ...currentSettings,
        ...Object.fromEntries(
          Object.entries(body).filter(([key]) =>
            [
              "type",
              "brandColor",
              "backgroundColor",
              "logo",
              "welcomeMessage",
              "starterPrompts",
              "placeholder",
              "allowUploads",
              "noLogging",
              "anonymizeData",
            ].includes(key),
          ),
        ),
      }
      updateData.settings = newSettings
    }

    const demo = await updateDemo(params.id, user.id, updateData)

    if (!demo) {
      return NextResponse.json({ error: "Demo not found or access denied" }, { status: 404 })
    }

    // Transform to expected format
    const transformedDemo = {
      id: demo.id,
      title: demo.name,
      description: demo.description || "",
      agent: demo.agent_id || "default-agent",
      agentVersion: "v1.0",
      type: demo.settings?.type || "Website Widget",
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
    }

    return NextResponse.json({ demo: transformedDemo })
  } catch (error) {
    console.error("Error updating demo:", error)
    return NextResponse.json({ error: "Failed to update demo" }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const success = await deleteDemo(params.id, user.id)

    if (!success) {
      return NextResponse.json({ error: "Demo not found or access denied" }, { status: 404 })
    }

    return NextResponse.json({ message: "Demo deleted successfully" })
  } catch (error) {
    console.error("Error deleting demo:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
