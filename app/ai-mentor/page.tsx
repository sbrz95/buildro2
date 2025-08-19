"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { toast } from "@/hooks/use-toast"
import {
  Send,
  Copy,
  Sparkles,
  Shield,
  CheckCircle,
  ExternalLink,
  Download,
  Trash2,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  DollarSign,
  Zap,
  Bot,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
  timestamp: Date
  id: string
}

interface OptimizationResult {
  original: string
  improved: string
  diff: string
  improvements: string[]
}

interface ModelRecommendation {
  model: string
  monthlyUSD: number
  latencyMs: number
  alternatives: Array<{
    model: string
    monthlyUSD: number
    reason: string
  }>
}

const calculateDiff = (original: string, improved: string) => {
  const originalLines = original.split("\n")
  const improvedLines = improved.split("\n")
  const maxLines = Math.max(originalLines.length, improvedLines.length)

  const diffLines = []

  for (let i = 0; i < maxLines; i++) {
    const originalLine = originalLines[i] || ""
    const improvedLine = improvedLines[i] || ""

    if (originalLine === improvedLine) {
      // Unchanged line
      diffLines.push({
        type: "unchanged",
        lineNumber: i + 1,
        content: originalLine,
      })
    } else if (!originalLine && improvedLine) {
      // Added line
      diffLines.push({
        type: "added",
        lineNumber: i + 1,
        content: improvedLine,
      })
    } else if (originalLine && !improvedLine) {
      // Deleted line
      diffLines.push({
        type: "deleted",
        lineNumber: i + 1,
        content: originalLine,
      })
    } else {
      // Modified line - show both
      diffLines.push({
        type: "deleted",
        lineNumber: i + 1,
        content: originalLine,
      })
      diffLines.push({
        type: "added",
        lineNumber: i + 1,
        content: improvedLine,
      })
    }
  }

  return diffLines
}

export default function AIMentorPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hallo 👋, wie kann ich dir heute helfen? Frag mich nach Prompt-Tipps, Modellauswahl, Kosten oder Guardrails.",
      timestamp: new Date(),
      id: "initial-message",
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [expandedExplanations, setExpandedExplanations] = useState<Set<string>>(new Set())
  const [explanations, setExplanations] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [currentPrompt, setCurrentPrompt] = useState("")
  const [optimizationGoals, setOptimizationGoals] = useState<string[]>([])
  const [context, setContext] = useState("")
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [costInputs, setCostInputs] = useState({
    goal: "balance",
    tokensPerDay: 1000,
    provider: "openai",
  })
  const [modelRecommendation, setModelRecommendation] = useState<ModelRecommendation | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [showPrivacyBanner, setShowPrivacyBanner] = useState(true)
  const [privacySettings, setPrivacySettings] = useState({
    storeLogs: false,
    anonymizeLogs: true,
    storeMentorChats: false,
  })
  const [showBuildModal, setShowBuildModal] = useState(false)
  const [buildName, setBuildName] = useState("")
  const [targetAgent, setTargetAgent] = useState("")
  const [versionLabel, setVersionLabel] = useState("")
  const [buildNotes, setBuildNotes] = useState("")

  const [activeOptimizerTab, setActiveOptimizerTab] = useState("original")

  const [showModelComparison, setShowModelComparison] = useState(false)
  const [chartRef, setChartRef] = useState<HTMLDivElement | null>(null)

  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const suggestionChips = ["Prompt verbessern", "Kosten senken", "Halluzinationen reduzieren", "Eval-Plan erstellen"]

  const bestPractices = [
    {
      title: "Strukturierter Systemprompt",
      content:
        "Definiere klare Rollen, Ziele und Ausgabeformate. Verwende Abschnitte für Kontext, Aufgaben und Beispiele.",
    },
    {
      title: "Stabile Antwortformate",
      content:
        "Nutze JSON oder strukturierte Ausgaben statt Freitext. Vermeide interne Gedankenketten in der finalen Antwort.",
    },
    {
      title: "Evaluierung vor Skalierung",
      content:
        "Teste mit kleinen, repräsentativen Datasets bevor du in Produktion gehst. Definiere klare Erfolgskriterien.",
    },
    {
      title: "Kostenkontrolle",
      content: "Halte Eingaben kurz, komprimiere Kontext und nutze günstigere Modelle für einfache Aufgaben.",
    },
    {
      title: "Determinismus in Produktion",
      content: "Verwende Temperature ≤ 0.3 für konsistente Ergebnisse. Aktiviere Caching für wiederkehrende Anfragen.",
    },
  ]

  const promptLibrary = [
    {
      category: "Sales",
      title: "Produktberatung",
      prompt:
        "Du bist ein erfahrener Produktberater. Analysiere die Kundenanfrage und empfehle passende Lösungen basierend auf: Budget, Anforderungen, Zeitrahmen. Antworte strukturiert mit Vor-/Nachteilen.",
    },
    {
      category: "Support",
      title: "Technischer Support",
      prompt:
        "Du hilfst bei technischen Problemen. Stelle gezielte Diagnosefragen, biete Schritt-für-Schritt Lösungen und eskaliere bei Bedarf. Bleibe geduldig und verständlich.",
    },
    {
      category: "FAQ",
      title: "FAQ Generator",
      prompt:
        "Erstelle häufige Fragen und Antworten basierend auf dem gegebenen Thema. Formuliere Fragen aus Kundensicht und gib präzise, hilfreiche Antworten.",
    },
    {
      category: "Recherche",
      title: "Marktanalyse",
      prompt:
        "Analysiere den gegebenen Markt systematisch: Zielgruppe, Wettbewerb, Trends, Chancen/Risiken. Strukturiere die Analyse in klare Abschnitte mit Handlungsempfehlungen.",
    },
  ]

  const troubleshootingItems = [
    {
      issue: "Antworten sind zu lang",
      fix: "MaxTokens -25%, Temperatur -0.1, Regel hinzufügen",
      action: "fix-long-answers",
      changes: {
        maxTokens: -0.25,
        temperature: -0.1,
        rule: "Halte Antworten < 6 Sätze.",
      },
    },
    {
      issue: "Antworten halluzinieren",
      fix: "Temperatur ≤0.3, Anti-Halluzinations-Regel",
      action: "fix-hallucination",
      changes: {
        temperature: 0.3,
        rule: "Antworte mit 'Ich weiß es nicht' bei fehlendem Wissen.",
      },
    },
    {
      issue: "Kosten zu hoch",
      fix: "MaxTokens -30%, Top-p ≤0.9, Kontext kürzen",
      action: "fix-high-cost",
      changes: {
        maxTokens: -0.3,
        topP: 0.9,
        hint: "Kontext kürzen empfohlen",
      },
    },
    {
      issue: "Zu langsam",
      fix: "Leichteres Modell, Temperatur +0.05",
      action: "fix-slow-response",
      changes: {
        model: "gpt-3.5-turbo",
        temperature: 0.05,
        hint: "Tool-Calls minimieren",
      },
    },
    {
      issue: "PII im Output",
      fix: "Guardrails aktivieren",
      action: "enable-guardrails",
      changes: {
        rule: "Keine persönlichen Daten in Antworten verwenden.",
      },
    },
  ]

  const guardrailSuggestions = [
    "PII-Maskierung aktivieren",
    "Tool-Whitelist definieren",
    "Antwortstil-Regeln setzen",
    "Inhaltsfilter konfigurieren",
    "Rate-Limiting einrichten",
  ]

  const [quickFixModal, setQuickFixModal] = useState<{
    isOpen: boolean
    item: any
    oldState: any
    newState: any
  } | null>(null)
  const [undoState, setUndoState] = useState<any>(null)
  const [showUndo, setShowUndo] = useState(false)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    const hasSeenBanner = localStorage.getItem("ai-mentor-privacy-banner")
    if (hasSeenBanner) {
      setShowPrivacyBanner(false)
    }
  }, [])

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: ChatMessage = {
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
      id: `user-${Date.now()}`,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/mentor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          history: messages.slice(-5), // Last 5 messages for context
        }),
      })

      const data = await response.json()

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
        id: `assistant-${Date.now()}`,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Mentor-Chat ist momentan nicht verfügbar.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion)
  }

  const handleOptimizePrompt = async () => {
    if (!currentPrompt.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte gib einen Prompt ein.",
        variant: "destructive",
      })
      return
    }

    setIsOptimizing(true)

    try {
      const response = await fetch("/api/mentor/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: currentPrompt,
          goals: optimizationGoals,
          context,
        }),
      })

      const data = await response.json()
      setOptimizationResult(data)
      setActiveOptimizerTab("diff")

      toast({
        title: "Prompt optimiert",
        description: "Überprüfe die Verbesserungsvorschläge.",
      })
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Optimierung fehlgeschlagen.",
        variant: "destructive",
      })
    } finally {
      setIsOptimizing(false)
    }
  }

  const handleCalculateRecommendation = async () => {
    setIsCalculating(true)

    try {
      const response = await fetch("/api/mentor/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(costInputs),
      })

      const data = await response.json()
      setModelRecommendation(data)

      toast({
        title: "Empfehlung berechnet",
        description: "Überprüfe die Modell- und Kostenvorschläge.",
      })
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Berechnung fehlgeschlagen.",
        variant: "destructive",
      })
    } finally {
      setIsCalculating(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Kopiert",
      description: "Text wurde in die Zwischenablage kopiert.",
    })
  }

  const handleQuickFix = (item: any) => {
    const currentState = {
      maxTokens: 2048,
      temperature: 0.7,
      topP: 0.95,
      model: "gpt-4",
      rules: guardrailSuggestions,
    }

    const newState = { ...currentState }

    if (item.changes.maxTokens) {
      newState.maxTokens = Math.round(currentState.maxTokens * (1 + item.changes.maxTokens))
    }
    if (item.changes.temperature !== undefined) {
      if (item.changes.temperature < 1) {
        newState.temperature = Math.max(0, currentState.temperature + item.changes.temperature)
      } else {
        newState.temperature = item.changes.temperature
      }
    }
    if (item.changes.topP) {
      newState.topP = item.changes.topP
    }
    if (item.changes.model) {
      newState.model = item.changes.model
    }
    if (item.changes.rule) {
      newState.rules = [...currentState.rules, item.changes.rule]
    }

    setQuickFixModal({
      isOpen: true,
      item,
      oldState: currentState,
      newState,
    })
  }

  const applyQuickFix = async () => {
    if (!quickFixModal) return

    try {
      await fetch("/api/mentor/guardrails", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quickFixModal.newState),
      })

      setUndoState(quickFixModal.oldState)
      setQuickFixModal(null)

      toast({
        title: "Quick-Fix angewendet",
        description: `${quickFixModal.item.issue} wurde behoben.`,
        action: (
          <Button variant="outline" size="sm" onClick={handleUndo}>
            Rückgängig
          </Button>
        ),
      })

      setShowUndo(true)
      setTimeout(() => setShowUndo(false), 10000)
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Quick-Fix konnte nicht angewendet werden.",
        variant: "destructive",
      })
    }
  }

  const handleUndo = async () => {
    if (!undoState) return

    try {
      await fetch("/api/mentor/guardrails", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(undoState),
      })

      toast({
        title: "Rückgängig gemacht",
        description: "Vorherige Einstellungen wiederhergestellt.",
      })

      setUndoState(null)
      setShowUndo(false)
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Rückgängig-Aktion fehlgeschlagen.",
        variant: "destructive",
      })
    }
  }

  const handleTroubleshootingAction = (action: string) => {
    toast({
      title: "Aktion ausgeführt",
      description: `${action} wurde angewendet (Mock).`,
    })
  }

  const handleGuardrailsApply = async () => {
    try {
      await fetch("/api/mentor/guardrails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rules: guardrailSuggestions }),
      })

      toast({
        title: "Guardrails aktiviert",
        description: "Sicherheitsregeln wurden angewendet.",
      })
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Guardrails konnten nicht aktiviert werden.",
        variant: "destructive",
      })
    }
  }

  const handlePrivacyBannerAccept = () => {
    localStorage.setItem("ai-mentor-privacy-banner", "accepted")
    setShowPrivacyBanner(false)
  }

  const handleExportChats = () => {
    const data = JSON.stringify(messages, null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "mentor-chats.json"
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Export erfolgreich",
      description: "Mentor-Chats wurden exportiert.",
    })
  }

  const handleDeleteChats = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Hallo 👋, wie kann ich dir heute helfen? Frag mich nach Prompt-Tipps, Modellauswahl, Kosten oder Guardrails.",
        timestamp: new Date(),
        id: "initial-message",
      },
    ])

    toast({
      title: "Chats gelöscht",
      description: "Alle Mentor-Chats wurden entfernt.",
    })
  }

  const handleExportCSV = () => {
    if (!optimizationResult) return

    const timestamp = new Date().toISOString()
    const goalFlags = optimizationGoals.join(";")
    const csvContent = [
      "timestamp,goalFlags,originalPrompt,optimizedPrompt,notes",
      `"${timestamp}","${goalFlags}","${optimizationResult.original.replace(/"/g, '""')}","${optimizationResult.improved.replace(/"/g, '""')}","${context.replace(/"/g, '""')}"`,
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const now = new Date()
    const filename = `prompt_optimization_${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}_${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}.csv`

    link.href = URL.createObjectURL(blob)
    link.download = filename
    link.click()

    toast({
      title: "Export erfolgreich",
      description: `CSV-Datei ${filename} wurde heruntergeladen.`,
    })
  }

  const handleExportJSON = () => {
    if (!optimizationResult) return

    const exportData = {
      timestamp: new Date().toISOString(),
      goalFlags: optimizationGoals,
      originalPrompt: optimizationResult.original,
      optimizedPrompt: optimizationResult.improved,
      notes: context,
      improvements: optimizationResult.improvements,
    }

    const jsonContent = JSON.stringify(exportData, null, 2)
    const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" })
    const link = document.createElement("a")
    const now = new Date()
    const filename = `prompt_optimization_${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}_${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}.json`

    link.href = URL.createObjectURL(blob)
    link.download = filename
    link.click()

    toast({
      title: "Export erfolgreich",
      description: `JSON-Datei ${filename} wurde heruntergeladen.`,
    })
  }

  const handleAdoptAsBuild = async () => {
    if (!optimizationResult || !buildName.trim()) return

    try {
      // Save prompt
      await fetch("/api/prompts/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: buildName,
          prompt: optimizationResult.improved,
          version: versionLabel,
          notes: buildNotes,
          originalPrompt: optimizationResult.original,
          improvements: optimizationResult.improvements,
        }),
      })

      // Create or update agent
      const agentEndpoint = targetAgent === "new" ? "/api/agents" : `/api/agents/${targetAgent}`
      const method = targetAgent === "new" ? "POST" : "PATCH"

      const response = await fetch(agentEndpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: buildName,
          prompt: optimizationResult.improved,
          version: versionLabel,
          notes: buildNotes,
        }),
      })

      const result = await response.json()

      setShowBuildModal(false)
      setBuildName("")
      setTargetAgent("")
      setVersionLabel("")
      setBuildNotes("")

      toast({
        title: "Prompt als Build übernommen",
        description: (
          <div className="flex items-center gap-2">
            <span>Build wurde erfolgreich erstellt.</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`/agents/${result.id}`, "_blank")}
              className="text-xs"
            >
              Zum Build
            </Button>
          </div>
        ),
      })
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Build konnte nicht erstellt werden. Bitte versuche es erneut.",
        variant: "destructive",
      })
    }
  }

  const generateCostData = () => {
    const baseDaily = (costInputs.tokensPerDay * 0.002) / 1000 // Rough estimate: $0.002 per 1k tokens
    const data = []

    for (let day = 1; day <= 30; day++) {
      const noise = (Math.random() - 0.5) * 0.2 // ±10% noise
      const primaryCost = baseDaily * (1 + noise)

      const dataPoint: any = {
        day,
        primary: Number(primaryCost.toFixed(3)),
      }

      if (showModelComparison && modelRecommendation?.alternatives[0]) {
        const altCost = primaryCost * 0.8 * (1 + noise) // Alternative is ~20% cheaper
        dataPoint.alternative = Number(altCost.toFixed(3))
      }

      data.push(dataPoint)
    }

    return data
  }

  const exportChartAsPNG = () => {
    if (!chartRef) return

    // Create a canvas element
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 800
    canvas.height = 400

    // Simple chart drawing (mock implementation)
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 2
    ctx.beginPath()

    const data = generateCostData()
    data.forEach((point, index) => {
      const x = (index / 29) * 700 + 50
      const y = 350 - point.primary * 1000

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Download the image
    const link = document.createElement("a")
    link.download = `cost-preview-${new Date().toISOString().split("T")[0]}.png`
    link.href = canvas.toDataURL()
    link.click()

    toast({
      title: "Chart exportiert",
      description: "Die Kostenvorschau wurde als PNG gespeichert.",
    })
  }

  const toggleExplanation = async (messageId: string) => {
    const isExpanded = expandedExplanations.has(messageId)

    if (isExpanded) {
      setExpandedExplanations((prev) => {
        const newSet = new Set(prev)
        newSet.delete(messageId)
        return newSet
      })
    } else {
      setExpandedExplanations((prev) => new Set(prev).add(messageId))

      // Fetch explanation if not already loaded
      if (!explanations[messageId]) {
        try {
          const response = await fetch(`/api/mentor/explain?id=${messageId}`)
          const data = await response.json()
          setExplanations((prev) => ({
            ...prev,
            [messageId]: data.explanation,
          }))
        } catch (error) {
          toast({
            title: "Fehler",
            description: "Erklärung konnte nicht geladen werden.",
            variant: "destructive",
          })
        }
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Privacy Banner */}
      {showPrivacyBanner && (
        <div className="bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 text-white p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm">
                <strong>AI Mentor Datenschutz:</strong> Mentor-Eingaben werden nur zu Beratungszwecken verarbeitet. Du
                kannst jederzeit Opt-In/Opt-Out in den Einstellungen ändern.
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={handlePrivacyBannerAccept} className="ml-4">
              Verstanden
            </Button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="page-padding border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="py-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 bg-clip-text text-transparent">
              AI Mentor
            </h1>
            <p className="text-muted-foreground mt-2">
              Verbessere deine Agents und Prompts mit KI-gestützter Beratung, Optimierung und Best Practices.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 page-padding">
        <div className="max-w-7xl mx-auto py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Tools */}
            <div className="lg:col-span-2 space-y-8">
              {/* Mentor Chat */}
              <Card className="card-padding">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    AI Mentor Chat
                  </CardTitle>
                  <CardDescription>Frag mich nach Prompt-Tipps, Modellauswahl, Kosten oder Guardrails.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Chat Messages */}
                  <div className="h-80 overflow-y-auto space-y-4 p-4 bg-muted/30 rounded-lg">
                    {messages.map((message, index) => (
                      <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[80%] rounded-lg ${
                            message.role === "user"
                              ? "bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 text-white p-3"
                              : "bg-background border"
                          }`}
                        >
                          {message.role === "assistant" ? (
                            <div className="space-y-2">
                              <div className="flex items-start justify-between p-3">
                                <div className="flex-1">
                                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                  <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleExplanation(message.id)}
                                  className="ml-2 h-8 px-2 text-xs"
                                  aria-expanded={expandedExplanations.has(message.id)}
                                  aria-controls={`explanation-${message.id}`}
                                >
                                  {expandedExplanations.has(message.id) ? (
                                    <>
                                      Schließen <ChevronUp className="h-3 w-3 ml-1" />
                                    </>
                                  ) : (
                                    <>
                                      Erklären <ChevronDown className="h-3 w-3 ml-1" />
                                    </>
                                  )}
                                </Button>
                              </div>

                              {expandedExplanations.has(message.id) && (
                                <div
                                  id={`explanation-${message.id}`}
                                  className="mx-3 mb-3 p-3 bg-muted/50 rounded-lg border-l-4 border-blue-500 max-h-48 overflow-y-auto"
                                  tabIndex={0}
                                >
                                  <div className="flex items-start gap-2">
                                    <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                    <div className="text-sm text-muted-foreground">
                                      {explanations[message.id] ? (
                                        <p>{explanations[message.id]}</p>
                                      ) : (
                                        <div className="flex items-center gap-2">
                                          <div className="animate-spin h-3 w-3 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                                          <span>Lade Erklärung...</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="p-3">
                              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                              <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-background border p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="animate-spin h-4 w-4 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                            <span className="text-sm">Mentor denkt nach...</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Suggestion Chips */}
                  <div className="flex flex-wrap gap-2">
                    {suggestionChips.map((chip, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuggestionClick(chip)}
                        className="text-xs"
                      >
                        {chip}
                      </Button>
                    ))}
                  </div>

                  {/* Chat Input */}
                  <div className="flex gap-2">
                    <Input
                      ref={inputRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Frage den AI Mentor..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                          sendMessage(inputMessage)
                        }
                      }}
                      disabled={isLoading}
                    />
                    <Button
                      onClick={() => sendMessage(inputMessage)}
                      disabled={isLoading || !inputMessage.trim()}
                      className="bg-gradient-to-r from-purple-500 via-blue-500 to-green-500"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    <Shield className="h-3 w-3 inline mr-1" />
                    Mentor-Eingaben werden nur zu Beratungszwecken verarbeitet (Opt-In/Opt-Out in Einstellungen).
                  </p>
                </CardContent>
              </Card>

              {/* Prompt Optimizer */}
              <Card className="card-padding">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-blue-500" />
                    Prompt Optimizer
                  </CardTitle>
                  <CardDescription>
                    Verbessere deine Prompts für bessere Ergebnisse und niedrigere Kosten.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Aktueller Prompt *</label>
                    <Textarea
                      value={currentPrompt}
                      onChange={(e) => setCurrentPrompt(e.target.value)}
                      placeholder="Füge hier deinen aktuellen Prompt ein..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Optimierungsziele</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["kürzere Antworten", "weniger Kosten", "mehr Konsistenz", "besserer Ton/Marke"].map((goal) => (
                        <div key={goal} className="flex items-center space-x-2">
                          <Checkbox
                            id={goal}
                            checked={optimizationGoals.includes(goal)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setOptimizationGoals([...optimizationGoals, goal])
                              } else {
                                setOptimizationGoals(optimizationGoals.filter((g) => g !== goal))
                              }
                            }}
                          />
                          <label htmlFor={goal} className="text-sm">
                            {goal}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Kontext (optional)</label>
                    <Input
                      value={context}
                      onChange={(e) => setContext(e.target.value)}
                      placeholder="z.B. E-Commerce, B2B Sales, Kundenservice..."
                    />
                  </div>

                  <Button
                    onClick={handleOptimizePrompt}
                    disabled={isOptimizing || !currentPrompt.trim()}
                    className="w-full bg-gradient-to-r from-purple-500 via-blue-500 to-green-500"
                  >
                    {isOptimizing ? "Optimiere..." : "Optimieren"}
                  </Button>

                  {optimizationResult && (
                    <div className="mt-6">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleExportCSV}
                            className="text-xs bg-transparent"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Export als CSV
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleExportJSON}
                            className="text-xs bg-transparent"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Export als JSON
                          </Button>
                        </div>
                        <Button
                          onClick={() => setShowBuildModal(true)}
                          disabled={!optimizationResult?.improved}
                          className="bg-gradient-to-r from-purple-500 via-blue-500 to-green-500"
                        >
                          <Bot className="h-4 w-4 mr-2" />
                          Als Build übernehmen
                        </Button>
                      </div>

                      <Tabs value={activeOptimizerTab} onValueChange={setActiveOptimizerTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="original" aria-label="Original Prompt anzeigen">
                            Vorher
                          </TabsTrigger>
                          <TabsTrigger value="improved" aria-label="Optimierten Prompt anzeigen">
                            Vorschlag
                          </TabsTrigger>
                          <TabsTrigger value="diff" aria-label="Unterschiede zwischen Prompts anzeigen">
                            Diff
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="original" className="space-y-2">
                          <div className="bg-muted p-4 rounded-lg relative">
                            <div className="text-xs text-muted-foreground mb-2 font-mono">
                              Zeilen: {optimizationResult.original.split("\n").length} | Tokens: ~
                              {Math.ceil(optimizationResult.original.length / 4)}
                            </div>
                            <pre className="text-sm whitespace-pre-wrap font-mono leading-relaxed">
                              {optimizationResult.original}
                            </pre>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(optimizationResult.original)}
                            aria-label="Original Prompt kopieren"
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Kopieren
                          </Button>
                        </TabsContent>

                        <TabsContent value="improved" className="space-y-2">
                          <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800 relative">
                            <div className="text-xs text-muted-foreground mb-2 font-mono">
                              Zeilen: {optimizationResult.improved.split("\n").length} | Tokens: ~
                              {Math.ceil(optimizationResult.improved.length / 4)}
                            </div>
                            <pre className="text-sm whitespace-pre-wrap font-mono leading-relaxed">
                              {optimizationResult.improved}
                            </pre>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(optimizationResult.improved)}
                              aria-label="Optimierten Prompt kopieren"
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Kopieren
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setCurrentPrompt(optimizationResult.improved)
                                toast({
                                  title: "Gespeichert",
                                  description: "Neue Prompt-Version wurde übernommen.",
                                })
                              }}
                            >
                              Als neue Version speichern
                            </Button>
                          </div>
                        </TabsContent>

                        <TabsContent value="diff" className="space-y-2">
                          <div className="bg-muted p-4 rounded-lg relative max-h-96 overflow-y-auto">
                            <div className="text-xs text-muted-foreground mb-2 font-mono">
                              Diff-Ansicht | Grün: Hinzugefügt | Rot: Entfernt | Gelb: Geändert
                            </div>
                            <div className="space-y-1">
                              {calculateDiff(optimizationResult.original, optimizationResult.improved).map(
                                (line, index) => (
                                  <div key={index} className="flex">
                                    <div className="w-12 text-xs text-muted-foreground font-mono flex-shrink-0 pr-2 text-right">
                                      {line.lineNumber}
                                    </div>
                                    <div
                                      className={`flex-1 text-sm font-mono leading-relaxed px-2 py-0.5 rounded ${
                                        line.type === "added"
                                          ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                                          : line.type === "deleted"
                                            ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 line-through"
                                            : line.type === "modified"
                                              ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200"
                                              : "text-muted-foreground"
                                      }`}
                                    >
                                      {line.type === "added" && "+ "}
                                      {line.type === "deleted" && "- "}
                                      {line.content || " "}
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const diffText = calculateDiff(optimizationResult.original, optimizationResult.improved)
                                  .map(
                                    (line) =>
                                      `${line.type === "added" ? "+" : line.type === "deleted" ? "-" : " "} ${line.content}`,
                                  )
                                  .join("\n")
                                copyToClipboard(diffText)
                              }}
                              aria-label="Diff-Ansicht kopieren"
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Diff kopieren
                            </Button>
                            <Badge variant="secondary" className="text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Clientseitige Diff-Berechnung
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-medium">Verbesserungen:</h4>
                            <ul className="list-disc list-inside space-y-1">
                              {optimizationResult.improvements.map((improvement, index) => (
                                <li key={index} className="text-sm text-muted-foreground">
                                  {improvement}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Model & Cost Advisor */}
              <Card className="card-padding">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-500" />
                    Model & Cost Advisor
                  </CardTitle>
                  <CardDescription>
                    Erhalte Empfehlungen für das optimale Modell basierend auf deinen Anforderungen.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Priorität</label>
                      <Select
                        value={costInputs.goal}
                        onValueChange={(value) => setCostInputs({ ...costInputs, goal: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="quality">Qualität</SelectItem>
                          <SelectItem value="cost">Kosten</SelectItem>
                          <SelectItem value="latency">Latenz</SelectItem>
                          <SelectItem value="balance">Ausgewogen</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Bevorzugter Provider</label>
                      <Select
                        value={costInputs.provider}
                        onValueChange={(value) => setCostInputs({ ...costInputs, provider: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="openai">OpenAI</SelectItem>
                          <SelectItem value="anthropic">Anthropic</SelectItem>
                          <SelectItem value="mistral">Mistral</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Geschätzte Tokens pro Tag: {costInputs.tokensPerDay.toLocaleString()}
                    </label>
                    <Slider
                      value={[costInputs.tokensPerDay]}
                      onValueChange={([value]) => setCostInputs({ ...costInputs, tokensPerDay: value })}
                      max={100000}
                      min={100}
                      step={500}
                      className="w-full"
                    />
                  </div>

                  <Button
                    onClick={handleCalculateRecommendation}
                    disabled={isCalculating}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500"
                  >
                    {isCalculating ? "Berechne..." : "Empfehlung berechnen"}
                  </Button>

                  {modelRecommendation && (
                    <div className="mt-6 space-y-4">
                      <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                        <h4 className="font-medium mb-2">Empfohlenes Modell</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Modell</p>
                            <p className="font-medium">{modelRecommendation.model}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Kosten/Monat</p>
                            <p className="font-medium">${modelRecommendation.monthlyUSD.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Latenz</p>
                            <p className="font-medium">{modelRecommendation.latencyMs}ms</p>
                          </div>
                        </div>
                      </div>

                      {modelRecommendation.alternatives.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Alternativen</h4>
                          <div className="space-y-2">
                            {modelRecommendation.alternatives.map((alt, index) => (
                              <div key={index} className="bg-muted p-3 rounded-lg">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">{alt.model}</span>
                                  <span className="text-sm">${alt.monthlyUSD.toFixed(2)}/Monat</span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{alt.reason}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <Badge variant="secondary" className="w-fit">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Schätzung basierend auf aktuellen Preisen
                      </Badge>

                      <Card className="mt-6">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Kosten-Vorschau (30 Tage)</CardTitle>
                            <div className="flex items-center gap-2">
                              <Select
                                value={showModelComparison ? "show" : "hide"}
                                onValueChange={(value) => setShowModelComparison(value === "show")}
                              >
                                <SelectTrigger className="w-48">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="hide">Nur Empfehlung</SelectItem>
                                  <SelectItem value="show">Modellvergleich anzeigen</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={exportChartAsPNG}
                                className="flex items-center gap-2 bg-transparent"
                              >
                                <Download className="h-4 w-4" />
                                Chart als PNG
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div ref={setChartRef} className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={generateCostData()}>
                                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                <XAxis
                                  dataKey="day"
                                  label={{ value: "Tag", position: "insideBottom", offset: -5 }}
                                  className="text-xs"
                                />
                                <YAxis
                                  label={{ value: "USD", angle: -90, position: "insideLeft" }}
                                  className="text-xs"
                                />
                                <Tooltip
                                  formatter={(value: number, name: string) => [
                                    `$${value.toFixed(3)}`,
                                    name === "primary" ? modelRecommendation?.model : "Alternative",
                                  ]}
                                  labelFormatter={(day) => `Tag ${day}`}
                                  contentStyle={{
                                    backgroundColor: "hsl(var(--background))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "6px",
                                  }}
                                />
                                <Legend />
                                <Line
                                  type="monotone"
                                  dataKey="primary"
                                  stroke="#3b82f6"
                                  strokeWidth={2}
                                  name={modelRecommendation?.model || "Empfohlenes Modell"}
                                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 3 }}
                                />
                                {showModelComparison && (
                                  <Line
                                    type="monotone"
                                    dataKey="alternative"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                    name={modelRecommendation?.alternatives[0]?.model || "Alternative"}
                                    dot={{ fill: "#10b981", strokeWidth: 2, r: 3 }}
                                  />
                                )}
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="mt-4 text-sm text-muted-foreground">
                            <p>
                              * Kosten basieren auf geschätzten {costInputs.tokensPerDay.toLocaleString()} Tokens/Tag
                              mit ±10% Schwankung
                            </p>
                            <p>* Tatsächliche Kosten können je nach Nutzung variieren</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Troubleshooting & Guardrails */}
              <Card className="card-padding">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-orange-500" />
                    Troubleshooting & Guardrails
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Updated troubleshooting section with Quick-Fix buttons */}
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="troubleshooting">
                      <AccordionTrigger>Troubleshooting</AccordionTrigger>
                      <AccordionContent className="space-y-3">
                        {troubleshootingItems.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div>
                              <p className="font-medium">{item.issue}</p>
                              <p className="text-sm text-muted-foreground">{item.fix}</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuickFix(item)}
                              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 hover:from-blue-600 hover:to-purple-600"
                            >
                              Quick-Fix
                            </Button>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="guardrails">
                      <AccordionTrigger>Guardrails-Vorschläge</AccordionTrigger>
                      <AccordionContent className="space-y-3">
                        <div className="space-y-2">
                          {guardrailSuggestions.map((rule, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <Checkbox id={`rule-${index}`} />
                              <label htmlFor={`rule-${index}`} className="text-sm">
                                {rule}
                              </label>
                            </div>
                          ))}
                        </div>
                        <Button
                          onClick={handleGuardrailsApply}
                          className="w-full bg-gradient-to-r from-orange-500 to-red-500"
                        >
                          Regeln anwenden
                        </Button>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Resources */}
            <div className="space-y-6">
              {/* Best Practices */}
              <Card className="card-padding">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    Best Practices
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {bestPractices.map((practice, index) => (
                      <AccordionItem key={index} value={`practice-${index}`}>
                        <AccordionTrigger className="text-left">{practice.title}</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-sm text-muted-foreground">{practice.content}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>

              {/* Prompt Library */}
              <Card className="card-padding">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-500" />
                    Prompt Library
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Kategorie wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle Kategorien</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                      <SelectItem value="faq">FAQ</SelectItem>
                      <SelectItem value="research">Recherche</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="space-y-3">
                    {promptLibrary.map((prompt, index) => (
                      <div key={index} className="p-3 bg-muted rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{prompt.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {prompt.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{prompt.prompt}</p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => copyToClipboard(prompt.prompt)}>
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setCurrentPrompt(prompt.prompt)}>
                            In Optimizer laden
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Checklists */}
              <Card className="card-padding">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Checklisten
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="release">
                      <AccordionTrigger>Agent Release Checklist</AccordionTrigger>
                      <AccordionContent className="space-y-2">
                        {[
                          "Eval bestanden",
                          "Guardrails aktiv",
                          "Kosten unter Schwelle",
                          "Logging Opt-in geprüft",
                          "Datenschutz okay",
                        ].map((item, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Checkbox id={`release-${index}`} />
                            <label htmlFor={`release-${index}`} className="text-sm">
                              {item}
                            </label>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="dataset">
                      <AccordionTrigger>Dataset Eval Checklist</AccordionTrigger>
                      <AccordionContent className="space-y-2">
                        {[
                          "Balance vorhanden",
                          "Edge-Cases abgedeckt",
                          "Klare Expected Outputs",
                          "Regelmäßige Aktualisierung",
                        ].map((item, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Checkbox id={`dataset-${index}`} />
                            <label htmlFor={`dataset-${index}`} className="text-sm">
                              {item}
                            </label>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card className="card-padding">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ExternalLink className="h-5 w-5 text-purple-500" />
                    Quick Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Interne Links</h4>
                    {[
                      { name: "Build", href: "/build" },
                      { name: "Improve", href: "/improve" },
                      { name: "Bulk Tester", href: "/bulk-tester" },
                      { name: "Settings", href: "/settings" },
                    ].map((link, index) => (
                      <Button key={index} variant="ghost" size="sm" className="w-full justify-start" asChild>
                        <a href={link.href}>{link.name}</a>
                      </Button>
                    ))}
                  </div>

                  <div className="space-y-2 pt-4 border-t">
                    <h4 className="font-medium text-sm">Datenexport & -löschung</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start bg-transparent"
                      onClick={handleExportChats}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Mentor-Chat exportieren
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-red-600 hover:text-red-700 bg-transparent"
                      onClick={handleDeleteChats}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Alle Mentor-Chats löschen
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Build Adoption Modal */}
      <Dialog open={showBuildModal} onOpenChange={setShowBuildModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Als Build übernehmen</DialogTitle>
            <DialogDescription>
              Erstelle einen neuen Build oder aktualisiere einen bestehenden mit dem optimierten Prompt.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Build-Name *</label>
              <Input
                value={buildName}
                onChange={(e) => setBuildName(e.target.value)}
                placeholder="z.B. Kundenservice Agent v2.1"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Ziel-Agent</label>
              <Select value={targetAgent} onValueChange={setTargetAgent}>
                <SelectTrigger>
                  <SelectValue placeholder="Neuen Agent erstellen oder bestehenden wählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Neuen Agent erstellen</SelectItem>
                  <SelectItem value="agent-1">Kundenservice Agent</SelectItem>
                  <SelectItem value="agent-2">Sales Assistant</SelectItem>
                  <SelectItem value="agent-3">Support Bot</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Version Label (optional)</label>
              <Input
                value={versionLabel}
                onChange={(e) => setVersionLabel(e.target.value)}
                placeholder="z.B. v2.1, Beta, Production"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Notiz (optional)</label>
              <Textarea
                value={buildNotes}
                onChange={(e) => setBuildNotes(e.target.value)}
                placeholder="Beschreibung der Änderungen oder Verbesserungen..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBuildModal(false)}>
              Abbrechen
            </Button>
            <Button
              onClick={handleAdoptAsBuild}
              disabled={!buildName.trim()}
              className="bg-gradient-to-r from-purple-500 via-blue-500 to-green-500"
            >
              Übernehmen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={quickFixModal?.isOpen || false} onOpenChange={(open) => !open && setQuickFixModal(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Quick-Fix Vorschau</DialogTitle>
            <DialogDescription>Änderungen für: {quickFixModal?.item?.issue}</DialogDescription>
          </DialogHeader>

          {quickFixModal && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2 text-red-600 dark:text-red-400">Vorher</h4>
                  <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded-lg space-y-1 text-sm font-mono">
                    <div>MaxTokens: {quickFixModal.oldState.maxTokens}</div>
                    <div>Temperature: {quickFixModal.oldState.temperature}</div>
                    <div>Top-p: {quickFixModal.oldState.topP}</div>
                    <div>Model: {quickFixModal.oldState.model}</div>
                    <div>Regeln: {quickFixModal.oldState.rules.length}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2 text-green-600 dark:text-green-400">Nachher</h4>
                  <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg space-y-1 text-sm font-mono">
                    <div>MaxTokens: {quickFixModal.newState.maxTokens}</div>
                    <div>Temperature: {quickFixModal.newState.temperature}</div>
                    <div>Top-p: {quickFixModal.newState.topP}</div>
                    <div>Model: {quickFixModal.newState.model}</div>
                    <div>Regeln: {quickFixModal.newState.rules.length}</div>
                  </div>
                </div>
              </div>

              {quickFixModal.item.changes.rule && (
                <div>
                  <h4 className="font-medium mb-2">Neue Regel</h4>
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg text-sm">
                    + {quickFixModal.item.changes.rule}
                  </div>
                </div>
              )}

              {quickFixModal.item.changes.hint && (
                <div>
                  <h4 className="font-medium mb-2">Hinweis</h4>
                  <div className="bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-lg text-sm">
                    💡 {quickFixModal.item.changes.hint}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setQuickFixModal(null)}>
              Abbrechen
            </Button>
            <Button onClick={applyQuickFix} className="bg-gradient-to-r from-green-500 to-blue-500">
              Anwenden
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="border-t border-border page-padding mt-auto">
        <div className="max-w-7xl mx-auto py-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>© 2024 buildro.ai - AI Agent Platform</p>
            <div className="flex items-center gap-4">
              <a href="/datenschutz" className="hover:text-foreground">
                Datenschutz
              </a>
              <a href="/ai-act" className="hover:text-foreground">
                EU AI Act
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
