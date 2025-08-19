"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, DollarSign, Clock, Zap } from "lucide-react"

interface StepFourProps {
  data: any
  onGenerate: () => void
}

export function StepFour({ data, onGenerate }: StepFourProps) {
  const checklist = [
    { item: "Agententyp gewählt", completed: !!data.type },
    { item: "Name und Branche definiert", completed: !!data.name && !!data.industry },
    { item: "KI-Modell konfiguriert", completed: !!data.model },
    { item: "Persönlichkeit beschrieben", completed: !!data.description },
    { item: "Regeln definiert", completed: !!data.rules },
  ]

  const allCompleted = checklist.every((item) => item.completed)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Review & Generierung</h2>
        <p className="text-muted-foreground">Überprüfe alle Einstellungen vor der KI-Generierung</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Konfiguration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Typ:</span>
              <Badge variant="secondary">{data.type || "Nicht gewählt"}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Name:</span>
              <span className="text-sm font-medium">{data.name || "Nicht definiert"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Branche:</span>
              <span className="text-sm font-medium">{data.industry || "Nicht gewählt"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Modell:</span>
              <Badge variant="outline">{data.model || "Nicht gewählt"}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Temperature:</span>
              <span className="text-sm font-medium">{data.temperature}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Schätzungen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Token-Länge:</span>
              </div>
              <span className="text-sm font-medium">~2,500 Tokens</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span className="text-sm">Kosten/Anfrage:</span>
              </div>
              <span className="text-sm font-medium">$0.05</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <span className="text-sm">Generierungszeit:</span>
              </div>
              <span className="text-sm font-medium">~1 Minute</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Checkliste</CardTitle>
          <CardDescription>Stelle sicher, dass alle erforderlichen Felder ausgefüllt sind</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {checklist.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <CheckCircle className={`h-4 w-4 ${item.completed ? "text-green-500" : "text-muted-foreground"}`} />
                <span className={`text-sm ${item.completed ? "text-foreground" : "text-muted-foreground"}`}>
                  {item.item}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button
          onClick={onGenerate}
          disabled={!allCompleted}
          className="bg-gradient-accent hover:bg-gradient-accent/90 text-white hover-scale px-8 py-3 text-lg"
        >
          <Zap className="mr-2 h-5 w-5" />
          KI-Agent generieren
        </Button>
        {!allCompleted && (
          <p className="text-sm text-muted-foreground mt-2">
            Bitte fülle alle erforderlichen Felder aus, um fortzufahren
          </p>
        )}
      </div>
    </div>
  )
}
