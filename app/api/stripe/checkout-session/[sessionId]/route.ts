import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

// Mock agent data for demo
const mockAgents = {
  "1": {
    id: "1",
    title: "Customer Support Pro",
    description:
      "Ein fortschrittlicher KI-Agent für professionellen Kundensupport mit Multi-Sprach-Unterstützung und Ticket-Management.",
    price: 1299,
    rating: 4.8,
    image: "/customer-support-robot.png",
    category: "Support",
    supportEmail: "support@buildro.ai",
  },
  "2": {
    id: "2",
    title: "Sales Assistant Elite",
    description:
      "Maximiere deine Verkaufsergebnisse mit diesem intelligenten Sales-Agent, der Leads qualifiziert und Deals abschließt.",
    price: 2499,
    rating: 4.9,
    image: "/sales-robot-assistant.png",
    category: "Sales",
    supportEmail: "support@buildro.ai",
  },
}

export async function GET(request: NextRequest, { params }: { params: { sessionId: string } }) {
  try {
    const { sessionId } = params
    const url = new URL(request.url)
    const agentId = url.searchParams.get("agent_id")

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    // Get agent data
    const agent =
      agentId && mockAgents[agentId as keyof typeof mockAgents]
        ? mockAgents[agentId as keyof typeof mockAgents]
        : mockAgents["1"]

    // Create purchase record (in real app, save to database)
    const purchaseData = {
      session: {
        id: session.id,
        payment_status: session.payment_status,
        amount_total: session.amount_total,
        currency: session.currency,
        customer_details: session.customer_details,
        created: session.created,
        metadata: session.metadata,
      },
      agent: agent,
      purchaseDate: new Date().toISOString(),
      downloadUrl: `/api/marketplace/download/${agent.id}`,
      receiptUrl: `/api/marketplace/receipt/${sessionId}`,
    }

    return NextResponse.json(purchaseData)
  } catch (error) {
    console.error("Error retrieving checkout session:", error)
    return NextResponse.json({ error: "Failed to retrieve checkout session" }, { status: 500 })
  }
}
