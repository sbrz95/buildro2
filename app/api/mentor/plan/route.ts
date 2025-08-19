import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { goal, tokensPerDay, provider } = await request.json()

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 2000))

    // Mock model recommendations based on inputs
    const models = {
      openai: {
        cheap: { name: "gpt-4o-mini", costPer1k: 0.0015, latency: 300 },
        balanced: { name: "gpt-4o", costPer1k: 0.03, latency: 800 },
        quality: { name: "gpt-4o", costPer1k: 0.03, latency: 800 },
      },
      anthropic: {
        cheap: { name: "claude-3-haiku", costPer1k: 0.0025, latency: 400 },
        balanced: { name: "claude-3-sonnet", costPer1k: 0.015, latency: 600 },
        quality: { name: "claude-3-opus", costPer1k: 0.075, latency: 1200 },
      },
      mistral: {
        cheap: { name: "mistral-7b", costPer1k: 0.001, latency: 250 },
        balanced: { name: "mistral-medium", costPer1k: 0.01, latency: 500 },
        quality: { name: "mistral-large", costPer1k: 0.02, latency: 700 },
      },
    }

    const goalMapping = {
      cost: "cheap",
      quality: "quality",
      latency: "cheap",
      balance: "balanced",
    }

    const selectedModel = models[provider as keyof typeof models][goalMapping[goal as keyof typeof goalMapping]]
    const monthlyTokens = tokensPerDay * 30
    const monthlyCost = (monthlyTokens / 1000) * selectedModel.costPer1k

    // Generate alternatives
    const alternatives = []

    if (goal !== "cost") {
      const cheapModel = models[provider as keyof typeof models].cheap
      alternatives.push({
        model: cheapModel.name,
        monthlyUSD: (monthlyTokens / 1000) * cheapModel.costPer1k,
        reason: "Günstigere Alternative mit etwas weniger Qualität",
      })
    }

    if (goal !== "quality") {
      const qualityModel = models[provider as keyof typeof models].quality
      alternatives.push({
        model: qualityModel.name,
        monthlyUSD: (monthlyTokens / 1000) * qualityModel.costPer1k,
        reason: "Höhere Qualität für kritische Anwendungen",
      })
    }

    // Add cross-provider alternatives
    if (provider !== "openai") {
      alternatives.push({
        model: "gpt-4o-mini",
        monthlyUSD: (monthlyTokens / 1000) * 0.0015,
        reason: "OpenAI Alternative - sehr günstig und schnell",
      })
    }

    return NextResponse.json({
      model: selectedModel.name,
      monthlyUSD: monthlyCost,
      latencyMs: selectedModel.latency,
      alternatives: alternatives.slice(0, 3), // Limit to 3 alternatives
      tokensPerMonth: monthlyTokens,
      recommendation:
        goal === "cost"
          ? "Fokus auf niedrige Kosten - ideal für hohe Volumina"
          : goal === "quality"
            ? "Beste Qualität - empfohlen für kritische Anwendungen"
            : goal === "latency"
              ? "Schnellste Antwortzeiten - gut für Echtzeit-Apps"
              : "Ausgewogenes Verhältnis von Kosten, Qualität und Geschwindigkeit",
    })
  } catch (error) {
    console.error("Model recommendation error:", error)
    return NextResponse.json({ error: "Empfehlung konnte nicht berechnet werden." }, { status: 500 })
  }
}
