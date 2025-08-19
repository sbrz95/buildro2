import { type NextRequest, NextResponse } from "next/server"

// Mock agent data for demo
const mockAgents = {
  "1": {
    id: "1",
    title: "Customer Support Pro",
    description:
      "Ein fortschrittlicher KI-Agent für professionellen Kundensupport mit Multi-Sprach-Unterstützung und Ticket-Management.",
    price: 29.99,
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
    price: 49.99,
    rating: 4.9,
    image: "/sales-robot-assistant.png",
    category: "Sales",
    supportEmail: "support@buildro.ai",
  },
  // Add other agents as needed
}

export async function GET(request: NextRequest, { params }: { params: { sessionId: string } }) {
  try {
    const { sessionId } = params
    const url = new URL(request.url)
    const agentId = url.searchParams.get("agent_id")

    // In real implementation, retrieve session from Stripe:
    // const session = await stripe.checkout.sessions.retrieve(sessionId)

    // Mock session data
    const mockSession = {
      id: sessionId,
      payment_status: "paid",
      amount_total:
        agentId && mockAgents[agentId as keyof typeof mockAgents]
          ? Math.round(mockAgents[agentId as keyof typeof mockAgents].price * 100)
          : 2999,
      currency: "eur",
      customer_details: {
        email: "customer@example.com",
        name: "Max Mustermann",
      },
      created: Math.floor(Date.now() / 1000),
      metadata: {
        agentId: agentId || "1",
      },
    }

    // Get agent data
    const agent =
      agentId && mockAgents[agentId as keyof typeof mockAgents]
        ? mockAgents[agentId as keyof typeof mockAgents]
        : mockAgents["1"]

    // Create purchase record (in real app, save to database)
    const purchaseData = {
      session: mockSession,
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
