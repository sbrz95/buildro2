import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

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

    // Check if user has admin role to upload to marketplace
    const { data: userData, error: userError } = await supabase.from("users").select("role").eq("id", user.id).single()

    if (userError || !userData || !["admin", "super_admin"].includes(userData.role)) {
      return NextResponse.json(
        { error: "Forbidden - Admin access required to upload marketplace agents" },
        { status: 403 },
      )
    }

    const body = await request.json()
    const {
      name,
      description,
      detailed_description,
      price,
      category,
      tags,
      model,
      temperature,
      system_prompt,
      configuration,
      featured = false,
    } = body

    // Validate required fields
    if (!name || !description || !price || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create marketplace agent
    const { data: newAgent, error } = await supabase
      .from("marketplace_agents")
      .insert({
        creator_id: user.id,
        name,
        description,
        detailed_description,
        price: Number.parseFloat(price),
        category,
        tags: tags || [],
        model,
        temperature: temperature ? Number.parseFloat(temperature) : null,
        system_prompt,
        configuration: configuration || {},
        featured,
        status: "approved", // Admins can directly approve their uploads
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating marketplace agent:", error)
      return NextResponse.json({ error: "Failed to create marketplace agent" }, { status: 500 })
    }

    return NextResponse.json({
      message: "Marketplace agent created successfully",
      agent: newAgent,
    })
  } catch (error) {
    console.error("Error in marketplace upload route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
