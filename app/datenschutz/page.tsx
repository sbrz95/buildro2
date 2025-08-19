import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, Database, Lock } from "lucide-react"
import { BackButton } from "@/components/ui/back-button"

export default function DatenschutzPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <BackButton />

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold flex items-center justify-center space-x-2">
            <Shield className="h-8 w-8" />
            <span>Datenschutzerklärung</span>
          </h1>
          <p className="text-muted-foreground">buildro.ai - Ihre Privatsphäre ist uns wichtig</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>Datenverarbeitung</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Wir verarbeiten Ihre Daten ausschließlich zu Demonstrationszwecken und zur Verbesserung unserer
              KI-Agenten. Alle Testeingaben werden nur temporär gespeichert und können jederzeit gelöscht werden.
            </p>
            <p>
              Sie haben jederzeit die Kontrolle über Ihre Daten und können das Logging in den Einstellungen
              deaktivieren.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Ihre Rechte</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc list-inside space-y-2">
              <li>Recht auf Auskunft über gespeicherte Daten</li>
              <li>Recht auf Berichtigung unrichtiger Daten</li>
              <li>Recht auf Löschung Ihrer Daten</li>
              <li>Recht auf Einschränkung der Verarbeitung</li>
              <li>Recht auf Datenübertragbarkeit</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="h-5 w-5" />
              <span>Kontakt</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Bei Fragen zum Datenschutz kontaktieren Sie uns unter:
              <br />
              <strong>datenschutz@buildro.ai</strong>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
