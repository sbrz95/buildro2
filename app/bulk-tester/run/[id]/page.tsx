"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Play, Pause, Download, RefreshCw } from "lucide-react"
import Link from "next/link"

interface TestResult {
  question: string
  response: string
  status: "pending" | "running" | "completed" | "failed"
  duration: number
  tokens: number
}

export default function EvaluationRunPage({ params }: { params: { id: string } }) {
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<TestResult[]>([
    {
      question: "Wie kann ich meine Verkaufszahlen steigern?",
      response: "",
      status: "pending",
      duration: 0,
      tokens: 0,
    },
    {
      question: "Was sind die besten Strategien für Kundenbindung?",
      response: "",
      status: "pending",
      duration: 0,
      tokens: 0,
    },
    { question: "Wie identifiziere ich qualifizierte Leads?", response: "", status: "pending", duration: 0, tokens: 0 },
  ])

  const startEvaluation = () => {
    setIsRunning(true)
    // Simulate evaluation process
    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex < results.length) {
        setResults((prev) =>
          prev.map((result, index) => {
            if (index === currentIndex) {
              return {
                ...result,
                status: "running",
                response: "Generiere Antwort...",
              }
            }
            return result
          }),
        )

        setTimeout(() => {
          setResults((prev) =>
            prev.map((result, index) => {
              if (index === currentIndex) {
                return {
                  ...result,
                  status: "completed",
                  response: "Hier ist eine detaillierte Antwort auf Ihre Frage über Verkaufsstrategien...",
                  duration: Math.random() * 2000 + 1000,
                  tokens: Math.floor(Math.random() * 200) + 50,
                }
              }
              return result
            }),
          )
          currentIndex++
          setProgress((currentIndex / results.length) * 100)

          if (currentIndex >= results.length) {
            setIsRunning(false)
            clearInterval(interval)
          }
        }, 2000)
      }
    }, 3000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "running":
        return "bg-blue-500"
      case "failed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Abgeschlossen"
      case "running":
        return "Läuft"
      case "failed":
        return "Fehler"
      default:
        return "Wartend"
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/bulk-tester/test-settings">
          <Button variant="ghost" size="icon" className="hover-scale">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Evaluation Run</h1>
          <p className="text-muted-foreground">ID: {params.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Fortschritt:</span>
                <span className="text-sm font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Abgeschlossen:</span>
                  <span>{results.filter((r) => r.status === "completed").length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Läuft:</span>
                  <span>{results.filter((r) => r.status === "running").length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Wartend:</span>
                  <span>{results.filter((r) => r.status === "pending").length}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                {!isRunning ? (
                  <Button
                    onClick={startEvaluation}
                    className="flex-1 bg-gradient-accent hover:bg-gradient-accent/90 text-white"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Start
                  </Button>
                ) : (
                  <Button onClick={() => setIsRunning(false)} variant="outline" className="flex-1 bg-transparent">
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Test Ergebnisse</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="hover-scale bg-transparent">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Aktualisieren
                  </Button>
                  <Button variant="outline" size="sm" className="hover-scale bg-transparent">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.map((result, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(result.status)}`}></div>
                        <Badge variant="outline">{getStatusText(result.status)}</Badge>
                        {result.duration > 0 && (
                          <span className="text-xs text-muted-foreground">{Math.round(result.duration)}ms</span>
                        )}
                        {result.tokens > 0 && (
                          <span className="text-xs text-muted-foreground">{result.tokens} tokens</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium">Frage:</span>
                        <p className="text-sm text-muted-foreground mt-1">{result.question}</p>
                      </div>

                      {result.response && (
                        <div>
                          <span className="text-sm font-medium">Antwort:</span>
                          <p className="text-sm text-muted-foreground mt-1 bg-muted p-2 rounded">{result.response}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
