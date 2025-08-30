import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createServerClient } from "@/lib/supabase/server"
import { domainConfig } from "../../../../lib/config/domain"

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

    const { planId, planName, price, currency, interval } = await request.json()

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: `buildro.ai ${planName}`,
              description: `Monatliches Abonnement für ${planName}`,
            },
            unit_amount: price * 100,
            recurring: {
              interval: interval,
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${domainConfig.APP_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}&plan_id=${planId}`,
      cancel_url: `${domainConfig.APP_URL}/subscribe`,
      metadata: {
        planId,
        planName,
        userId: user.id, // Added user ID to metadata
      },
      customer_email: user.email,
    })

    return NextResponse.json({
      sessionId: session.id,
      checkoutUrl: session.url,
      session: {
        id: session.id,
        url: session.url,
        payment_status: session.payment_status,
        amount_total: session.amount_total,
        currency: session.currency,
        mode: session.mode,
        metadata: session.metadata,
      },
    })
  } catch (error) {
    console.error("Error creating subscription session:", error)
    return NextResponse.json({ error: "Failed to create subscription session" }, { status: 500 })
  }
}
