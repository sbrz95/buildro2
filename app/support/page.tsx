"use client"

import type React from "react"
import Link from "next/link"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useToast } from "@/hooks/use-toast"
import {
  ChevronDownIcon,
  QuestionMarkCircleIcon,
  DocumentTextIcon,
  CodeBracketIcon,
  ChatBubbleLeftRightIcon,
  PlayIcon,
  UserGroupIcon,
  TicketIcon,
  ClockIcon,
  PaperClipIcon,
  XMarkIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline"

const faqs = [
  {
    question: "Wie verbinde ich einen neuen Agenten?",
    answer:
      "Um einen neuen Agenten zu verbinden, gehen Sie zu 'Build' → 'Neue Build erstellen' und folgen Sie dem 4-stufigen Wizard. Wählen Sie zunächst den Agenten-Typ, konfigurieren Sie die Modell-Einstellungen, definieren Sie die Persönlichkeit und überprüfen Sie alle Einstellungen vor der Erstellung.",
  },
  {
    question: "Wie nutze ich die Bulk Test Funktion?",
    answer:
      "Die Bulk Test Funktion finden Sie unter 'Bulk Tester'. Wählen Sie zwischen OpenAI Assistant oder Chat Completion, konfigurieren Sie Ihre Test-Parameter, generieren Sie Testfragen mit KI-Unterstützung und starten Sie die Evaluation. Die Ergebnisse werden in Echtzeit angezeigt.",
  },
  {
    question: "Wie ändere ich mein Abo oder meine Zahlungsdaten?",
    answer:
      "Gehen Sie zu 'Einstellungen' → 'Abo & Abrechnung'. Dort können Sie Ihr aktuelles Abonnement verwalten, Zahlungsmethoden hinzufügen oder ändern und Ihre Rechnungshistorie einsehen. Änderungen werden sofort wirksam.",
  },
  {
    question: "Wie sichere ich meine Daten DSGVO-konform?",
    answer:
      "buildro.ai ist vollständig DSGVO-konform. In den Einstellungen können Sie Ihre Datenschutz-Präferenzen verwalten, Daten exportieren oder löschen lassen. Alle Verarbeitungen erfolgen nur mit Ihrer Einwilligung und werden transparent dokumentiert.",
  },
  {
    question: "Wie erstelle ich eine Demo für Kunden?",
    answer:
      "Unter 'Demo' können Sie kundenfreundliche Vorschauen Ihrer Agenten erstellen. Wählen Sie den gewünschten Agenten, konfigurieren Sie das Branding und die Nachrichten, und teilen Sie den generierten Link oder Embed-Code mit Ihren Kunden.",
  },
  {
    question: "Was bedeuten die verschiedenen Agenten-Status?",
    answer:
      "Aktiv: Agent ist einsatzbereit und verarbeitet Anfragen. Inaktiv: Agent ist pausiert. Training: Agent wird gerade optimiert. Fehler: Es liegt ein Konfigurationsproblem vor, das behoben werden muss.",
  },
]

const guides = [
  {
    title: "Video-Tutorials",
    description: "Schritt-für-Schritt Anleitungen",
    icon: PlayIcon,
    link: "#",
  },
  {
    title: "Dokumentation",
    description: "Vollständige Plattform-Dokumentation",
    icon: DocumentTextIcon,
    link: "#",
  },
  {
    title: "API-Dokumentation",
    description: "Entwickler-Ressourcen und API-Referenz",
    icon: CodeBracketIcon,
    link: "#",
  },
  {
    title: "Community Forum",
    description: "Austausch mit anderen Nutzern",
    icon: UserGroupIcon,
    link: "#",
  },
]

const mockChatMessages = [{ role: "assistant", content: "Hallo 👋, wie kann ich dir heute helfen?" }]

export default function SupportPage() {
  const [openFaqs, setOpenFaqs] = useState<number[]>([])
  const [ticketForm, setTicketForm] = useState({
    name: "",
    email: "",
    subject: "",
    description: "",
    gdprConsent: false,
  })
  const [attachments, setAttachments] = useState<File[]>([])
  const [chatMessages, setChatMessages] = useState([
    { role: "assistant" as const, content: "Hallo 👋, wie kann ich dir heute helfen?" },
  ])
  const [chatInput, setChatInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isChatTyping, setIsChatTyping] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const toggleFaq = (index: number) => {
    setOpenFaqs((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments((prev) => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ticketForm.gdprConsent) {
      toast({
        title: "Datenschutz-Einwilligung erforderlich",
        description: "Bitte stimmen Sie der Datenverarbeitung zu.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...ticketForm,
          attachments: attachments.map((f) => f.name),
        }),
      })

      if (response.ok) {
        toast({
          title: "Ticket erfolgreich erstellt",
          description: "Wir werden uns schnellstmöglich bei Ihnen melden.",
        })
        setTicketForm({ name: "", email: "", subject: "", description: "", gdprConsent: false })
        setAttachments([])
      }
    } catch (error) {
      toast({
        title: "Fehler beim Erstellen des Tickets",
        description: "Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    const userMessage = { role: "user" as const, content: chatInput }
    setChatMessages((prev) => [...prev, userMessage])
    const currentInput = chatInput
    setChatInput("")
    setIsChatTyping(true)

    try {
      const response = await fetch("/api/support/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentInput }),
      })

      const data = await response.json()

      // Simulate typing delay
      setTimeout(() => {
        setChatMessages((prev) => [...prev, { role: "assistant", content: data.response }])
        setIsChatTyping(false)
      }, 1500)
    } catch (error) {
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Entschuldigung, ich konnte deine Nachricht nicht verarbeiten. Bitte versuche es erneut oder erstelle ein Support-Ticket.",
          },
        ])
        setIsChatTyping(false)
      }, 1500)
    }
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

  return (
    <div className="min-h-screen flex flex-col">
      <div className="page-container pt-4 pb-2">
        <Link href="/">
          <Button variant="ghost" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeftIcon className="h-4 w-4" />
            Zurück zur Startseite
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="page-container mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Support & Hilfe</h1>
        <p className="text-muted-foreground">
          Hier findest du Antworten, Guides und direkten Kontakt zum Support-Team.
        </p>
      </div>

      {/* AI Support Agent - Compact Top Widget */}
      <div className="page-container mb-6">
        <Card className="card-container">
          <CardHeader className="card-header pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="relative">
                <ChatBubbleLeftRightIcon className="h-5 w-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              AI Support Agent
              <span className="text-sm font-normal text-muted-foreground">- Sofortige Hilfe</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="card-content">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Chat Messages - Compact */}
              <div className="lg:col-span-2">
                <div className="h-32 overflow-y-auto space-y-2 p-3 bg-muted/20 rounded-lg mb-3">
                  {chatMessages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] p-2 rounded-lg text-sm ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 text-white"
                            : "bg-background border border-border"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}

                  {isChatTyping && (
                    <div className="flex justify-start">
                      <div className="bg-background border border-border p-2 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div
                            className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <form onSubmit={handleChatSubmit} className="flex gap-2">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Schreibe deine Nachricht..."
                    className="flex-1"
                    disabled={isChatTyping}
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 text-white px-4"
                    disabled={isChatTyping || !chatInput.trim()}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </Button>
                </form>
              </div>

              {/* Quick Info */}
              <div className="space-y-3">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Schnelle Hilfe verfügbar</p>
                  <div className="flex justify-center space-x-4">
                    <div className="text-center">
                      <p className="text-lg font-semibold text-green-600">Online</p>
                      <p className="text-xs text-muted-foreground">Status</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold">~30s</p>
                      <p className="text-xs text-muted-foreground">Antwortzeit</p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  🔒 DSGVO-konform: Chats werden nach 24h gelöscht
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content - takes remaining space */}
      <div className="flex-1 page-container">
        <div className="space-y-8">
          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="card-container">
              <CardContent className="card-content">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Support-Anfragen offen</p>
                    <p className="text-2xl font-bold text-foreground">3</p>
                  </div>
                  <TicketIcon className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-container">
              <CardContent className="card-content">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Ø Antwortzeit</p>
                    <p className="text-2xl font-bold text-foreground">2.4h</p>
                  </div>
                  <ClockIcon className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <Card className="card-container">
            <CardHeader className="card-header">
              <CardTitle className="flex items-center gap-2">
                <QuestionMarkCircleIcon className="h-5 w-5" />
                Häufig gestellte Fragen
              </CardTitle>
              <CardDescription>Antworten auf die wichtigsten Fragen zur Nutzung von buildro.ai</CardDescription>
            </CardHeader>
            <CardContent className="card-content">
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <Collapsible key={index} open={openFaqs.includes(index)} onOpenChange={() => toggleFaq(index)}>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="w-full justify-between p-4 h-auto text-left">
                        <span className="font-medium">{faq.question}</span>
                        <ChevronDownIcon
                          className={`h-4 w-4 transition-transform ${openFaqs.includes(index) ? "rotate-180" : ""}`}
                        />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-4 pb-4">
                      <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Guides & Resources */}
          <Card className="card-container">
            <CardHeader className="card-header">
              <CardTitle>Guides & Ressourcen</CardTitle>
              <CardDescription>Hilfreiche Materialien und Dokumentationen</CardDescription>
            </CardHeader>
            <CardContent className="card-content">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {guides.map((guide, index) => (
                  <Card key={index} className="card-container hover:shadow-md transition-shadow">
                    <CardContent className="card-content">
                      <div className="flex items-start gap-3">
                        <guide.icon className="h-6 w-6 text-blue-500 mt-1" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">{guide.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{guide.description}</p>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 text-white"
                          >
                            Öffnen
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card className="card-container">
            <CardHeader className="card-header">
              <CardTitle>Support-Ticket erstellen</CardTitle>
              <CardDescription>
                Beschreiben Sie Ihr Anliegen detailliert, damit wir Ihnen schnell helfen können
              </CardDescription>
            </CardHeader>
            <CardContent className="card-content">
              <form onSubmit={handleTicketSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-section">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={ticketForm.name}
                      onChange={(e) => setTicketForm((prev) => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-section">
                    <Label htmlFor="email">E-Mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={ticketForm.email}
                      onChange={(e) => setTicketForm((prev) => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="form-section">
                  <Label htmlFor="subject">Betreff *</Label>
                  <Input
                    id="subject"
                    value={ticketForm.subject}
                    onChange={(e) => setTicketForm((prev) => ({ ...prev, subject: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-section">
                  <Label htmlFor="description">Beschreibung *</Label>
                  <Textarea
                    id="description"
                    rows={5}
                    value={ticketForm.description}
                    onChange={(e) => setTicketForm((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Beschreiben Sie Ihr Problem oder Ihre Frage so detailliert wie möglich..."
                    required
                  />
                </div>

                <div className="form-section">
                  <Label htmlFor="attachments">Anhänge (Screenshots, Dateien)</Label>
                  <Input
                    id="attachments"
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    accept="image/*,.pdf,.doc,.docx,.txt"
                  />
                  {attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                          <div className="flex items-center gap-2">
                            <PaperClipIcon className="h-4 w-4" />
                            <span className="text-sm">{file.name}</span>
                          </div>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeAttachment(index)}>
                            <XMarkIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="form-section">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="gdpr"
                      checked={ticketForm.gdprConsent}
                      onCheckedChange={(checked) =>
                        setTicketForm((prev) => ({ ...prev, gdprConsent: checked as boolean }))
                      }
                    />
                    <Label htmlFor="gdpr" className="text-sm leading-relaxed">
                      Ich stimme der Verarbeitung meiner Daten zur Bearbeitung dieser Anfrage zu. Ihre Daten werden
                      vertraulich behandelt und nur zur Bearbeitung der Anfrage verwendet.
                    </Label>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 text-white"
                >
                  {isSubmitting ? "Wird erstellt..." : "Ticket erstellen"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
