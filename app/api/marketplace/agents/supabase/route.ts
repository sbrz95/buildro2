import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const { searchParams } = new URL(request.url)

    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const sortBy = searchParams.get("sortBy") || "downloads"
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const minRating = searchParams.get("minRating")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const offset = (page - 1) * limit

    let query = supabase.from("agents").select("*").eq("status", "approved")

    // Apply filters
    if (category && category !== "all") {
      query = query.eq("category", category)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,category.ilike.%${search}%`)
    }

    if (minPrice) {
      query = query.gte("price", Number.parseFloat(minPrice))
    }

    if (maxPrice) {
      query = query.lte("price", Number.parseFloat(maxPrice))
    }

    if (minRating) {
      query = query.gte("rating", Number.parseFloat(minRating))
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        query = query.order("price", { ascending: true })
        break
      case "price-high":
        query = query.order("price", { ascending: false })
        break
      case "rating":
        query = query.order("rating", { ascending: false })
        break
      case "newest":
        query = query.order("created_at", { ascending: false })
        break
      case "downloads":
      default:
        query = query.order("downloads", { ascending: false })
        break
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data: agents, error, count } = await query

    if (error) {
      console.error("Error fetching agents:", error)
      return NextResponse.json({ error: "Failed to fetch agents" }, { status: 500 })
    }

    // Get total count for pagination
    const { count: totalCount } = await supabase
      .from("agents")
      .select("*", { count: "exact", head: true })
      .eq("status", "approved")

    return NextResponse.json({
      agents: agents || [],
      pagination: {
        page,
        limit,
        total: totalCount || 0,
        totalPages: Math.ceil((totalCount || 0) / limit),
      },
    })
  } catch (error) {
    console.error("Error in agents API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const agentData = await request.json()

    // Validate required fields
    const requiredFields = ["title", "description", "price", "category", "features", "download_link", "support_email"]
    const missingFields = requiredFields.filter((field) => !agentData[field])

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          fields: missingFields,
        },
        { status: 400 },
      )
    }

    // Insert new agent
    const { data: agent, error } = await supabase
      .from("agents")
      .insert([
        {
          title: agentData.title,
          description: agentData.description,
          price: Number.parseFloat(agentData.price),
          image_url: agentData.image,
          category: agentData.category,
          features: agentData.features.split(",").map((f: string) => f.trim()),
          tags: agentData.tags ? agentData.tags.split(",").map((t: string) => t.trim()) : [],
          documentation: agentData.documentation,
          api_access: agentData.apiAccess,
          download_link: agentData.downloadLink,
          requirements: agentData.requirements,
          support_email: agentData.supportEmail,
          version: agentData.version || "1.0.0",
          status: "pending",
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating agent:", error)
      return NextResponse.json({ error: "Failed to create agent" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      agent,
      message: "Agent erfolgreich hochgeladen und wird überprüft",
    })
  } catch (error) {
    console.error("Error in agent creation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
