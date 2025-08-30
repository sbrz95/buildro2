"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, ArrowRight, Shield, Info } from "lucide-react"
import { BackButton } from "@/components/ui/back-button"
import { useAuth } from "@/contexts/auth-context"

interface Agent {
  id: string
  name: string
  description: string
  model: string
  updated_at: string
}

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
  isPublic: boolean
}

export default function NewDemoPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const { user } = useAuth()

  const [formData, setFormData] = useState<FormData>({
    selectedAgent: "",
    selectedVersion: "v1.0",
    title: "",
    description: "",
    logo: null,
    primaryColor: "#A855F7",
    backgroundColor: "#FFFFFF",
    noLogging: false,
    anonymizeData: false,
    isPublic: true,
  })

  useEffect(() => {
    const fetchAgents = async () => {
      if (!user) return

      try {
        const response = await fetch("/api/agents")
        if (response.ok) {
          const data = await response.json()
          setAgents(data.agents || [])
        }
      } catch (error) {
        console.error("Error fetching agents:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAgents()
  }, [user])

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleCreate = async () => {
    if (!user) return

    setCreating(true)
    try {
      const response = await fetch("/api/demos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.title,
          description: formData.description,
          agentId: formData.selectedAgent,
          isPublic: formData.isPublic,
          settings: {
            primaryColor: formData.primaryColor,
            backgroundColor: formData.backgroundColor,
            noLogging: formData.noLogging,
            anonymizeData: formData.anonymizeData,
          },
        }),
      })

      if (response.ok) {
        const { demo } = await response.json()
        window.location.href = `/demo/${demo.id}`
      } else {
        console.error("Failed to create demo")
      }
    } catch (error) {
      console.error("Error creating demo:", error)
    } finally {
      setCreating(false)
    }
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
            <CardDescription>Wähle den Agenten für deine Demo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="agent">Agent *</Label>
              <Select
                value={formData.selectedAgent}
                onValueChange={(value) => setFormData({ ...formData, selectedAgent: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Agent wählen" />
                </SelectTrigger>
                <SelectContent>
                  {loading ? (
                    <SelectItem value="" disabled>
                      Lade Agenten...
                    </SelectItem>
                  ) : agents.length > 0 ? (
                    agents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        {agent.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      Keine Agenten gefunden
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {formData.selectedAgent && (
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Agent Details</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  {(() => {
                    const selectedAgent = agents.find((a) => a.id === formData.selectedAgent)
                    return selectedAgent ? (
                      <>
                        <p>Name: {selectedAgent.name}</p>
                        <p>Modell: {selectedAgent.model}</p>
                        <p>Zuletzt bearbeitet: {new Date(selectedAgent.updated_at).toLocaleDateString()}</p>
                      </>
                    ) : (
                      <p>Agent nicht gefunden</p>
                    )
                  })()}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Demo-Details</CardTitle>
            <CardDescription>Konfiguriere Titel und Beschreibung</CardDescription>
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
                placeholder="Beschreibe deine Demo"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPublic"
                checked={formData.isPublic}
                onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked as boolean })}
              />
              <Label htmlFor="isPublic" className="text-sm font-medium">
                Demo öffentlich verfügbar machen
              </Label>
            </div>
          </CardContent>
        </Card>
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
          disabled={currentStep === 1 || creating}
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
            disabled={!isStepValid(currentStep) || creating}
            className="bg-gradient-accent hover:bg-gradient-accent/90 text-white hover-scale"
          >
            {creating ? "Erstelle Demo..." : "Demo erstellen"}
          </Button>
        )}
      </div>
    </div>
  )
}
