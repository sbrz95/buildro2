import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()

    // In a real app, you'd get the user ID from the session
    // For demo purposes, we'll use a mock user ID
    const userId = "demo-user-id"

    const { data: purchases, error } = await supabase
      .from("purchases")
      .select(`
        *,
        agents (
          id,
          title,
          image_url,
          category,
          support_email
        )
      `)
      .eq("user_id", userId)
      .eq("status", "completed")
      .order("purchase_date", { ascending: false })

    if (error) {
      console.error("Error fetching purchases:", error)
      return NextResponse.json({ error: "Failed to fetch purchases" }, { status: 500 })
    }

    // Transform data for frontend
    const transformedPurchases =
      purchases?.map((purchase) => ({
        id: purchase.id,
        agentId: purchase.agent_id,
        agentTitle: purchase.agents?.title,
        agentImage: purchase.agents?.image_url,
        price: purchase.amount,
        purchaseDate: purchase.purchase_date,
        status: purchase.status,
        downloadUrl: `/api/marketplace/download/${purchase.agent_id}`,
        receiptUrl: `/api/marketplace/receipt/${purchase.id}`,
      })) || []

    return NextResponse.json({ purchases: transformedPurchases })
  } catch (error) {
    console.error("Error in purchases API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const { agentId, userId, stripeSessionId, amount } = await request.json()

    // Create purchase record
    const { data: purchase, error } = await supabase
      .from("purchases")
      .insert([
        {
          user_id: userId,
          agent_id: agentId,
          stripe_session_id: stripeSessionId,
          amount: amount,
          currency: "EUR",
          status: "completed",
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating purchase:", error)
      return NextResponse.json({ error: "Failed to create purchase" }, { status: 500 })
    }

    // Increment download count for the agent
    await supabase.rpc("increment_download_count", { agent_uuid: agentId })

    return NextResponse.json({ success: true, purchase })
  } catch (error) {
    console.error("Error in purchase creation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
