"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Send, Paperclip, Shield, X } from "lucide-react"
import { ModelDisclosure } from "@/components/model-disclosure"
import { AIExplanationButton } from "@/components/ai-explanation-button"

interface Message {
  type: "bot" | "user"
  content: string
  timestamp: Date
}

export default function PublicDemoPage({ params }: { params: { demoId: string } }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showGDPRBanner, setShowGDPRBanner] = useState(true)

  // Mock demo data - in real app this would be fetched from API
  const demoData = {
    id: params.demoId,
    title: "Sales Demo",
    agent: "Sales Agent",
    version: "v1.2",
    brandColor: "#A855F7",
    backgroundColor: "#FFFFFF",
    logo: null,
    welcomeMessage: "Hallo! Wie kann ich Ihnen heute helfen?",
    starterPrompts: ["Produktberatung", "Preise anfragen", "Support kontaktieren"],
    placeholder: "Schreiben Sie eine Nachricht...",
    allowUploads: true,
    noLogging: false,
    anonymizeData: true,
  }

  useEffect(() => {
    // Initialize with welcome message
    setMessages([
      {
        type: "bot",
        content: demoData.welcomeMessage,
        timestamp: new Date(),
      },
    ])
  }, [demoData.welcomeMessage])

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    const userMessage: Message = {
      type: "user",
      content: newMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setNewMessage("")
    setIsLoading(true)

    // Simulate API call to demo chat endpoint
    try {
      // Mock API call - POST /api/demo/:id/chat
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))

      const botResponse: Message = {
        type: "bot",
        content: `Das ist eine simulierte Antwort auf: "${userMessage.content}". Diese Demo zeigt die Funktionalität des ${demoData.agent}.`,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botResponse])
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStarterPrompt = (prompt: string) => {
    setNewMessage(prompt)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* GDPR Banner */}
      {showGDPRBanner && !demoData.noLogging && (
        <div className="bg-blue-50 dark:bg-blue-950/20 border-b border-blue-200 dark:border-blue-800 p-4">
          <div className="max-w-4xl mx-auto flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">Datenschutz & KI-Transparenz</h4>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Diese Demo verwendet KI-Technologie und kann Gespräche für Verbesserungen speichern.{" "}
                  {demoData.anonymizeData && "Ihre Daten werden anonymisiert verarbeitet."}{" "}
                  <a href="/privacy" className="underline hover:no-underline">
                    Datenschutzerklärung
                  </a>
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowGDPRBanner(false)}
              className="h-8 w-8 text-blue-600 dark:text-blue-400"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {demoData.logo ? (
                <img src={demoData.logo || "/placeholder.svg"} alt={demoData.title} className="w-10 h-10 rounded-lg" />
              ) : (
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: demoData.brandColor }}
                >
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
              )}
              <div>
                <h1 className="text-xl font-semibold">{demoData.title}</h1>
                <p className="text-sm text-muted-foreground">
                  {demoData.agent} {demoData.version}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ModelDisclosure model="GPT-4" provider="OpenAI" />
              <AIExplanationButton agentName={demoData.agent} agentType="Sales" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <Card className="h-[600px] flex flex-col shadow-lg">
            {/* Messages */}
            <CardContent className="flex-1 p-6 overflow-auto space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs lg:max-w-md p-4 rounded-lg text-sm ${
                      message.type === "user"
                        ? "text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                    }`}
                    style={message.type === "user" ? { backgroundColor: demoData.brandColor } : {}}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Starter Prompts */}
              {messages.length === 1 && demoData.starterPrompts.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground text-center">Vorschläge zum Einstieg:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {demoData.starterPrompts.map((prompt, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleStarterPrompt(prompt)}
                        className="text-sm bg-transparent hover:bg-muted"
                      >
                        {prompt}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>

            {/* Input Area */}
            <div className="p-6 border-t">
              <div className="flex space-x-3">
                <Input
                  placeholder={demoData.placeholder}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className="flex-1"
                />
                {demoData.allowUploads && (
                  <Button variant="outline" size="icon" disabled={isLoading} className="bg-transparent">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={isLoading || !newMessage.trim()}
                  className="text-white"
                  style={{ backgroundColor: demoData.brandColor }}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Metrics Badges */}
          <div className="flex justify-center space-x-4 mt-4">
            <Badge variant="secondary" className="text-xs">
              Latenz: ~1.2s
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Token: 45
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Kosten: €0.003
            </Badge>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t bg-card/30 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              <span>Powered by buildro.ai</span>
              <a href="/privacy" className="hover:text-foreground underline">
                Datenschutz
              </a>
              <a href="/terms" className="hover:text-foreground underline">
                Nutzungsbedingungen
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                Demo-Modus
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
