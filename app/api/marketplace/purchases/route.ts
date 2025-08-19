import { NextResponse } from "next/server"

export async function GET() {
  // Mock purchase data for demo
  const mockPurchases = [
    {
      id: "purchase_1",
      agentId: "1",
      agentTitle: "Customer Support Pro",
      agentImage: "/customer-support-robot.png",
      price: 29.99,
      purchaseDate: new Date().toISOString(),
      status: "completed" as const,
      downloadUrl: "/api/marketplace/download/1",
      receiptUrl: "/api/marketplace/receipt/purchase_1",
    },
    {
      id: "purchase_2",
      agentId: "2",
      agentTitle: "Sales Assistant Elite",
      agentImage: "/sales-robot-assistant.png",
      price: 49.99,
      purchaseDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      status: "completed" as const,
      downloadUrl: "/api/marketplace/download/2",
      receiptUrl: "/api/marketplace/receipt/purchase_2",
    },
  ]

  return NextResponse.json({ purchases: mockPurchases })
}
