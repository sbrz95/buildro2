"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Copy, RotateCcw, Code, ThumbsUp, ThumbsDown, TestTube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  usage?: {
    tokensIn: number
    tokensOut: number
    costUSD: number
    latencyMs: number
  }
  feedback?: "up" | "down"
}

export function TestLab() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [markdownEnabled, setMarkdownEnabled] = useState(true)
  const [selectedAgent, setSelectedAgent] = useState("build-123")
  const [selectedVersion, setSelectedVersion] = useState("aug-16-04-09")
  const [showCode, setShowCode] = useState(false)
  const [gdprOptIn, setGdprOptIn] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

      const assistantMessage: Message = {
        id: `msg-${Date.now()}-assistant`,
        role: "assistant",
        content: `Das ist eine Beispielantwort auf: "${userMessage.content}". In einer echten Implementierung würde hier die KI-Antwort stehen.`,
        timestamp: new Date(),
        usage: {
          tokensIn: Math.floor(Math.random() * 100) + 50,
          tokensOut: Math.floor(Math.random() * 200) + 100,
          costUSD: Math.random() * 0.01,
          latencyMs: Math.floor(Math.random() * 2000) + 500,
        },
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      toast.error("Fehler beim Senden der Nachricht")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFeedback = (messageId: string, feedback: "up" | "down") => {
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, feedback } : msg)))
    toast.success("Feedback gespeichert")
  }

  const handleClear = () => {
    setMessages([])
    toast.success("Chat geleert")
  }

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
    toast.success("In Zwischenablage kopiert")
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="h-full flex flex-col bg-card/30">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-4">
          <TestTube className="w-5 h-5 text-gradient" />
          <h2 className="font-semibold">AI Test Lab</h2>
        </div>

        {/* Controls */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm text-muted-foreground">Markdown</label>
            <Switch checked={markdownEnabled} onCheckedChange={setMarkdownEnabled} />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Agent wählen</label>
            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="build-123">Kundenservice Agent</SelectItem>
                <SelectItem value="build-124">Sales Assistant</SelectItem>
                <SelectItem value="build-125">Support Bot</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Version wählen</label>
            <Select value={selectedVersion} onValueChange={setSelectedVersion}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aug-16-04-09">Aug 16 at 04:09 AM</SelectItem>
                <SelectItem value="aug-15-02-30">Aug 15 at 02:30 PM</SelectItem>
                <SelectItem value="aug-14-11-15">Aug 14 at 11:15 AM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-h-0">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center">
              <div className="text-muted-foreground">
                <TestTube className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Bereit zum Testen!</p>
                <p className="text-xs mt-1">Starte eine Unterhaltung, um Antworten deines Agents zu prüfen.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="space-y-2">
                  <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <Card
                      className={`max-w-[80%] p-3 ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-emerald-500/10"
                          : "bg-muted/50"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                      {message.usage && (
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t">
                          <Badge variant="secondary" className="text-xs">
                            {message.usage.tokensIn + message.usage.tokensOut} Tokens
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            ${message.usage.costUSD.toFixed(4)}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {message.usage.latencyMs}ms
                          </Badge>
                        </div>
                      )}
                    </Card>
                  </div>

                  {message.role === "assistant" && (
                    <div className="flex items-center gap-2 justify-start ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFeedback(message.id, "up")}
                        className={`h-6 w-6 p-0 ${message.feedback === "up" ? "text-green-500" : ""}`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFeedback(message.id, "down")}
                        className={`h-6 w-6 p-0 ${message.feedback === "down" ? "text-red-500" : ""}`}
                      >
                        <ThumbsDown className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(message.content)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t space-y-3">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Frag mich etwas..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-purple-500 via-blue-500 to-emerald-500"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleClear} disabled={messages.length === 0}>
                <RotateCcw className="w-4 h-4 mr-1" />
                Clear
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowCode(!showCode)}>
                <Code className="w-4 h-4 mr-1" />
                Code
              </Button>
            </div>
          </div>

          {/* GDPR Compliance */}
          <div className="text-xs text-muted-foreground space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="gdpr-opt-in"
                checked={gdprOptIn}
                onChange={(e) => setGdprOptIn(e.target.checked)}
                className="w-3 h-3"
              />
              <label htmlFor="gdpr-opt-in">Ich bin mit der Protokollierung zu Debug-Zwecken einverstanden</label>
            </div>
            <div className="flex items-center gap-1">
              <span>• Eigener API-Key aktiv</span>
              <span>• Testumgebung</span>
            </div>
            <div className="text-xs">
              <strong>Modell/Provider:</strong> GPT-4 (OpenAI) •<strong> Datenverarbeitung:</strong> nur zu Testzwecken
              •
              <a href="#" className="underline">
                Datenschutz
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
