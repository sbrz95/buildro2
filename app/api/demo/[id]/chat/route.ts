import { type NextRequest, NextResponse } from "next/server"

const mockResponses = [
  "Das ist eine großartige Frage! Lassen Sie mich Ihnen dabei helfen.",
  "Gerne erkläre ich Ihnen das im Detail. Unsere Lösung bietet...",
  "Vielen Dank für Ihr Interesse! Hier sind die wichtigsten Informationen:",
  "Das kann ich Ihnen beantworten. Basierend auf Ihrer Anfrage empfehle ich...",
  "Perfekt! Ich habe genau die richtige Information für Sie.",
  "Das ist ein wichtiger Punkt. Lassen Sie mich das für Sie klären.",
]

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { message, anonymizeData } = body

    // Simulate processing time
    const processingTime = 800 + Math.random() * 1200 // 0.8-2.0 seconds
    await new Promise((resolve) => setTimeout(resolve, processingTime))

    // Generate mock response
    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)]
    const contextualResponse = `${randomResponse} Bezüglich "${message.substring(0, 50)}${message.length > 50 ? "..." : ""}" kann ich Ihnen folgende Informationen geben: Dies ist eine simulierte Antwort für Demo-Zwecke.`

    // Calculate mock metrics
    const inputTokens = Math.ceil(message.length / 4) // Rough token estimation
    const outputTokens = Math.ceil(contextualResponse.length / 4)
    const totalTokens = inputTokens + outputTokens
    const costPer1kTokens = 0.002 // Mock cost in EUR
    const totalCost = (totalTokens / 1000) * costPer1kTokens

    const response = {
      message: contextualResponse,
      metadata: {
        model: "GPT-4",
        provider: "OpenAI",
        latency: Math.round(processingTime),
        tokens: {
          input: inputTokens,
          output: outputTokens,
          total: totalTokens,
        },
        cost: {
          amount: totalCost,
          currency: "EUR",
          formatted: `€${totalCost.toFixed(4)}`,
        },
        timestamp: new Date().toISOString(),
        demoId: params.id,
        anonymized: anonymizeData || false,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json({ error: "Failed to process chat message" }, { status: 500 })
  }
}
