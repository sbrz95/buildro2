"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Copy,
  ExternalLink,
  QrCode,
  MessageSquare,
  Send,
  Paperclip,
  Download,
  Shield,
  Info,
  Palette,
  MessageCircle,
  User,
  Settings,
  Globe,
  BarChart3,
  ImageIcon,
  Upload,
  RotateCcw,
} from "lucide-react"
import { toast } from "sonner"
import { BackButton } from "@/components/ui/back-button"

export default function DemoDetailPage({ params }: { params: { id: string } }) {
  const [demoData, setDemoData] = useState({
    id: params.id,
    title: "Sales Demo",
    description: "Demo für Verkaufsberatung mit KI-Agent",
    agent: "Sales Agent",
    version: "v1.2",
    type: "Website Widget",
    status: "active",
    createdAt: "vor 3 Tagen",

    // Appearance settings
    widgetStyle: "bubble-bottom-right",
    brandColor: "#A855F7",
    accentColor: "#3B82F6",
    borderRadius: 14,
    shadow: true,
    fontSize: "M",

    // Messages settings
    welcomeMessage: "Hallo! Wie kann ich Ihnen heute helfen?",
    placeholder: "Schreiben Sie eine Nachricht...",
    errorMessage: "Entschuldigung, es ist ein Fehler aufgetreten.",
    closingMessage: "",

    // Client Message settings
    clientMessageTitle: "Wichtiger Hinweis",
    clientMessageText: "Diese Demo dient nur zu Testzwecken.",
    clientMessagePosition: "top",
    clientMessageShow: false,

    // Platform settings
    markdownResponses: true,
    streamingEffect: true,
    maxTokens: 2048,
    temperature: 0.3,
    topP: 1.0,
    stopSequences: [],

    // Domain settings
    allowedDomains: ["https://beispiel.de"],
    corsEnabled: true,
    referrerPolicy: "strict-origin-when-cross-origin",

    // Usage & Limits
    dailyLimit: 1000,
    rateLimit: 60,
    timeWindow: 1,
    logRetention: "30",
    noLogging: false,

    // Background settings
    backgroundType: "color",
    backgroundColor: "#FFFFFF",
    gradientColors: ["#A855F7", "#3B82F6"],
    backgroundImage: null,
    backgroundBlur: 0,
    backgroundOverlay: 0,

    // Legacy
    logo: null,
    anonymizeData: true,
  })

  const [messages, setMessages] = useState([
    { type: "bot", content: "Hallo! Wie kann ich Ihnen heute helfen?" },
    { type: "user", content: "Ich interessiere mich für Ihre Produkte" },
    { type: "bot", content: "Gerne helfe ich Ihnen weiter! Was möchten Sie über unsere Produkte wissen?" },
  ])
  const [newMessage, setNewMessage] = useState("")

  const publicUrl = `https://buildro.ai/d/${params.id}`
  const embedCode = `<iframe src="${publicUrl}" width="400" height="600" frameborder="0"></iframe>`

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} kopiert!`)
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    setMessages([...messages, { type: "user", content: newMessage }])
    setNewMessage("")

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content: "Das ist eine simulierte Antwort für die Demo-Vorschau.",
        },
      ])
    }, 1000)
  }

  const handleSavePanel = async (panel: string) => {
    try {
      const response = await fetch(`/api/demo/${params.id}/${panel}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(demoData),
      })
      if (response.ok) {
        toast.success("Gespeichert!")
      }
    } catch (error) {
      toast.error("Fehler beim Speichern")
    }
  }

  const handleResetPanel = async (panel: string) => {
    try {
      const response = await fetch(`/api/demo/${params.id}`)
      if (response.ok) {
        const originalData = await response.json()
        setDemoData(originalData)
        toast.success("Zurückgesetzt!")
      }
    } catch (error) {
      toast.error("Fehler beim Zurücksetzen")
    }
  }

  const handleSaveSettings = () => {
    toast.success("Einstellungen gespeichert!")
  }

  return (
    <div className="space-y-6">
      <BackButton href="/demo" />

      <div className="flex items-center space-x-4">
        <div>
          <h1 className="text-3xl font-bold">{demoData.title}</h1>
          <p className="text-muted-foreground">
            {demoData.type} • {demoData.agent} {demoData.version}
          </p>
        </div>
        <Badge variant={demoData.status === "active" ? "default" : "secondary"}>
          {demoData.status === "active" ? "Aktiv" : "Inaktiv"}
        </Badge>
      </div>

      <Tabs defaultValue="preview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="preview">Vorschau</TabsTrigger>
          <TabsTrigger value="share">Teilen & Einbetten</TabsTrigger>
          <TabsTrigger value="settings">Einstellungen</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="space-y-4">
          <div className="flex gap-6">
            {/* Main Preview Area */}
            <div className="flex-1">
              <div className="flex items-center justify-center mb-4">
                <Badge variant="secondary">Demo-Modus</Badge>
              </div>

              <div className="max-w-md mx-auto">
                <Card
                  className="h-96 flex flex-col shadow-lg"
                  style={{
                    borderRadius: `${demoData.borderRadius}px`,
                    boxShadow: demoData.shadow ? "0 10px 25px rgba(0,0,0,0.1)" : "none",
                  }}
                >
                  {/* Chat Header */}
                  <div
                    className="p-4 rounded-t-lg text-white flex items-center space-x-2"
                    style={{
                      backgroundColor: demoData.brandColor,
                      borderRadius: `${demoData.borderRadius}px ${demoData.borderRadius}px 0 0`,
                    }}
                  >
                    <MessageSquare className="h-5 w-5" />
                    <span className="font-medium">{demoData.title}</span>
                  </div>

                  {/* Client Message */}
                  {demoData.clientMessageShow && (
                    <div
                      className={`p-3 border-b bg-blue-50 dark:bg-blue-950/20 ${
                        demoData.clientMessagePosition === "top" ? "order-first" : ""
                      }`}
                    >
                      <div className="text-sm">
                        <div className="font-medium text-blue-900 dark:text-blue-100">
                          {demoData.clientMessageTitle}
                        </div>
                        <div className="text-blue-700 dark:text-blue-300 mt-1">{demoData.clientMessageText}</div>
                      </div>
                    </div>
                  )}

                  {/* Messages */}
                  <CardContent
                    className="flex-1 p-4 overflow-auto space-y-3"
                    style={{
                      fontSize:
                        demoData.fontSize === "S" ? "0.875rem" : demoData.fontSize === "L" ? "1.125rem" : "1rem",
                    }}
                  >
                    <div className="flex justify-start">
                      <div className="max-w-xs p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white">
                        {demoData.welcomeMessage}
                      </div>
                    </div>
                    {messages.map((message, index) => (
                      <div key={index} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-xs p-3 rounded-lg ${
                            message.type === "user"
                              ? "text-white"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                          }`}
                          style={{
                            backgroundColor: message.type === "user" ? demoData.accentColor : undefined,
                            borderRadius: `${demoData.borderRadius}px`,
                          }}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                  </CardContent>

                  {/* Input Area */}
                  <div className="p-4 border-t">
                    <div className="flex space-x-2">
                      <Input
                        placeholder={demoData.placeholder}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        className="flex-1"
                        style={{ borderRadius: `${demoData.borderRadius}px` }}
                      />
                      <Button variant="outline" size="icon" className="bg-transparent">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        onClick={handleSendMessage}
                        style={{
                          backgroundColor: demoData.brandColor,
                          borderRadius: `${demoData.borderRadius}px`,
                        }}
                        className="text-white"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Settings Sidebar */}
            <div className="w-[460px] sticky top-6 h-fit">
              <Card className="h-[calc(100vh-8rem)] overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Demo-Einstellungen</CardTitle>
                  <CardDescription>Passe deine Demo in Echtzeit an</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[calc(100vh-12rem)] overflow-y-auto px-6 pb-6">
                    <Accordion type="multiple" defaultValue={["appearance"]} className="space-y-2">
                      {/* Appearance Panel */}
                      <AccordionItem value="appearance" className="border rounded-lg px-4">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center space-x-2">
                            <Palette className="h-4 w-4" />
                            <span>Appearance</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <Label>Widget-Stil</Label>
                            <Select
                              value={demoData.widgetStyle}
                              onValueChange={(value) => setDemoData({ ...demoData, widgetStyle: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="bubble-bottom-right">Blase rechts unten</SelectItem>
                                <SelectItem value="side-panel">Seitenpanel</SelectItem>
                                <SelectItem value="fullscreen">Vollbild</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Primärfarbe</Label>
                            <div className="flex items-center space-x-2">
                              <input
                                type="color"
                                value={demoData.brandColor}
                                onChange={(e) => setDemoData({ ...demoData, brandColor: e.target.value })}
                                className="w-12 h-10 rounded border"
                              />
                              <Input
                                value={demoData.brandColor}
                                onChange={(e) => setDemoData({ ...demoData, brandColor: e.target.value })}
                                className="flex-1"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Akzent/Hover</Label>
                            <div className="flex items-center space-x-2">
                              <input
                                type="color"
                                value={demoData.accentColor}
                                onChange={(e) => setDemoData({ ...demoData, accentColor: e.target.value })}
                                className="w-12 h-10 rounded border"
                              />
                              <Input
                                value={demoData.accentColor}
                                onChange={(e) => setDemoData({ ...demoData, accentColor: e.target.value })}
                                className="flex-1"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Eckenradius: {demoData.borderRadius}px</Label>
                            <Slider
                              value={[demoData.borderRadius]}
                              onValueChange={([value]) => setDemoData({ ...demoData, borderRadius: value })}
                              max={24}
                              min={0}
                              step={1}
                              className="w-full"
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label>Schatten</Label>
                            <Switch
                              checked={demoData.shadow}
                              onCheckedChange={(checked) => setDemoData({ ...demoData, shadow: checked })}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Schriftgröße</Label>
                            <Select
                              value={demoData.fontSize}
                              onValueChange={(value) => setDemoData({ ...demoData, fontSize: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="S">Klein (S)</SelectItem>
                                <SelectItem value="M">Mittel (M)</SelectItem>
                                <SelectItem value="L">Groß (L)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex space-x-2 pt-4">
                            <Button
                              onClick={() => handleSavePanel("appearance")}
                              className="flex-1 bg-gradient-accent hover:bg-gradient-accent/90 text-white"
                            >
                              Speichern
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleResetPanel("appearance")}
                              className="bg-transparent"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Messages Panel */}
                      <AccordionItem value="messages" className="border rounded-lg px-4">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center space-x-2">
                            <MessageCircle className="h-4 w-4" />
                            <span>Messages</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <Label>Willkommensnachricht</Label>
                            <Textarea
                              value={demoData.welcomeMessage}
                              onChange={(e) => setDemoData({ ...demoData, welcomeMessage: e.target.value })}
                              maxLength={280}
                              rows={3}
                            />
                            <div className="text-xs text-muted-foreground text-right">
                              {demoData.welcomeMessage.length}/280
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Platzhalter im Eingabefeld</Label>
                            <Input
                              value={demoData.placeholder}
                              onChange={(e) => setDemoData({ ...demoData, placeholder: e.target.value })}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Fehlernachricht Fallback</Label>
                            <Input
                              value={demoData.errorMessage}
                              onChange={(e) => setDemoData({ ...demoData, errorMessage: e.target.value })}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Abschlussnachricht (optional)</Label>
                            <Textarea
                              value={demoData.closingMessage}
                              onChange={(e) => setDemoData({ ...demoData, closingMessage: e.target.value })}
                              rows={2}
                            />
                          </div>

                          <div className="flex space-x-2 pt-4">
                            <Button
                              onClick={() => handleSavePanel("messages")}
                              className="flex-1 bg-gradient-accent hover:bg-gradient-accent/90 text-white"
                            >
                              Speichern
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleResetPanel("messages")}
                              className="bg-transparent"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Client Message Panel */}
                      <AccordionItem value="client-message" className="border rounded-lg px-4">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span>Client Message</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <Label>Titel</Label>
                            <Input
                              value={demoData.clientMessageTitle}
                              onChange={(e) => setDemoData({ ...demoData, clientMessageTitle: e.target.value })}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Text (Markdown)</Label>
                            <Textarea
                              value={demoData.clientMessageText}
                              onChange={(e) => setDemoData({ ...demoData, clientMessageText: e.target.value })}
                              maxLength={500}
                              rows={3}
                            />
                            <div className="text-xs text-muted-foreground text-right">
                              {demoData.clientMessageText.length}/500
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Position</Label>
                            <Select
                              value={demoData.clientMessagePosition}
                              onValueChange={(value) => setDemoData({ ...demoData, clientMessagePosition: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="top">Oben</SelectItem>
                                <SelectItem value="bottom">Unten</SelectItem>
                                <SelectItem value="modal">Modal bei Start</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex items-center justify-between">
                            <Label>Anzeigen</Label>
                            <Switch
                              checked={demoData.clientMessageShow}
                              onCheckedChange={(checked) => setDemoData({ ...demoData, clientMessageShow: checked })}
                            />
                          </div>

                          <div className="flex space-x-2 pt-4">
                            <Button
                              onClick={() => handleSavePanel("client-message")}
                              className="flex-1 bg-gradient-accent hover:bg-gradient-accent/90 text-white"
                            >
                              Speichern
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleResetPanel("client-message")}
                              className="bg-transparent"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Platform Settings Panel */}
                      <AccordionItem value="platform" className="border rounded-lg px-4">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center space-x-2">
                            <Settings className="h-4 w-4" />
                            <span>Platform Settings</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-4">
                          <div className="flex items-center justify-between">
                            <Label>Markdown-Antworten</Label>
                            <Switch
                              checked={demoData.markdownResponses}
                              onCheckedChange={(checked) => setDemoData({ ...demoData, markdownResponses: checked })}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label>Streaming/Typing-Effekt</Label>
                            <Switch
                              checked={demoData.streamingEffect}
                              onCheckedChange={(checked) => setDemoData({ ...demoData, streamingEffect: checked })}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Max Tokens</Label>
                            <Input
                              type="number"
                              min={128}
                              max={8192}
                              value={demoData.maxTokens}
                              onChange={(e) => setDemoData({ ...demoData, maxTokens: Number.parseInt(e.target.value) })}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Temperature: {demoData.temperature}</Label>
                            <Slider
                              value={[demoData.temperature]}
                              onValueChange={([value]) => setDemoData({ ...demoData, temperature: value })}
                              max={1.0}
                              min={0.0}
                              step={0.1}
                              className="w-full"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Top-p: {demoData.topP}</Label>
                            <Slider
                              value={[demoData.topP]}
                              onValueChange={([value]) => setDemoData({ ...demoData, topP: value })}
                              max={1.0}
                              min={0.0}
                              step={0.1}
                              className="w-full"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Stoppsequenzen</Label>
                            <Input
                              placeholder="Komma-getrennt: stop1, stop2"
                              value={demoData.stopSequences.join(", ")}
                              onChange={(e) =>
                                setDemoData({
                                  ...demoData,
                                  stopSequences: e.target.value
                                    .split(",")
                                    .map((s) => s.trim())
                                    .filter(Boolean),
                                })
                              }
                            />
                          </div>

                          <div className="flex space-x-2 pt-4">
                            <Button
                              onClick={() => handleSavePanel("platform")}
                              className="flex-1 bg-gradient-accent hover:bg-gradient-accent/90 text-white"
                            >
                              Speichern
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleResetPanel("platform")}
                              className="bg-transparent"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Domain Settings Panel */}
                      <AccordionItem value="domain" className="border rounded-lg px-4">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center space-x-2">
                            <Globe className="h-4 w-4" />
                            <span>Domain Settings</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <Label>Öffentliche Demo-URL</Label>
                            <div className="flex space-x-2">
                              <Input value={publicUrl} readOnly className="flex-1" />
                              <Button
                                variant="outline"
                                onClick={() => handleCopy(publicUrl, "URL")}
                                className="bg-transparent"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Allow-List Domains</Label>
                            <Input
                              placeholder="https://beispiel.de, https://test.com"
                              value={demoData.allowedDomains.join(", ")}
                              onChange={(e) =>
                                setDemoData({
                                  ...demoData,
                                  allowedDomains: e.target.value
                                    .split(",")
                                    .map((s) => s.trim())
                                    .filter(Boolean),
                                })
                              }
                            />
                            <div className="text-xs text-muted-foreground">FQDN/Origin Format erforderlich</div>
                          </div>

                          <div className="flex items-center justify-between">
                            <Label>CORS-Header aktivieren</Label>
                            <Switch
                              checked={demoData.corsEnabled}
                              onCheckedChange={(checked) => setDemoData({ ...demoData, corsEnabled: checked })}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Referrer-Policy</Label>
                            <Select
                              value={demoData.referrerPolicy}
                              onValueChange={(value) => setDemoData({ ...demoData, referrerPolicy: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="no-referrer">no-referrer</SelectItem>
                                <SelectItem value="strict-origin-when-cross-origin">
                                  strict-origin-when-cross-origin
                                </SelectItem>
                                <SelectItem value="same-origin">same-origin</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex space-x-2 pt-4">
                            <Button
                              onClick={() => handleSavePanel("domain")}
                              className="flex-1 bg-gradient-accent hover:bg-gradient-accent/90 text-white"
                            >
                              Speichern
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleResetPanel("domain")}
                              className="bg-transparent"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Usage & Limits Panel */}
                      <AccordionItem value="limits" className="border rounded-lg px-4">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center space-x-2">
                            <BarChart3 className="h-4 w-4" />
                            <span>Usage & Limits</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <Label>Tägliches Request-Limit</Label>
                            <Input
                              type="number"
                              min={10}
                              max={100000}
                              value={demoData.dailyLimit}
                              onChange={(e) =>
                                setDemoData({ ...demoData, dailyLimit: Number.parseInt(e.target.value) })
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Rate Limit (Requests pro Minute)</Label>
                            <Input
                              type="number"
                              min={1}
                              max={10000}
                              value={demoData.rateLimit}
                              onChange={(e) => setDemoData({ ...demoData, rateLimit: Number.parseInt(e.target.value) })}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Zeitfenster (Minuten)</Label>
                            <Input
                              type="number"
                              min={1}
                              max={60}
                              value={demoData.timeWindow}
                              onChange={(e) =>
                                setDemoData({ ...demoData, timeWindow: Number.parseInt(e.target.value) })
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Speicherdauer von Logs</Label>
                            <Select
                              value={demoData.logRetention}
                              onValueChange={(value) => setDemoData({ ...demoData, logRetention: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">Keine</SelectItem>
                                <SelectItem value="7">7 Tage</SelectItem>
                                <SelectItem value="30">30 Tage</SelectItem>
                                <SelectItem value="90">90 Tage</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex items-center justify-between">
                            <Label>Logging deaktivieren (DSGVO)</Label>
                            <Switch
                              checked={demoData.noLogging}
                              onCheckedChange={(checked) => setDemoData({ ...demoData, noLogging: checked })}
                            />
                          </div>

                          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                            <div className="flex items-start space-x-2">
                              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                              <div className="text-xs text-blue-700 dark:text-blue-300">
                                Bei aktivem Logging werden personenbezogene Daten gemäß Ihren Opt-Ins
                                anonymisiert/maskiert.
                              </div>
                            </div>
                          </div>

                          <div className="flex space-x-2 pt-4">
                            <Button
                              onClick={() => handleSavePanel("limits")}
                              className="flex-1 bg-gradient-accent hover:bg-gradient-accent/90 text-white"
                            >
                              Speichern
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleResetPanel("limits")}
                              className="bg-transparent"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Background Customization Panel */}
                      <AccordionItem value="background" className="border rounded-lg px-4">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center space-x-2">
                            <ImageIcon className="h-4 w-4" />
                            <span>Background Customization</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <Label>Hintergrundtyp</Label>
                            <Select
                              value={demoData.backgroundType}
                              onValueChange={(value) => setDemoData({ ...demoData, backgroundType: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="color">Farbe</SelectItem>
                                <SelectItem value="gradient">Verlauf</SelectItem>
                                <SelectItem value="image">Bild</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {demoData.backgroundType === "color" && (
                            <div className="space-y-2">
                              <Label>Farbe</Label>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="color"
                                  value={demoData.backgroundColor}
                                  onChange={(e) => setDemoData({ ...demoData, backgroundColor: e.target.value })}
                                  className="w-12 h-10 rounded border"
                                />
                                <Input
                                  value={demoData.backgroundColor}
                                  onChange={(e) => setDemoData({ ...demoData, backgroundColor: e.target.value })}
                                  className="flex-1"
                                />
                              </div>
                            </div>
                          )}

                          {demoData.backgroundType === "gradient" && (
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>Verlauf Farbe 1</Label>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="color"
                                    value={demoData.gradientColors[0]}
                                    onChange={(e) =>
                                      setDemoData({
                                        ...demoData,
                                        gradientColors: [e.target.value, demoData.gradientColors[1]],
                                      })
                                    }
                                    className="w-12 h-10 rounded border"
                                  />
                                  <Input
                                    value={demoData.gradientColors[0]}
                                    onChange={(e) =>
                                      setDemoData({
                                        ...demoData,
                                        gradientColors: [e.target.value, demoData.gradientColors[1]],
                                      })
                                    }
                                    className="flex-1"
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label>Verlauf Farbe 2</Label>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="color"
                                    value={demoData.gradientColors[1]}
                                    onChange={(e) =>
                                      setDemoData({
                                        ...demoData,
                                        gradientColors: [demoData.gradientColors[0], e.target.value],
                                      })
                                    }
                                    className="w-12 h-10 rounded border"
                                  />
                                  <Input
                                    value={demoData.gradientColors[1]}
                                    onChange={(e) =>
                                      setDemoData({
                                        ...demoData,
                                        gradientColors: [demoData.gradientColors[0], e.target.value],
                                      })
                                    }
                                    className="flex-1"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {demoData.backgroundType === "image" && (
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>Bild-Upload</Label>
                                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Klicken oder Datei hierher ziehen
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">PNG, JPG bis 5MB</p>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label>Blur: {demoData.backgroundBlur}</Label>
                                <Slider
                                  value={[demoData.backgroundBlur]}
                                  onValueChange={([value]) => setDemoData({ ...demoData, backgroundBlur: value })}
                                  max={20}
                                  min={0}
                                  step={1}
                                  className="w-full"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label>Dunkel-Overlay: {demoData.backgroundOverlay}</Label>
                                <Slider
                                  value={[demoData.backgroundOverlay]}
                                  onValueChange={([value]) => setDemoData({ ...demoData, backgroundOverlay: value })}
                                  max={0.6}
                                  min={0}
                                  step={0.1}
                                  className="w-full"
                                />
                              </div>
                            </div>
                          )}

                          <div className="flex space-x-2 pt-4">
                            <Button
                              onClick={() => handleSavePanel("background")}
                              className="flex-1 bg-gradient-accent hover:bg-gradient-accent/90 text-white"
                            >
                              Speichern
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleResetPanel("background")}
                              className="bg-transparent"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="share" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Öffentlicher Link</CardTitle>
                  <CardDescription>Teile diesen Link mit deinen Kunden</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-2">
                    <Input value={publicUrl} readOnly className="flex-1" />
                    <Button variant="outline" onClick={() => handleCopy(publicUrl, "Link")} className="bg-transparent">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => window.open(publicUrl, "_blank")}
                      className="bg-transparent"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>iFrame Embed Code</CardTitle>
                  <CardDescription>Bette die Demo in deine Website ein</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea value={embedCode} readOnly rows={3} className="font-mono text-sm" />
                  <Button
                    variant="outline"
                    onClick={() => handleCopy(embedCode, "Embed Code")}
                    className="w-full bg-transparent"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Code kopieren
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>QR-Code</CardTitle>
                  <CardDescription>Für einfachen Zugriff auf mobilen Geräten</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-center p-8 bg-white rounded-lg border">
                    <div className="w-32 h-32 bg-gray-200 rounded flex items-center justify-center">
                      <QrCode className="h-16 w-16 text-gray-400" />
                    </div>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Download className="mr-2 h-4 w-4" />
                    Als PNG herunterladen
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Vorschau</CardTitle>
                  <CardDescription>So sieht deine eingebettete Demo aus</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                    <div className="w-full h-64 bg-white dark:bg-gray-800 rounded border flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Demo Vorschau</p>
                        <p className="text-xs text-muted-foreground">{demoData.title}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Allgemeine Einstellungen</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Demo-Name</Label>
                    <Input
                      id="title"
                      value={demoData.title}
                      onChange={(e) => setDemoData({ ...demoData, title: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Beschreibung</Label>
                    <Textarea
                      id="description"
                      value={demoData.description}
                      onChange={(e) => setDemoData({ ...demoData, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Demo aktivieren</Label>
                      <p className="text-sm text-muted-foreground">
                        Deaktivierte Demos sind nicht öffentlich zugänglich
                      </p>
                    </div>
                    <Switch
                      checked={demoData.status === "active"}
                      onCheckedChange={(checked) =>
                        setDemoData({ ...demoData, status: checked ? "active" : "inactive" })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Branding</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="brandColor">Primärfarbe</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        id="brandColor"
                        value={demoData.brandColor}
                        onChange={(e) => setDemoData({ ...demoData, brandColor: e.target.value })}
                        className="w-12 h-10 rounded border"
                      />
                      <Input
                        value={demoData.brandColor}
                        onChange={(e) => setDemoData({ ...demoData, brandColor: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="backgroundColor">Hintergrundfarbe</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        id="backgroundColor"
                        value={demoData.backgroundColor}
                        onChange={(e) => setDemoData({ ...demoData, backgroundColor: e.target.value })}
                        className="w-12 h-10 rounded border"
                      />
                      <Input
                        value={demoData.backgroundColor}
                        onChange={(e) => setDemoData({ ...demoData, backgroundColor: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5" />
                    DSGVO-Einstellungen
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="noLogging"
                      checked={demoData.noLogging}
                      onCheckedChange={(checked) => setDemoData({ ...demoData, noLogging: checked as boolean })}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="noLogging" className="text-sm font-medium">
                        Kein Logging aktivieren
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Gespräche werden nicht gespeichert oder analysiert
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="anonymizeData"
                      checked={demoData.anonymizeData}
                      onCheckedChange={(checked) => setDemoData({ ...demoData, anonymizeData: checked as boolean })}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="anonymizeData" className="text-sm font-medium">
                        Testdaten anonymisieren
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Benutzereingaben werden vor der Verarbeitung anonymisiert
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                          DSGVO & AI Act Konformität
                        </h4>
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                          Diese Demo erfüllt alle Anforderungen der DSGVO und des EU AI Acts.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveSettings}
                  className="bg-gradient-accent hover:bg-gradient-accent/90 text-white"
                >
                  Einstellungen speichern
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
