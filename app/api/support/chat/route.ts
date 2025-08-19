import { type NextRequest, NextResponse } from "next/server"

const predefinedResponses: Record<string, string> = {
  agent:
    "Du kannst unter *Build → Add Agent* einen neuen erstellen und verbinden. Der 4-stufige Wizard führt dich durch die komplette Konfiguration.",
  verbinden:
    "Du kannst unter *Build → Add Agent* einen neuen erstellen und verbinden. Der 4-stufige Wizard führt dich durch die komplette Konfiguration.",
  support:
    "Du kannst das Ticket-Formular direkt links nutzen. Unser Support-Team antwortet normalerweise innerhalb von 2-4 Stunden.",
  kontakt:
    "Du kannst das Ticket-Formular direkt links nutzen. Unser Support-Team antwortet normalerweise innerhalb von 2-4 Stunden.",
  abo: "Unter *Settings → Billing* findest du die Option für dein Abo. Dort kannst du auch deine Zahlungsmethoden verwalten.",
  billing:
    "Unter *Settings → Billing* findest du die Option für dein Abo. Dort kannst du auch deine Zahlungsmethoden verwalten.",
  demo: "Unter *Demo* kannst du kundenfreundliche Vorschauen erstellen. Wähle einen Agenten, konfiguriere das Branding und teile den Link.",
  bulk: "Die Bulk Test Funktion findest du unter *Bulk Tester*. Dort kannst du mehrere Testszenarien gleichzeitig ausführen.",
  test: "Die Bulk Test Funktion findest du unter *Bulk Tester*. Dort kannst du mehrere Testszenarien gleichzeitig ausführen.",
  dsgvo:
    "buildro.ai ist vollständig DSGVO-konform. In den Einstellungen kannst du deine Datenschutz-Präferenzen verwalten.",
  datenschutz:
    "buildro.ai ist vollständig DSGVO-konform. In den Einstellungen kannst du deine Datenschutz-Präferenzen verwalten.",
  fehler:
    "Bei technischen Problemen erstelle bitte ein Support-Ticket mit Details zum Fehler. Screenshots helfen uns sehr!",
  problem:
    "Bei technischen Problemen erstelle bitte ein Support-Ticket mit Details zum Fehler. Screenshots helfen uns sehr!",
}

const fallbackResponses = [
  "Das ist eine interessante Frage! Schau gerne in unsere FAQ-Sektion oder erstelle ein Support-Ticket für detaillierte Hilfe.",
  "Gerne helfe ich dir dabei. Kannst du mir mehr Details zu deinem Anliegen geben?",
  "Für spezifische Probleme empfehle ich, ein Support-Ticket zu erstellen, damit unser Team dir gezielt helfen kann.",
  "Diese Information findest du in unserer Dokumentation. Soll ich dir den entsprechenden Link geben?",
  "Lass mich dir dabei helfen! Beschreibe dein Problem etwas genauer, dann kann ich dir besser weiterhelfen.",
]

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 })
    }

    const lowerMessage = message.toLowerCase()

    // Find matching predefined response
    let response = ""
    for (const [keyword, reply] of Object.entries(predefinedResponses)) {
      if (lowerMessage.includes(keyword)) {
        response = reply
        break
      }
    }

    // If no match found, use fallback response
    if (!response) {
      response = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
    }

    return NextResponse.json({
      response,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
