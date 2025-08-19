"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageSquare, Send, Paperclip } from "lucide-react"
import { ModelDisclosure } from "@/components/model-disclosure"
import { AIExplanationButton } from "@/components/ai-explanation-button"

interface DemoPreviewProps {
  config: any
}

export function DemoPreview({ config }: DemoPreviewProps) {
  const messages = [
    { type: "bot", content: config.welcomeMessage },
    { type: "user", content: "Hallo, ich interessiere mich für Ihre Produkte" },
    { type: "bot", content: "Gerne helfe ich Ihnen weiter! Was möchten Sie über unsere Produkte wissen?" },
  ]

  return (
    <div className="h-full flex items-center justify-center">
      <div className="w-full max-w-md space-y-4">
        <div className="flex items-center justify-between">
          <ModelDisclosure model="GPT-4" provider="OpenAI" />
          <AIExplanationButton agentName={config.name} agentType="Sales" />
        </div>

        <Card className="h-96 flex flex-col shadow-lg">
          {/* Chat Header */}
          <div
            className="p-4 rounded-t-lg text-white flex items-center space-x-2"
            style={{ backgroundColor: config.brandColor }}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="font-medium">{config.launchText}</span>
          </div>

          {/* Messages */}
          <CardContent className="flex-1 p-4 overflow-auto space-y-3">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs p-3 rounded-lg text-sm ${
                    message.type === "user"
                      ? "bg-gradient-accent text-white"
                      : config.theme === "dark"
                        ? "bg-gray-700 text-white"
                        : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {/* Starter Prompts */}
            {config.starterPrompts.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Vorschläge:</p>
                <div className="flex flex-wrap gap-2">
                  {config.starterPrompts.map((prompt: string, index: number) => (
                    <Button key={index} variant="outline" size="sm" className="text-xs h-7 bg-transparent">
                      {prompt}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>

          {/* Input Area */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input placeholder={config.placeholder} className="flex-1" />
              {config.allowUploads && (
                <Button variant="outline" size="icon" className="bg-transparent">
                  <Paperclip className="h-4 w-4" />
                </Button>
              )}
              <Button size="icon" style={{ backgroundColor: config.brandColor }} className="text-white">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
