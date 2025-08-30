import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST() {
  try {
    const supabase = createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // In a real app, you would reactivate the Stripe subscription here
    // For now, we'll just update the user's status
    const { data: updatedUser, error } = await supabase
      .from("users")
      .update({
        subscription_status: "active",
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select()
      .single()

    if (error) {
      console.error("Error reactivating subscription:", error)
      return NextResponse.json({ error: "Failed to reactivate subscription" }, { status: 500 })
    }

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error) {
    console.error("Error in reactivate subscription route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
