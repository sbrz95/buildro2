"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { BackButton } from "@/components/ui/back-button"

export default function AssistantBulkTesterPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    evaluationName: "",
    apiKey: "",
    selectedBuild: "",
  })

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1)
    } else {
      // Navigate to test settings
      window.location.href = "/bulk-tester/test-settings"
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData({ ...formData, ...data })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <BackButton href="/bulk-tester" />

      <div className="flex items-center space-x-4">
        <div>
          <h1 className="text-3xl font-bold">OpenAI Assistant Evaluation</h1>
          <p className="text-muted-foreground">Schritt {currentStep} von 2</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{currentStep === 1 ? "Evaluation Setup" : "Build auswählen"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStep === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="evaluation-name">Evaluation Name *</Label>
                <Input
                  id="evaluation-name"
                  placeholder="z.B. Sales Agent Test v1.0"
                  value={formData.evaluationName}
                  onChange={(e) => updateFormData({ evaluationName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="api-key">API-Key *</Label>
                <Select value={formData.apiKey} onValueChange={(value) => updateFormData({ apiKey: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="API-Key wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Standard OpenAI Key</SelectItem>
                    <SelectItem value="custom-1">Eigener Key #1</SelectItem>
                    <SelectItem value="custom-2">Eigener Key #2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="build-select">Build auswählen *</Label>
                <Select
                  value={formData.selectedBuild}
                  onValueChange={(value) => updateFormData({ selectedBuild: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Build wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales-agent">Sales Agent</SelectItem>
                    <SelectItem value="support-bot">Support Bot</SelectItem>
                    <SelectItem value="custom-agent">Custom Agent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Build Details</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Typ: Sales Agent</p>
                  <p>Modell: GPT-4</p>
                  <p>Zuletzt bearbeitet: vor 2 Stunden</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

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

        <Button
          onClick={handleNext}
          disabled={
            (currentStep === 1 && (!formData.evaluationName || !formData.apiKey)) ||
            (currentStep === 2 && !formData.selectedBuild)
          }
          className="bg-gradient-accent hover:bg-gradient-accent/90 text-white hover-scale"
        >
          {currentStep === 2 ? "Weiter zu Test Settings" : "Weiter"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
