import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { agentId, agentTitle, price, image } = await request.json()

    // Mock Stripe session creation
    const sessionId = `cs_test_${Math.random().toString(36).substr(2, 24)}`

    // In real implementation, this would create actual Stripe session:
    // const session = await stripe.checkout.sessions.create({
    //   payment_method_types: ['card'],
    //   line_items: [{
    //     price_data: {
    //       currency: 'eur',
    //       product_data: {
    //         name: agentTitle,
    //         images: [image],
    //       },
    //       unit_amount: Math.round(price * 100),
    //     },
    //     quantity: 1,
    //   }],
    //   mode: 'payment',
    //   success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/marketplace/checkout/success?session_id={CHECKOUT_SESSION_ID}&agent_id=${agentId}`,
    //   cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/marketplace`,
    // })

    // Mock session data
    const mockSession = {
      id: sessionId,
      url: `https://checkout.stripe.com/pay/${sessionId}`,
      payment_status: "unpaid",
      amount_total: Math.round(price * 100),
      currency: "eur",
      customer_details: null,
      metadata: {
        agentId,
        agentTitle,
      },
    }

    // Store session for later retrieval (in real app, this would be in database)
    // For demo, we'll just return the session info

    return NextResponse.json({
      sessionId: sessionId,
      checkoutUrl: mockSession.url,
      session: mockSession,
    })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
