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

const steps = [
  { title: "Typ wählen", description: "Wähle den Agententyp und grundlegende Einstellungen" },
  { title: "Modell-Settings", description: "Konfiguriere das KI-Modell und API-Einstellungen" },
  { title: "Personality & Wissen", description: "Definiere Persönlichkeit und Wissensbasis" },
  { title: "Review", description: "Überprüfe alle Einstellungen vor der Generierung" },
]

export default function NewBuildPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
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

  const handleGenerate = async () => {
    setIsGenerating(true)
    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsGenerating(false)
    // Redirect to canvas view
    window.location.href = "/build/canvas/new-agent"
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

      <div className="flex items-center space-x-4">
        <div>
          <h1 className="text-3xl font-bold">Neuen Build erstellen</h1>
          <p className="text-muted-foreground">
            Schritt {currentStep + 1} von {steps.length}
          </p>
        </div>
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
              className="bg-gradient-accent hover:bg-gradient-accent/90 text-white hover-scale"
            >
              KI generieren
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
