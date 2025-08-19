"use client"

import { Bot, Webhook, FileUp, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface IntegrationPopoverProps {
  position: { x: number; y: number }
  onSelect: (type: "worker" | "webhook" | "files") => void
  onClose: () => void
}

export function IntegrationPopover({ position, onSelect, onClose }: IntegrationPopoverProps) {
  const integrations = [
    {
      type: "worker" as const,
      icon: <Bot className="w-5 h-5 text-blue-500" />,
      title: "Worker Agent",
      description: "Fügt einen spezialisierten Unter-Agenten hinzu, der Aufgaben für den Haupt-Agenten übernimmt.",
    },
    {
      type: "webhook" as const,
      icon: <Webhook className="w-5 h-5 text-emerald-500" />,
      title: "Webhook",
      description: "Verbinde externe Dienste per HTTP-Webhook.",
    },
    {
      type: "files" as const,
      icon: <FileUp className="w-5 h-5 text-purple-500" />,
      title: "File Upload",
      description: "Lade Dateien hoch und nutze sie als Wissensbasis für deinen Agenten.",
    },
  ]

  return (
    <div
      className="absolute z-50"
      style={{
        left: position.x,
        top: position.y,
        transform: "translate(-50%, -100%)",
      }}
    >
      <Card className="p-4 w-80 shadow-xl border bg-card/95 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">Integration hinzufügen</h3>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {integrations.map((integration) => (
            <button
              key={integration.type}
              onClick={() => onSelect(integration.type)}
              className="w-full p-3 text-left rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                {integration.icon}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm">{integration.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{integration.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </Card>
    </div>
  )
}
