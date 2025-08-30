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

    const { agentId, agentTitle, price, image } = await request.json()

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: agentTitle,
              images: image ? [image] : [],
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${domainConfig.APP_URL}/marketplace/checkout/success?session_id={CHECKOUT_SESSION_ID}&agent_id=${agentId}`,
      cancel_url: `${domainConfig.APP_URL}/marketplace`,
      metadata: {
        agentId,
        agentTitle,
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
        metadata: session.metadata,
      },
    })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
