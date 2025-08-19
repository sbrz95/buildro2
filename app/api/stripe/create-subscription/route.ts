import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { planId, planName, price, currency, interval } = await request.json()

    // Mock Stripe subscription session creation
    const sessionId = `cs_sub_${Math.random().toString(36).substr(2, 24)}`

    // In real implementation, this would create actual Stripe subscription session:
    // const session = await stripe.checkout.sessions.create({
    //   payment_method_types: ['card'],
    //   line_items: [{
    //     price_data: {
    //       currency: currency.toLowerCase(),
    //       product_data: {
    //         name: `buildro.ai ${planName}`,
    //         description: `Monatliches Abonnement für ${planName}`,
    //       },
    //       unit_amount: price * 100,
    //       recurring: {
    //         interval: interval,
    //       },
    //     },
    //     quantity: 1,
    //   }],
    //   mode: 'subscription',
    //   success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}&plan_id=${planId}`,
    //   cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscribe`,
    //   metadata: {
    //     planId,
    //     planName,
    //   },
    // })

    // Mock session data
    const mockSession = {
      id: sessionId,
      url: `https://checkout.stripe.com/pay/${sessionId}`,
      payment_status: "unpaid",
      amount_total: price * 100,
      currency: currency.toLowerCase(),
      mode: "subscription",
      metadata: {
        planId,
        planName,
      },
    }

    return NextResponse.json({
      sessionId: sessionId,
      checkoutUrl: mockSession.url,
      session: mockSession,
    })
  } catch (error) {
    console.error("Error creating subscription session:", error)
    return NextResponse.json({ error: "Failed to create subscription session" }, { status: 500 })
  }
}
