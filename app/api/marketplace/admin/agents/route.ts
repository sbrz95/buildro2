import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const { data: userData, error: userError } = await supabase.from("users").select("role").eq("id", user.id).single()

    if (userError || !userData || !["admin", "super_admin"].includes(userData.role)) {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
    }

    // Get all marketplace agents for admin review
    const { data: agents, error } = await supabase
      .from("marketplace_agents")
      .select(`
        *,
        creator:users!creator_id(name, email),
        approver:users!approved_by(name)
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching marketplace agents:", error)
      return NextResponse.json({ error: "Failed to fetch agents" }, { status: 500 })
    }

    return NextResponse.json({ agents })
  } catch (error) {
    console.error("Error in marketplace admin agents route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const { data: userData, error: userError } = await supabase.from("users").select("role").eq("id", user.id).single()

    if (userError || !userData || !["admin", "super_admin"].includes(userData.role)) {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
    }

    const body = await request.json()
    const { agentId, action, reason } = body

    if (!agentId || !action || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
    }

    // Update agent status
    const updateData: any = {
      status: action === "approve" ? "approved" : "rejected",
      approved_by: user.id,
      approved_at: new Date().toISOString(),
    }

    if (reason) {
      updateData.rejection_reason = reason
    }

    const { data: updatedAgent, error } = await supabase
      .from("marketplace_agents")
      .update(updateData)
      .eq("id", agentId)
      .select()
      .single()

    if (error) {
      console.error("Error updating marketplace agent:", error)
      return NextResponse.json({ error: "Failed to update agent" }, { status: 500 })
    }

    return NextResponse.json({
      message: `Agent ${action}d successfully`,
      agent: updatedAgent,
    })
  } catch (error) {
    console.error("Error in marketplace admin agents route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
