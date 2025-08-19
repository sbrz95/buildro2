"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { HelpCircle, Brain, Zap, MessageSquare } from "lucide-react"

interface AIExplanationButtonProps {
  agentName?: string
  agentType?: string
}

export function AIExplanationButton({ agentName = "KI-Agent", agentType = "Allgemein" }: AIExplanationButtonProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="bg-transparent">
          <HelpCircle className="mr-2 h-4 w-4" />
          Wie funktioniert dieser Agent?
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-blue-600" />
            <span>Wie funktioniert {agentName}?</span>
          </DialogTitle>
          <DialogDescription>
            Erfahren Sie mehr über die Funktionsweise dieses KI-Agenten gemäß EU AI Act Transparenzanforderungen
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
            <h4 className="font-medium mb-2 flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>KI-Technologie</span>
            </h4>
            <p className="text-sm text-muted-foreground">
              Dieser Agent basiert auf Large Language Models (LLMs), die mit umfangreichen Textdaten trainiert wurden.
              Die KI analysiert Ihre Eingaben und generiert kontextbezogene Antworten basierend auf erlernten Mustern.
            </p>
          </div>

          <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
            <h4 className="font-medium mb-2 flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Spezialisierung: {agentType}</span>
            </h4>
            <p className="text-sm text-muted-foreground">
              Der Agent wurde speziell für {agentType.toLowerCase()}-Anwendungen konfiguriert und mit entsprechenden
              Richtlinien und Wissensdatenbanken ausgestattet, um relevante und hilfreiche Antworten zu liefern.
            </p>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Grenzen & Hinweise</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• KI-generierte Antworten können Fehler enthalten</li>
              <li>• Der Agent hat keinen Zugang zu aktuellen Ereignissen nach seinem Trainingsstichtag</li>
              <li>• Sensible oder persönliche Daten sollten nicht geteilt werden</li>
              <li>• Bei wichtigen Entscheidungen sollten menschliche Experten konsultiert werden</li>
            </ul>
          </div>

          <div className="text-xs text-muted-foreground">
            Diese Erklärung erfüllt die Transparenzanforderungen des EU AI Acts für KI-Systeme.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
