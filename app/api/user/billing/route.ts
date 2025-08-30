import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

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

    // Get user profile with subscription info
    const { data: profile, error: profileError } = await supabase.from("users").select("*").eq("id", user.id).single()

    if (profileError) {
      console.error("Error fetching profile:", profileError)
      return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
    }

    // Get usage statistics
    const [agentsResult, demosResult, bulkTestsResult] = await Promise.all([
      supabase.from("agents").select("id").eq("user_id", user.id),
      supabase.from("demos").select("id").eq("user_id", user.id),
      supabase.from("bulk_tests").select("id").eq("user_id", user.id),
    ])

    // Calculate limits based on subscription plan
    const getLimits = (plan: string) => {
      switch (plan) {
        case "starter":
          return { agents: 10, bulk_tests: 50, demos: 5 }
        case "pro":
          return { agents: -1, bulk_tests: -1, demos: -1 } // -1 means unlimited
        case "custom":
          return { agents: -1, bulk_tests: -1, demos: -1 }
        default:
          return { agents: 3, bulk_tests: 10, demos: 2 } // Free tier
      }
    }

    const limits = getLimits(profile.subscription_plan)

    // Mock billing data (in real app, this would come from Stripe)
    const billingData = {
      subscription: {
        plan: profile.subscription_plan,
        status: profile.subscription_status || "active",
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        cancel_at_period_end: false,
        price: profile.subscription_plan === "starter" ? 139 : profile.subscription_plan === "pro" ? 69 : 0,
        currency: "EUR",
      },
      usage: {
        agents_created: agentsResult.data?.length || 0,
        agents_limit: limits.agents,
        bulk_tests_run: bulkTestsResult.data?.length || 0,
        bulk_tests_limit: limits.bulk_tests,
        demos_created: demosResult.data?.length || 0,
        demos_limit: limits.demos,
      },
      invoices: [
        {
          id: "inv_1",
          amount: profile.subscription_plan === "starter" ? 139 : 69,
          currency: "EUR",
          status: "paid",
          created: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          invoice_pdf: "/api/invoices/inv_1.pdf",
        },
      ],
    }

    return NextResponse.json(billingData)
  } catch (error) {
    console.error("Error in billing route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
