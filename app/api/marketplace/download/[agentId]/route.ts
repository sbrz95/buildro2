import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { agentId: string } }) {
  try {
    const supabase = createServerSupabaseClient()
    const { agentId } = params

    // In a real app, you'd get the user ID from the session
    const userId = "demo-user-id"

    // Verify user has purchased this agent
    const { data: purchase, error: purchaseError } = await supabase
      .from("purchases")
      .select("*, agents(download_link, title)")
      .eq("user_id", userId)
      .eq("agent_id", agentId)
      .eq("status", "completed")
      .single()

    if (purchaseError || !purchase) {
      return NextResponse.json({ error: "Purchase not found or not authorized" }, { status: 404 })
    }

    // Log the download
    await supabase.from("download_logs").insert([
      {
        purchase_id: purchase.id,
        user_id: userId,
        agent_id: agentId,
        ip_address: request.ip,
        user_agent: request.headers.get("user-agent"),
      },
    ])

    // Update download count in purchases
    await supabase
      .from("purchases")
      .update({
        download_count: purchase.download_count + 1,
        last_downloaded_at: new Date().toISOString(),
      })
      .eq("id", purchase.id)

    // In a real implementation, you would:
    // 1. Generate a signed URL for the actual file
    // 2. Or redirect to a secure download endpoint
    // 3. Or return the file content directly

    return NextResponse.json({
      success: true,
      downloadUrl: purchase.agents?.download_link,
      agentTitle: purchase.agents?.title,
      message: "Download authorized",
    })
  } catch (error) {
    console.error("Error in download API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
