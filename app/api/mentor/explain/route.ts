import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const messageId = searchParams.get("id")

  if (!messageId) {
    return NextResponse.json({ error: "Message ID required" }, { status: 400 })
  }

  // Mock explanations based on message content patterns
  const explanations: Record<string, string> = {
    "initial-message":
      "Dieser Begrüßungstext wurde so formuliert, um eine freundliche und hilfsbereite Atmosphäre zu schaffen. Die Emojis und die direkte Ansprache fördern das Vertrauen und ermutigen zur Interaktion.",
    default:
      "Diese Antwort basiert auf bewährten AI-Praktiken und berücksichtigt sowohl technische Aspekte als auch Benutzerfreundlichkeit. Die Empfehlungen zielen darauf ab, die Leistung zu optimieren und gleichzeitig Kosten zu kontrollieren.",
  }

  // Generate contextual explanations based on message ID patterns
  let explanation = explanations.default

  if (messageId === "initial-message") {
    explanation = explanations["initial-message"]
  } else if (messageId.includes("assistant")) {
    // Generate different explanations based on common AI mentor topics
    const topics = [
      "Temperatur-Anpassungen helfen dabei, die Kreativität der AI zu steuern. Niedrigere Werte (0.1-0.3) führen zu konsistenteren, vorhersagbareren Antworten, während höhere Werte (0.7-1.0) mehr Variation und Kreativität ermöglichen.",
      "Token-Limits sind wichtig für Kostenkontrolle und Performance. Durch Begrenzung der maximalen Antwortlänge können Sie sowohl die Ausgabekosten reduzieren als auch sicherstellen, dass Antworten prägnant bleiben.",
      "Prompt-Engineering ist entscheidend für gute AI-Ergebnisse. Klare, spezifische Anweisungen mit Beispielen und Kontext führen zu besseren und konsistenteren Antworten.",
      "Modellauswahl beeinflusst sowohl Qualität als auch Kosten. Leichtere Modelle sind schneller und günstiger, während schwerere Modelle komplexere Aufgaben besser bewältigen können.",
      "Guardrails und Sicherheitsregeln schützen vor unerwünschten Ausgaben. Sie definieren Grenzen für das Verhalten der AI und stellen sicher, dass Antworten den gewünschten Standards entsprechen.",
    ]

    explanation = topics[Math.floor(Math.random() * topics.length)]
  }

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json({
    explanation,
    messageId,
    timestamp: new Date().toISOString(),
  })
}
