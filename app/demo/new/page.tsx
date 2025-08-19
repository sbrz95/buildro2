"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Upload, Shield, Info } from "lucide-react"
import { BackButton } from "@/components/ui/back-button"

interface FormData {
  // Step 1
  selectedAgent: string
  selectedVersion: string

  // Step 2
  title: string
  description: string
  logo: File | null
  primaryColor: string
  backgroundColor: string

  // Step 3
  noLogging: boolean
  anonymizeData: boolean
}

export default function NewDemoPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    selectedAgent: "",
    selectedVersion: "",
    title: "",
    description: "",
    logo: null,
    primaryColor: "#A855F7",
    backgroundColor: "#FFFFFF",
    noLogging: false,
    anonymizeData: false,
  })

  const agents = [
    { id: "sales-agent", name: "Sales Agent", versions: ["v1.0", "v1.1", "v1.2"] },
    { id: "support-bot", name: "Support Bot", versions: ["v2.0", "v2.1"] },
    { id: "custom-agent", name: "Custom Agent", versions: ["v1.0"] },
  ]

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleCreate = () => {
    // Create demo with all form data
    const demoId = `demo-${Date.now()}`
    console.log("Creating demo with data:", formData)
    window.location.href = `/demo/${demoId}`
  }

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.selectedAgent && formData.selectedVersion
      case 2:
        return formData.title.trim().length > 0
      case 3:
        return true // Privacy step is always valid (checkboxes are optional)
      default:
        return false
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <BackButton href="/demo" />

      <div className="flex items-center space-x-4">
        <div>
          <h1 className="text-3xl font-bold">Neue Demo erstellen</h1>
          <p className="text-muted-foreground">Schritt {currentStep} von 3</p>
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === currentStep
                  ? "bg-gradient-accent text-white"
                  : step < currentStep
                    ? "bg-green-500 text-white"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {step}
            </div>
            {step < 3 && <div className={`w-16 h-0.5 mx-2 ${step < currentStep ? "bg-green-500" : "bg-muted"}`} />}
          </div>
        ))}
      </div>

      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Agent auswählen</CardTitle>
            <CardDescription>Wähle den Agenten und die Version für deine Demo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="agent">Agent *</Label>
                <Select
                  value={formData.selectedAgent}
                  onValueChange={(value) => setFormData({ ...formData, selectedAgent: value, selectedVersion: "" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Agent wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {agents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        {agent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="version">Version *</Label>
                <Select
                  value={formData.selectedVersion}
                  onValueChange={(value) => setFormData({ ...formData, selectedVersion: value })}
                  disabled={!formData.selectedAgent}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Version wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.selectedAgent &&
                      agents
                        .find((a) => a.id === formData.selectedAgent)
                        ?.versions.map((version) => (
                          <SelectItem key={version} value={version}>
                            {version}
                            {version === agents.find((a) => a.id === formData.selectedAgent)?.versions.slice(-1)[0] && (
                              <Badge variant="secondary" className="ml-2">
                                Latest
                              </Badge>
                            )}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Demo-Details</CardTitle>
              <CardDescription>Konfiguriere Titel, Beschreibung und Branding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titel *</Label>
                <Input
                  id="title"
                  placeholder="z.B. Sales Demo v1.0"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Beschreibung</Label>
                <Textarea
                  id="description"
                  placeholder="Beschreibe deine Demo (Markdown unterstützt)"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">Markdown-Formatierung wird unterstützt</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Branding-Optionen</CardTitle>
              <CardDescription>Passe das Erscheinungsbild deiner Demo an</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Logo hochladen</Label>
                <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Klicke hier oder ziehe eine Datei hinein</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG bis 2MB</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primärfarbe</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      id="primaryColor"
                      value={formData.primaryColor}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="w-12 h-10 rounded border"
                    />
                    <Input
                      value={formData.primaryColor}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      placeholder="#A855F7"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backgroundColor">Hintergrundfarbe</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      id="backgroundColor"
                      value={formData.backgroundColor}
                      onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                      className="w-12 h-10 rounded border"
                    />
                    <Input
                      value={formData.backgroundColor}
                      onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Datenschutz
            </CardTitle>
            <CardDescription>DSGVO-konforme Einstellungen für deine Demo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="noLogging"
                  checked={formData.noLogging}
                  onCheckedChange={(checked) => setFormData({ ...formData, noLogging: checked as boolean })}
                />
                <div className="space-y-1">
                  <Label htmlFor="noLogging" className="text-sm font-medium">
                    Kein Logging aktivieren
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Gespräche werden nicht gespeichert oder analysiert (Opt-out)
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="anonymizeData"
                  checked={formData.anonymizeData}
                  onCheckedChange={(checked) => setFormData({ ...formData, anonymizeData: checked as boolean })}
                />
                <div className="space-y-1">
                  <Label htmlFor="anonymizeData" className="text-sm font-medium">
                    Testdaten anonymisieren
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Alle Benutzereingaben werden vor der Verarbeitung anonymisiert
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">DSGVO & AI Act Konformität</h4>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Diese Demo erfüllt alle Anforderungen der DSGVO und des EU AI Acts. Benutzer werden über die
                    Datenverarbeitung informiert und können ihre Einwilligung jederzeit widerrufen.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
          className="hover-scale bg-transparent"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zurück
        </Button>

        {currentStep < 3 ? (
          <Button
            onClick={handleNext}
            disabled={!isStepValid(currentStep)}
            className="bg-gradient-accent hover:bg-gradient-accent/90 text-white hover-scale"
          >
            Weiter
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleCreate}
            disabled={!isStepValid(currentStep)}
            className="bg-gradient-accent hover:bg-gradient-accent/90 text-white hover-scale"
          >
            Demo erstellen
          </Button>
        )}
      </div>
    </div>
  )
}
