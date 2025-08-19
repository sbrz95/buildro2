"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, Plus, X } from "lucide-react"
import { useState } from "react"

interface MessageSettingsProps {
  config: any
  updateConfig: (updates: any) => void
}

export function MessageSettings({ config, updateConfig }: MessageSettingsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [newPrompt, setNewPrompt] = useState("")

  const addStarterPrompt = () => {
    if (newPrompt.trim()) {
      updateConfig({
        starterPrompts: [...config.starterPrompts, newPrompt.trim()],
      })
      setNewPrompt("")
    }
  }

  const removeStarterPrompt = (index: number) => {
    updateConfig({
      starterPrompts: config.starterPrompts.filter((_: any, i: number) => i !== index),
    })
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
        <span className="font-medium">Messages</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 space-y-3">
        <div className="space-y-2">
          <Label htmlFor="welcome-message">Welcome Message</Label>
          <Textarea
            id="welcome-message"
            value={config.welcomeMessage}
            onChange={(e) => updateConfig({ welcomeMessage: e.target.value })}
            placeholder="Hallo! Wie kann ich Ihnen heute helfen?"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label>Starter Prompts</Label>
          <div className="space-y-2">
            {config.starterPrompts.map((prompt: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <Input value={prompt} readOnly className="flex-1" />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeStarterPrompt(index)}
                  className="h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex space-x-2">
              <Input
                placeholder="Neuer Starter Prompt"
                value={newPrompt}
                onChange={(e) => setNewPrompt(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addStarterPrompt()}
              />
              <Button
                onClick={addStarterPrompt}
                size="icon"
                className="bg-gradient-accent hover:bg-gradient-accent/90 text-white"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
