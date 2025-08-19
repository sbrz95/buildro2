import { type NextRequest, NextResponse } from "next/server"

const mentorResponses = {
  "prompt verbessern": {
    response: `Hier sind meine Top-Tipps für bessere Prompts:

1. **Struktur verwenden**: Teile deinen Prompt in klare Abschnitte auf:
   - Rolle/Kontext
   - Aufgabe
   - Format der Antwort
   - Beispiele (falls nötig)

2. **Spezifisch sein**: Statt "Schreibe einen Text" → "Schreibe einen 200-Wörter Blogpost über..."

3. **Beispiele geben**: Zeige dem Modell, was du erwartest

4. **Constraints setzen**: Definiere Länge, Ton, Format explizit

Möchtest du einen konkreten Prompt mit mir durchgehen?`,
    tips: ["Struktur verwenden", "Spezifisch sein", "Beispiele geben"],
  },
  "kosten senken": {
    response: `So reduzierst du deine AI-Kosten effektiv:

💰 **Sofortige Maßnahmen:**
- Kürzere Prompts verwenden (weniger Input-Tokens)
- Max Tokens begrenzen (z.B. 150 statt 1000)
- Temperature auf 0.1-0.3 senken (weniger "Kreativität")

🎯 **Modell-Optimierung:**
- GPT-4o-mini statt GPT-4o für einfache Aufgaben
- Batch-Processing für mehrere Anfragen
- Caching für wiederkehrende Prompts

📊 **Monitoring:**
- Token-Verbrauch täglich tracken
- Kosten pro Anfrage berechnen
- Alerts bei Überschreitung setzen

Aktuell kostet dich 1000 Tokens etwa $0.002 bei GPT-4o-mini.`,
    tips: ["Kürzere Prompts", "Max Tokens begrenzen", "Günstigeres Modell"],
  },
  "halluzinationen reduzieren": {
    response: `Halluzinationen minimieren - bewährte Strategien:

🎯 **Prompt-Techniken:**
- "Basiere deine Antwort nur auf den gegebenen Informationen"
- "Wenn du dir unsicher bist, sage 'Ich weiß es nicht'"
- Kontext explizit bereitstellen

⚙️ **Parameter-Tuning:**
- Temperature: 0.1-0.3 (statt 0.7-1.0)
- Top-p: 0.9 oder niedriger
- Frequency penalty: 0.1-0.3

🛡️ **Guardrails:**
- Fact-Checking Layer einbauen
- Confidence Scores abfragen
- Quellen-Referenzen verlangen

📝 **Strukturierung:**
- JSON-Output für strukturierte Daten
- Schritt-für-Schritt Reasoning
- Explizite Validierungsschritte

Soll ich dir ein konkretes Beispiel zeigen?`,
    tips: ["Temperature senken", "Guardrails einbauen", "Strukturierte Outputs"],
  },
  "eval-plan erstellen": {
    response: `Evaluation-Plan für deinen AI Agent:

📋 **1. Ziele definieren**
- Was soll der Agent können?
- Welche Metriken sind wichtig? (Accuracy, Latenz, Kosten)
- Success Criteria festlegen

🎯 **2. Test-Dataset erstellen**
- 50-200 repräsentative Beispiele
- Edge Cases einbeziehen
- Ground Truth definieren

⚡ **3. Evaluation-Metriken**
- Automatisch: BLEU, ROUGE, Exact Match
- Human: Relevanz, Hilfsbereitschaft, Ton
- Business: Conversion Rate, User Satisfaction

🔄 **4. Iterationsprozess**
- Baseline etablieren
- A/B Tests durchführen
- Kontinuierliches Monitoring

📊 **5. Reporting**
- Dashboard für Key Metrics
- Wöchentliche Reviews
- Regression Tests

Brauchst du Hilfe bei einem spezifischen Schritt?`,
    tips: ["Test-Dataset erstellen", "Metriken definieren", "A/B Tests"],
  },
}

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json()

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

    const lowerMessage = message.toLowerCase()

    // Find matching response
    let response = mentorResponses["prompt verbessern"] // default

    for (const [key, value] of Object.entries(mentorResponses)) {
      if (lowerMessage.includes(key.toLowerCase())) {
        response = value
        break
      }
    }

    // Generic responses for other queries
    if (!Object.keys(mentorResponses).some((key) => lowerMessage.includes(key.toLowerCase()))) {
      const genericResponses = [
        {
          response: `Das ist eine interessante Frage! Hier sind meine Gedanken dazu:

Basierend auf meiner Erfahrung würde ich empfehlen:
- Schritt für Schritt vorgehen
- Kleine Tests machen bevor du skalierst  
- Die Kosten im Blick behalten
- Regelmäßig evaluieren

Kannst du mir mehr Details zu deinem spezifischen Use Case geben? Dann kann ich dir gezielteren Rat geben.`,
          tips: ["Schrittweise vorgehen", "Klein anfangen", "Kosten beachten"],
        },
        {
          response: `Gute Frage! Lass mich das für dich aufschlüsseln:

🎯 **Mein Ansatz:**
1. Problem genau verstehen
2. Einfache Lösung zuerst testen
3. Iterativ verbessern
4. Metriken definieren und messen

Für deinen Fall würde ich empfehlen, mit einem einfachen Prototyp zu starten und dann basierend auf den Ergebnissen zu optimieren.

Was ist dein konkretes Ziel? Dann kann ich dir spezifischere Tipps geben.`,
          tips: ["Problem verstehen", "Prototyp erstellen", "Iterativ verbessern"],
        },
      ]

      response = genericResponses[Math.floor(Math.random() * genericResponses.length)]
    }

    return NextResponse.json({
      response: response.response,
      tips: response.tips || [],
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Mentor chat error:", error)
    return NextResponse.json({ error: "Mentor-Chat ist momentan nicht verfügbar." }, { status: 500 })
  }
}
