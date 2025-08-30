"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowLeft, Plus, Trash2, Sparkles, Play } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { useAuth } from "@/contexts/auth-context"

export default function TestSettingsPage() {
  const [testQuestions, setTestQuestions] = useState([
    "Wie kann ich meine Verkaufszahlen steigern?",
    "Was sind die besten Strategien für Kundenbindung?",
  ])
  const [newQuestion, setNewQuestion] = useState("")
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false)
  const [generateSettings, setGenerateSettings] = useState({
    count: 5,
    tone: "professional",
    domain: "sales",
  })
  const [testId, setTestId] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get("testId")
    setTestId(id)
  }, [])

  const addQuestion = () => {
    if (newQuestion.trim()) {
      setTestQuestions([...testQuestions, newQuestion.trim()])
      setNewQuestion("")
    }
  }

  const removeQuestion = (index: number) => {
    setTestQuestions(testQuestions.filter((_, i) => i !== index))
  }

  const generateQuestions = () => {
    // Simulate AI generation
    const generatedQuestions = [
      "Wie identifiziere ich qualifizierte Leads?",
      "Welche Verkaufstechniken sind am effektivsten?",
      "Wie gehe ich mit Einwänden um?",
      "Was ist der beste Zeitpunkt für Follow-ups?",
      "Wie kann ich meine Conversion-Rate verbessern?",
    ]
    setTestQuestions([...testQuestions, ...generatedQuestions.slice(0, generateSettings.count)])
    setIsGenerateModalOpen(false)
  }

  const startEvaluation = async () => {
    if (!testId || !user) return

    try {
      // Update bulk test with questions and configuration
      const response = await fetch(`/api/bulk-tests/${testId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          test_data: testQuestions,
          status: "running",
        }),
      })

      if (response.ok) {
        window.location.href = `/bulk-tester/run/${testId}`
      } else {
        console.error("Failed to update bulk test")
      }
    } catch (error) {
      console.error("Error starting evaluation:", error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="hover-scale" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Test Settings</h1>
          <p className="text-muted-foreground">Konfiguriere deine Evaluation und Testfragen</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Test-Konfiguration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="template">Template</Label>
              <Select defaultValue="sales">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales Template</SelectItem>
                  <SelectItem value="support">Support Template</SelectItem>
                  <SelectItem value="custom">Custom Template</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Modell</Label>
              <Select defaultValue="gpt-4">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="initial-message">Initial Message</Label>
              <Textarea id="initial-message" placeholder="Hallo! Wie kann ich Ihnen heute helfen?" rows={2} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-need">User Need</Label>
              <Textarea id="user-need" placeholder="Der Benutzer sucht nach Verkaufsberatung..." rows={2} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Testfragen ({testQuestions.length})</CardTitle>
              <Dialog open={isGenerateModalOpen} onOpenChange={setIsGenerateModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="hover-scale bg-transparent">
                    <Sparkles className="mr-2 h-4 w-4" />
                    KI generieren
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Fragen mit KI generieren</DialogTitle>
                    <DialogDescription>
                      Lass die KI automatisch relevante Testfragen für deine Evaluation erstellen
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Anzahl Fragen: {generateSettings.count}</Label>
                      <Slider
                        value={[generateSettings.count]}
                        onValueChange={(value) => setGenerateSettings({ ...generateSettings, count: value[0] })}
                        max={20}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Ton</Label>
                      <Select
                        value={generateSettings.tone}
                        onValueChange={(value) => setGenerateSettings({ ...generateSettings, tone: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professional">Professionell</SelectItem>
                          <SelectItem value="casual">Locker</SelectItem>
                          <SelectItem value="formal">Formal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Domain</Label>
                      <Select
                        value={generateSettings.domain}
                        onValueChange={(value) => setGenerateSettings({ ...generateSettings, domain: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sales">Verkauf</SelectItem>
                          <SelectItem value="support">Support</SelectItem>
                          <SelectItem value="general">Allgemein</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      onClick={generateQuestions}
                      className="w-full bg-gradient-accent hover:bg-gradient-accent/90 text-white"
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Fragen generieren
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Neue Testfrage hinzufügen..."
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addQuestion()}
              />
              <Button
                onClick={addQuestion}
                size="icon"
                className="hover-scale bg-gradient-accent hover:bg-gradient-accent/90 text-white"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {testQuestions.map((question, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm flex-1">{question}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeQuestion(index)}
                    className="h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {testQuestions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Keine Testfragen vorhanden</p>
                <p className="text-sm">Füge Fragen hinzu oder generiere sie mit KI</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={startEvaluation}
          disabled={testQuestions.length === 0 || !testId}
          className="bg-gradient-accent hover:bg-gradient-accent/90 text-white hover-scale px-8 py-3 text-lg"
        >
          <Play className="mr-2 h-5 w-5" />
          Evaluation starten
        </Button>
      </div>
    </div>
  )
}
