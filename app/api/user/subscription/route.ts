import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { sessionId, planId } = await request.json()

    // Retrieve the Stripe session to get subscription details
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 })
    }

    // Update user subscription in database
    const { data: updatedUser, error } = await supabase
      .from("users")
      .update({
        subscription_plan: planId,
        subscription_status: "active",
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating user subscription:", error)
      return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 })
    }

    // Create subscription record for tracking
    const subscriptionData = {
      id: sessionId,
      planId: planId,
      planName: planId === "starter" ? "Starter Plan" : "Für AI Experten",
      price: planId === "starter" ? 139 : 69,
      currency: "EUR",
      interval: "month",
      status: "active",
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      customer: {
        email: user.email,
        name: updatedUser.full_name || "User",
      },
    }

    return NextResponse.json({ subscription: subscriptionData })
  } catch (error) {
    console.error("Error processing subscription:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile, error } = await supabase.from("users").select("*").eq("id", user.id).single()

    if (error) {
      console.error("Error fetching user subscription:", error)
      return NextResponse.json({ error: "Failed to fetch subscription" }, { status: 500 })
    }

    return NextResponse.json({
      subscription: {
        plan: profile.subscription_plan,
        status: profile.subscription_status,
        created_at: profile.created_at,
      },
    })
  } catch (error) {
    console.error("Error in subscription route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
