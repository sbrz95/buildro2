"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { StepOne } from "@/components/build-wizard/step-one"
import { StepTwo } from "@/components/build-wizard/step-two"
import { StepThree } from "@/components/build-wizard/step-three"
import { StepFour } from "@/components/build-wizard/step-four"
import { LoadingOverlay } from "@/components/build-wizard/loading-overlay"
import { BackButton } from "@/components/ui/back-button"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

const steps = [
  { title: "Typ wählen", description: "Wähle den Agententyp und grundlegende Einstellungen" },
  { title: "Modell-Settings", description: "Konfiguriere das KI-Modell und API-Einstellungen" },
  { title: "Personality & Wissen", description: "Definiere Persönlichkeit und Wissensbasis" },
  { title: "Review", description: "Überprüfe alle Einstellungen vor der Generierung" },
]

export default function NewBuildPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { user } = useAuth()
  const router = useRouter()
  const [buildData, setBuildData] = useState({
    type: "",
    name: "",
    industry: "",
    language: "Deutsch",
    model: "",
    apiKey: "",
    temperature: 0.7,
    topP: 0.9,
    description: "",
    rules: "",
    flow: "",
    companyInfo: "",
  })

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const saveAgent = async () => {
    if (!user) {
      console.error("User not authenticated")
      return null
    }

    setIsSaving(true)
    try {
      const agentData = {
        name: buildData.name || `${buildData.type} Agent`,
        description: buildData.description || `Ein ${buildData.type} Agent für ${buildData.industry}`,
        model: buildData.model || "gpt-4",
        temperature: buildData.temperature,
        top_p: buildData.topP,
        system_prompt: `Du bist ein ${buildData.type} Agent für ${buildData.industry}. 
        
Persönlichkeit und Verhalten:
${buildData.rules}

Arbeitsablauf:
${buildData.flow}

Firmeninformationen:
${buildData.companyInfo}

Antworte immer auf ${buildData.language}.`,
        user_id: user.id,
        status: "active",
        settings: {
          type: buildData.type,
          industry: buildData.industry,
          language: buildData.language,
          apiKey: buildData.apiKey,
          rules: buildData.rules,
          flow: buildData.flow,
          companyInfo: buildData.companyInfo,
        },
      }

      const response = await fetch("/api/agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(agentData),
      })

      if (!response.ok) {
        throw new Error("Failed to save agent")
      }

      const result = await response.json()
      return result.agent
    } catch (error) {
      console.error("Error saving agent:", error)
      return null
    } finally {
      setIsSaving(false)
    }
  }

  const handleGenerate = async () => {
    setIsGenerating(true)

    try {
      const savedAgent = await saveAgent()

      if (savedAgent) {
        // Simulate AI generation
        await new Promise((resolve) => setTimeout(resolve, 3000))

        // Redirect to the saved agent's canvas view
        router.push(`/build/canvas/${savedAgent.id}`)
      } else {
        console.error("Failed to save agent")
        setIsGenerating(false)
      }
    } catch (error) {
      console.error("Error during generation:", error)
      setIsGenerating(false)
    }
  }

  const handleSaveDraft = async () => {
    const savedAgent = await saveAgent()
    if (savedAgent) {
      router.push("/build")
    }
  }

  const updateBuildData = (data: Partial<typeof buildData>) => {
    setBuildData({ ...buildData, ...data })
  }

  if (isGenerating) {
    return <LoadingOverlay />
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <BackButton href="/build" />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Neuen Build erstellen</h1>
          <p className="text-muted-foreground">
            Schritt {currentStep + 1} von {steps.length}
          </p>
        </div>
        {buildData.name && (
          <Button variant="outline" onClick={handleSaveDraft} disabled={isSaving} className="bg-transparent">
            {isSaving ? "Speichert..." : "Als Entwurf speichern"}
          </Button>
        )}
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{steps[currentStep].title}</span>
            <span className="text-muted-foreground">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
          </div>
          <Progress value={((currentStep + 1) / steps.length) * 100} className="h-2" />
          <p className="text-sm text-muted-foreground">{steps[currentStep].description}</p>
        </div>

        <Card>
          <CardContent className="p-8">
            {currentStep === 0 && <StepOne data={buildData} updateData={updateBuildData} />}
            {currentStep === 1 && <StepTwo data={buildData} updateData={updateBuildData} />}
            {currentStep === 2 && <StepThree data={buildData} updateData={updateBuildData} />}
            {currentStep === 3 && <StepFour data={buildData} onGenerate={handleGenerate} />}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="hover-scale bg-transparent"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button
              onClick={handleNext}
              className="bg-gradient-accent hover:bg-gradient-accent/90 text-white hover-scale"
            >
              Weiter
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || isSaving}
              className="bg-gradient-accent hover:bg-gradient-accent/90 text-white hover-scale"
            >
              {isGenerating ? "Generiert..." : "KI generieren"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
