"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function ChatCompletionBulkTesterPage() {
  const [formData, setFormData] = useState({
    name: "",
    apiKey: "",
    model: "",
    responseFormat: "text",
    stopSequences: "",
    prompt: "",
    temperature: 0.7,
    maxTokens: 1000,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  })

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData({ ...formData, ...data })
  }

  const handleNext = () => {
    window.location.href = "/bulk-tester/test-settings"
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/bulk-tester">
          <Button variant="ghost" size="icon" className="hover-scale">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Chat Completion Setup</h1>
          <p className="text-muted-foreground">Konfiguriere deine Chat Completion Evaluation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Grundeinstellungen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="z.B. Chat Completion Test"
                value={formData.name}
                onChange={(e) => updateFormData({ name: e.target.value })}
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
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Modell *</Label>
              <Select value={formData.model} onValueChange={(value) => updateFormData({ model: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Modell wählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="response-format">Response Format</Label>
              <Select
                value={formData.responseFormat}
                onValueChange={(value) => updateFormData({ responseFormat: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stop-sequences">Stop-Sequenzen</Label>
              <Input
                id="stop-sequences"
                placeholder="z.B. \n, ###"
                value={formData.stopSequences}
                onChange={(e) => updateFormData({ stopSequences: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prompt">System Prompt</Label>
              <Textarea
                id="prompt"
                placeholder="Definiere das Verhalten des Assistenten..."
                value={formData.prompt}
                onChange={(e) => updateFormData({ prompt: e.target.value })}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Parameter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Temperature: {formData.temperature}</Label>
              <Slider
                value={[formData.temperature]}
                onValueChange={(value) => updateFormData({ temperature: value[0] })}
                max={2}
                min={0}
                step={0.1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">Kreativität (0 = deterministisch, 2 = sehr kreativ)</p>
            </div>

            <div className="space-y-2">
              <Label>Max Tokens: {formData.maxTokens}</Label>
              <Slider
                value={[formData.maxTokens]}
                onValueChange={(value) => updateFormData({ maxTokens: value[0] })}
                max={4000}
                min={100}
                step={100}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">Maximale Antwortlänge</p>
            </div>

            <div className="space-y-2">
              <Label>Top-p: {formData.topP}</Label>
              <Slider
                value={[formData.topP]}
                onValueChange={(value) => updateFormData({ topP: value[0] })}
                max={1}
                min={0}
                step={0.1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">Nucleus Sampling</p>
            </div>

            <div className="space-y-2">
              <Label>Frequency Penalty: {formData.frequencyPenalty}</Label>
              <Slider
                value={[formData.frequencyPenalty]}
                onValueChange={(value) => updateFormData({ frequencyPenalty: value[0] })}
                max={2}
                min={-2}
                step={0.1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">Bestrafung für häufige Wörter</p>
            </div>

            <div className="space-y-2">
              <Label>Presence Penalty: {formData.presencePenalty}</Label>
              <Slider
                value={[formData.presencePenalty]}
                onValueChange={(value) => updateFormData({ presencePenalty: value[0] })}
                max={2}
                min={-2}
                step={0.1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">Bestrafung für wiederholte Themen</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <Link href="/bulk-tester">
          <Button variant="outline" className="hover-scale bg-transparent">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück
          </Button>
        </Link>

        <Button
          onClick={handleNext}
          disabled={!formData.name || !formData.apiKey || !formData.model}
          className="bg-gradient-accent hover:bg-gradient-accent/90 text-white hover-scale"
        >
          Weiter zu Test Settings
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
