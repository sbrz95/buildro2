import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { prompt, goals, context } = await request.json()

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 3000))

    // Mock optimization logic
    let improvedPrompt = prompt
    const improvements = []

    // Apply optimizations based on goals
    if (goals.includes("kürzere Antworten")) {
      improvedPrompt += "\n\nBitte halte deine Antwort unter 100 Wörtern."
      improvements.push("Max. Wortanzahl hinzugefügt")
    }

    if (goals.includes("weniger Kosten")) {
      improvedPrompt = improvedPrompt.replace(/\n\n/g, "\n").trim()
      improvements.push("Überflüssige Leerzeilen entfernt")
    }

    if (goals.includes("mehr Konsistenz")) {
      improvedPrompt += "\n\nVerwende immer das gleiche Format für deine Antworten."
      improvements.push("Konsistenz-Regel hinzugefügt")
    }

    if (goals.includes("besserer Ton/Marke")) {
      improvedPrompt += `\n\nTon: ${context ? `Passend für ${context}` : "Professionell und freundlich"}`
      improvements.push("Ton-Richtlinien spezifiziert")
    }

    // Add structure if missing
    if (!prompt.includes("Du bist") && !prompt.includes("Deine Rolle")) {
      improvedPrompt = `Du bist ein hilfreicher Assistent${context ? ` für ${context}` : ""}.\n\n${improvedPrompt}`
      improvements.push("Rollen-Definition hinzugefügt")
    }

    // Generate diff (simplified)
    const diff = `- ${prompt.split("\n")[0]}
+ ${improvedPrompt.split("\n")[0]}

${improvements.map((imp) => `+ ${imp}`).join("\n")}`

    return NextResponse.json({
      original: prompt,
      improved: improvedPrompt,
      diff: diff,
      improvements:
        improvements.length > 0 ? improvements : ["Struktur verbessert", "Klarheit erhöht", "Konsistenz optimiert"],
    })
  } catch (error) {
    console.error("Prompt optimization error:", error)
    return NextResponse.json({ error: "Optimierung fehlgeschlagen." }, { status: 500 })
  }
}
