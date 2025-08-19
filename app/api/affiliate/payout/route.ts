import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const body = await request.json()

  // Mock payout request processing
  const payoutRequest = {
    id: Math.random().toString(36).substr(2, 9),
    amount: body.amount,
    status: "pending",
    requestDate: new Date().toISOString(),
    estimatedProcessingTime: "3-5 Werktage",
  }

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return NextResponse.json({
    success: true,
    message: "Auszahlungsanfrage erfolgreich eingereicht",
    payoutRequest,
  })
}
