import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Scale, Bot, AlertTriangle, CheckCircle } from "lucide-react"

export default function AIActPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold flex items-center justify-center space-x-2">
            <Scale className="h-8 w-8" />
            <span>EU AI Act Compliance</span>
          </h1>
          <p className="text-muted-foreground">buildro.ai - Transparenz bei KI-Systemen</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <span>KI-System Klassifizierung</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Unsere KI-Agenten fallen unter die Kategorie "Allzweck-KI-Systeme" des EU AI Acts. Wir stellen sicher,
              dass alle Systeme transparent und nachvollziehbar sind.
            </p>
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Risikoklasse: Geringes Risiko</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Transparenzpflichten</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc list-inside space-y-2">
              <li>Alle KI-Interaktionen sind klar als solche gekennzeichnet</li>
              <li>Verwendete Modelle und Anbieter werden transparent angezeigt</li>
              <li>Nutzer werden über KI-generierte Inhalte informiert</li>
              <li>Erklärbarkeit der KI-Entscheidungen ist gewährleistet</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Scale className="h-5 w-5" />
              <span>Compliance Maßnahmen</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Wir implementieren alle erforderlichen Schutzmaßnahmen gemäß EU AI Act:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Risikomanagementsystem für KI-Anwendungen</li>
              <li>Qualitätsmanagementsystem</li>
              <li>Dokumentation und Aufzeichnungen</li>
              <li>Menschliche Aufsicht bei kritischen Entscheidungen</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
