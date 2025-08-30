"use client"

import type React from "react"

import { useState, useMemo, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Search,
  Plus,
  Star,
  Download,
  ShoppingCart,
  Upload,
  DollarSign,
  Bot,
  Zap,
  MessageSquare,
  BarChart3,
  ImageIcon,
  FileText,
  Eye,
  AlertCircle,
  CheckCircle,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { BackButton } from "@/components/ui/back-button"

// Mock data for marketplace agents
const mockAgents = [
  {
    id: "1",
    title: "Customer Support Pro",
    description:
      "Ein fortschrittlicher KI-Agent für professionellen Kundensupport mit Multi-Sprach-Unterstützung und Ticket-Management.",
    price: 1299,
    rating: 4.8,
    downloads: 1247,
    image: "/customer-support-robot.png",
    category: "Support",
    author: "buildro.ai",
    features: ["24/7 Support", "Multi-Language", "Ticket Integration"],
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Sales Assistant Elite",
    description:
      "Maximiere deine Verkaufsergebnisse mit diesem intelligenten Sales-Agent, der Leads qualifiziert und Deals abschließt.",
    price: 2499,
    rating: 4.9,
    downloads: 892,
    image: "/sales-robot-assistant.png",
    category: "Sales",
    author: "buildro.ai",
    features: ["Lead Qualification", "CRM Integration", "Deal Closing"],
    createdAt: "2024-01-20",
  },
  {
    id: "3",
    title: "Content Creator Bot",
    description:
      "Erstelle hochwertige Inhalte für Social Media, Blogs und Marketing-Kampagnen mit diesem kreativen KI-Agent.",
    price: 1899,
    rating: 4.7,
    downloads: 2156,
    image: "/content-creator-robot.png",
    category: "Marketing",
    author: "buildro.ai",
    features: ["SEO Optimized", "Multi-Platform", "Brand Voice"],
    createdAt: "2024-01-10",
  },
  {
    id: "4",
    title: "Data Analyst Pro",
    description: "Analysiere komplexe Datensets und erstelle aussagekräftige Reports mit diesem analytischen KI-Agent.",
    price: 4999,
    rating: 4.6,
    downloads: 634,
    image: "/data-analyst-robot.png",
    category: "Analytics",
    author: "buildro.ai",
    features: ["Advanced Analytics", "Report Generation", "Data Visualization"],
    createdAt: "2024-01-25",
  },
  {
    id: "5",
    title: "HR Assistant",
    description: "Automatisiere HR-Prozesse mit diesem intelligenten Agent für Recruiting und Mitarbeiterverwaltung.",
    price: 1299,
    rating: 4.5,
    downloads: 456,
    image: "/hr-robot-assistant.png",
    category: "HR",
    author: "buildro.ai",
    features: ["Resume Screening", "Interview Scheduling", "Employee Onboarding"],
    createdAt: "2024-01-30",
  },
  {
    id: "6",
    title: "Finance Bot",
    description: "Verwalte Finanzen und erstelle Berichte mit diesem spezialisierten Finanz-Agent.",
    price: 3999,
    rating: 4.4,
    downloads: 234,
    image: "/finance-robot-calculator.png",
    category: "Finance",
    author: "buildro.ai",
    features: ["Budget Planning", "Expense Tracking", "Financial Reports"],
    createdAt: "2024-02-01",
  },
]

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("downloads")
  const [priceRange, setPriceRange] = useState([0, 50])
  const [minRating, setMinRating] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const [newAgent, setNewAgent] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
    category: "",
    features: "",
    tags: "",
    documentation: "",
    apiAccess: "",
    downloadLink: "",
    requirements: "",
    supportEmail: "",
    version: "1.0.0",
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStep, setUploadStep] = useState(1)
  const [previewMode, setPreviewMode] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredAndSortedAgents = useMemo(() => {
    const filtered = mockAgents.filter((agent) => {
      const matchesSearch =
        agent.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.category.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategory === "all" || agent.category === selectedCategory
      const matchesPrice = agent.price >= priceRange[0] * 100 && agent.price <= priceRange[1] * 100
      const matchesRating = agent.rating >= minRating

      return matchesSearch && matchesCategory && matchesPrice && matchesRating
    })

    // Sort agents
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "downloads":
        default:
          return b.downloads - a.downloads
      }
    })

    return filtered
  }, [searchQuery, selectedCategory, sortBy, priceRange, minRating])

  const totalPages = Math.ceil(filteredAndSortedAgents.length / itemsPerPage)
  const paginatedAgents = filteredAndSortedAgents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const categories = ["all", ...Array.from(new Set(mockAgents.map((agent) => agent.category)))]

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1) // Reset to first page when searching
  }

  const handlePurchase = async (agent: (typeof mockAgents)[0]) => {
    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agentId: agent.id,
          agentTitle: agent.title,
          price: agent.price,
          image: agent.image,
        }),
      })

      const { sessionId, checkoutUrl } = await response.json()

      if (checkoutUrl) {
        // Redirect to Stripe checkout (in real implementation)
        // For demo, we'll simulate the checkout process
        toast({
          title: "Weiterleitung zu Stripe...",
          description: "Du wirst zur sicheren Zahlungsseite weitergeleitet.",
        })

        // Simulate checkout delay
        setTimeout(() => {
          window.location.href = `/marketplace/checkout/success?session_id=${sessionId}&agent_id=${agent.id}`
        }, 2000)
      }
    } catch (error) {
      toast({
        title: "Fehler beim Checkout",
        description: "Es gab einen Fehler beim Starten des Zahlungsprozesses. Bitte versuche es erneut.",
        variant: "destructive",
      })
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!newAgent.title.trim()) errors.title = "Titel ist erforderlich"
    if (!newAgent.description.trim()) errors.description = "Beschreibung ist erforderlich"
    if (!newAgent.price || Number.parseFloat(newAgent.price) <= 0) errors.price = "Gültiger Preis ist erforderlich"
    if (!newAgent.category.trim()) errors.category = "Kategorie ist erforderlich"
    if (!newAgent.features.trim()) errors.features = "Features sind erforderlich"
    if (!newAgent.downloadLink.trim()) errors.downloadLink = "Download-Link ist erforderlich"
    if (!newAgent.supportEmail.trim() || !newAgent.supportEmail.includes("@")) {
      errors.supportEmail = "Gültige Support-E-Mail ist erforderlich"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast({
          title: "Datei zu groß",
          description: "Bitte wähle ein Bild unter 5MB.",
          variant: "destructive",
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setNewAgent({ ...newAgent, image: e.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAdminUpload = async () => {
    if (!validateForm()) {
      toast({
        title: "Formular unvollständig",
        description: "Bitte fülle alle erforderlichen Felder aus.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    // Mock API call with delay
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Agent erfolgreich hochgeladen!",
        description: `${newAgent.title} wurde zum Marketplace hinzugefügt und wird in Kürze überprüft.`,
      })

      setIsAdminModalOpen(false)
      setNewAgent({
        title: "",
        description: "",
        price: "",
        image: "",
        category: "",
        features: "",
        tags: "",
        documentation: "",
        apiAccess: "",
        downloadLink: "",
        requirements: "",
        supportEmail: "",
        version: "1.0.0",
      })
      setFormErrors({})
      setUploadStep(1)
      setPreviewMode(false)
    } catch (error) {
      toast({
        title: "Upload fehlgeschlagen",
        description: "Es gab einen Fehler beim Hochladen. Bitte versuche es erneut.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Support":
        return <MessageSquare className="h-4 w-4" />
      case "Sales":
        return <DollarSign className="h-4 w-4" />
      case "Marketing":
        return <Zap className="h-4 w-4" />
      case "Analytics":
        return <BarChart3 className="h-4 w-4" />
      case "HR":
        return <Bot className="h-4 w-4" />
      case "Finance":
        return <DollarSign className="h-4 w-4" />
      default:
        return <Bot className="h-4 w-4" />
    }
  }

  const AgentPreview = () => (
    <Card className="card-container">
      <CardHeader className="pb-3">
        <div className="aspect-video relative mb-3 rounded-lg overflow-hidden bg-muted">
          {newAgent.image ? (
            <img
              src={newAgent.image || "/placeholder.svg"}
              alt={newAgent.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          {newAgent.category && (
            <Badge className="absolute top-2 left-2 bg-background/80 text-foreground">
              {getCategoryIcon(newAgent.category)}
              <span className="ml-1">{newAgent.category}</span>
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg">{newAgent.title || "Agent Titel"}</CardTitle>
        <CardDescription className="text-sm">{newAgent.description || "Agent Beschreibung"}</CardDescription>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">Neu</span>
          </div>
          <div className="flex items-center space-x-1 text-muted-foreground">
            <Download className="h-4 w-4" />
            <span className="text-sm">0</span>
          </div>
        </div>

        {newAgent.features && (
          <div className="flex flex-wrap gap-1 mb-3">
            {newAgent.features
              .split(",")
              .slice(0, 2)
              .map((feature, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {feature.trim()}
                </Badge>
              ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">BA</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">buildro.ai</span>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">
              €{newAgent.price ? Number.parseFloat(newAgent.price).toLocaleString() : "0"}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button className="w-full bg-gradient-accent text-white" disabled>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Vorschau
        </Button>
      </CardFooter>
    </Card>
  )

  return (
    <div className="page-container">
      <BackButton href="/" />

      {/* Header */}
      <div className="flex flex-col space-y-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Marketplace</h1>
            <p className="text-muted-foreground mt-2">Entdecke und kaufe professionelle KI-Agenten für dein Business</p>
          </div>

          {/* Admin Upload Button */}
          <Dialog open={isAdminModalOpen} onOpenChange={setIsAdminModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-accent text-white hover:bg-gradient-accent/90 shadow-glow">
                <Plus className="h-4 w-4 mr-2" />
                Agent hochladen
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Neuen Agent hochladen</DialogTitle>
                <DialogDescription>
                  Füge einen neuen KI-Agent zum Marketplace hinzu. Alle Felder mit * sind erforderlich.
                </DialogDescription>
              </DialogHeader>

              <Tabs value={previewMode ? "preview" : "form"} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="form" onClick={() => setPreviewMode(false)}>
                    <FileText className="h-4 w-4 mr-2" />
                    Formular
                  </TabsTrigger>
                  <TabsTrigger value="preview" onClick={() => setPreviewMode(true)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Vorschau
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="form" className="space-y-6 mt-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Grundinformationen</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Titel*</Label>
                        <Input
                          id="title"
                          value={newAgent.title}
                          onChange={(e) => setNewAgent({ ...newAgent, title: e.target.value })}
                          placeholder="Agent Name"
                          className={formErrors.title ? "border-red-500" : ""}
                        />
                        {formErrors.title && (
                          <p className="text-sm text-red-500 flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {formErrors.title}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="version">Version</Label>
                        <Input
                          id="version"
                          value={newAgent.version}
                          onChange={(e) => setNewAgent({ ...newAgent, version: e.target.value })}
                          placeholder="1.0.0"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Beschreibung*</Label>
                      <Textarea
                        id="description"
                        value={newAgent.description}
                        onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })}
                        placeholder="Detaillierte Beschreibung des Agents"
                        rows={4}
                        className={formErrors.description ? "border-red-500" : ""}
                      />
                      {formErrors.description && (
                        <p className="text-sm text-red-500 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {formErrors.description}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Preis (€)*</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={newAgent.price}
                          onChange={(e) => setNewAgent({ ...newAgent, price: e.target.value })}
                          placeholder="29.99"
                          className={formErrors.price ? "border-red-500" : ""}
                        />
                        {formErrors.price && (
                          <p className="text-sm text-red-500 flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {formErrors.price}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Kategorie*</Label>
                        <Select
                          value={newAgent.category}
                          onValueChange={(value) => setNewAgent({ ...newAgent, category: value })}
                        >
                          <SelectTrigger className={formErrors.category ? "border-red-500" : ""}>
                            <SelectValue placeholder="Kategorie wählen" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Support">Support</SelectItem>
                            <SelectItem value="Sales">Sales</SelectItem>
                            <SelectItem value="Marketing">Marketing</SelectItem>
                            <SelectItem value="Analytics">Analytics</SelectItem>
                            <SelectItem value="HR">HR</SelectItem>
                            <SelectItem value="Finance">Finance</SelectItem>
                          </SelectContent>
                        </Select>
                        {formErrors.category && (
                          <p className="text-sm text-red-500 flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {formErrors.category}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Agent Bild</h3>
                    <div className="space-y-2">
                      <Label>Bild hochladen</Label>
                      <div className="flex items-center space-x-4">
                        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Bild auswählen
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        {newAgent.image && (
                          <div className="flex items-center text-sm text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Bild hochgeladen
                          </div>
                        )}
                      </div>
                      {newAgent.image && (
                        <div className="mt-2">
                          <img
                            src={newAgent.image || "/placeholder.svg"}
                            alt="Preview"
                            className="w-32 h-20 object-cover rounded"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Features and Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Features & Details</h3>
                    <div className="space-y-2">
                      <Label htmlFor="features">Features* (kommagetrennt)</Label>
                      <Input
                        id="features"
                        value={newAgent.features}
                        onChange={(e) => setNewAgent({ ...newAgent, features: e.target.value })}
                        placeholder="24/7 Support, Multi-Language, API Integration"
                        className={formErrors.features ? "border-red-500" : ""}
                      />
                      {formErrors.features && (
                        <p className="text-sm text-red-500 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {formErrors.features}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags (kommagetrennt)</Label>
                      <Input
                        id="tags"
                        value={newAgent.tags}
                        onChange={(e) => setNewAgent({ ...newAgent, tags: e.target.value })}
                        placeholder="AI, Automation, Customer Service"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="requirements">Systemanforderungen</Label>
                      <Textarea
                        id="requirements"
                        value={newAgent.requirements}
                        onChange={(e) => setNewAgent({ ...newAgent, requirements: e.target.value })}
                        placeholder="Node.js 18+, 2GB RAM, API Key erforderlich"
                        rows={2}
                      />
                    </div>
                  </div>

                  {/* Technical Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Technische Details</h3>
                    <div className="space-y-2">
                      <Label htmlFor="downloadLink">Download/API Link*</Label>
                      <Input
                        id="downloadLink"
                        value={newAgent.downloadLink}
                        onChange={(e) => setNewAgent({ ...newAgent, downloadLink: e.target.value })}
                        placeholder="https://api.buildro.ai/agents/download/..."
                        className={formErrors.downloadLink ? "border-red-500" : ""}
                      />
                      {formErrors.downloadLink && (
                        <p className="text-sm text-red-500 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {formErrors.downloadLink}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="apiAccess">API Zugang</Label>
                      <Textarea
                        id="apiAccess"
                        value={newAgent.apiAccess}
                        onChange={(e) => setNewAgent({ ...newAgent, apiAccess: e.target.value })}
                        placeholder="REST API Endpoints, Webhook URLs, etc."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="documentation">Dokumentation</Label>
                      <Textarea
                        id="documentation"
                        value={newAgent.documentation}
                        onChange={(e) => setNewAgent({ ...newAgent, documentation: e.target.value })}
                        placeholder="Setup-Anleitung, API-Dokumentation, Beispiele"
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="supportEmail">Support E-Mail*</Label>
                      <Input
                        id="supportEmail"
                        type="email"
                        value={newAgent.supportEmail}
                        onChange={(e) => setNewAgent({ ...newAgent, supportEmail: e.target.value })}
                        placeholder="support@example.com"
                        className={formErrors.supportEmail ? "border-red-500" : ""}
                      />
                      {formErrors.supportEmail && (
                        <p className="text-sm text-red-500 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {formErrors.supportEmail}
                        </p>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="preview" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Agent Vorschau</h3>
                    <div className="max-w-sm mx-auto">
                      <AgentPreview />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms" className="text-sm">
                    Ich akzeptiere die Marketplace-Richtlinien
                  </Label>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setIsAdminModalOpen(false)} disabled={isUploading}>
                    Abbrechen
                  </Button>
                  <Button onClick={handleAdminUpload} disabled={isUploading} className="bg-gradient-accent text-white">
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Wird hochgeladen...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Hochladen
                      </>
                    )}
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Agenten durchsuchen..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Kategorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Kategorien</SelectItem>
              {categories
                .filter((cat) => cat !== "all")
                .map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          {/* Sort Options */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sortieren" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="downloads">Meist heruntergeladen</SelectItem>
              <SelectItem value="rating">Beste Bewertung</SelectItem>
              <SelectItem value="price-low">Preis: Niedrig → Hoch</SelectItem>
              <SelectItem value="price-high">Preis: Hoch → Niedrig</SelectItem>
              <SelectItem value="newest">Neueste zuerst</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 p-4 bg-muted/30 rounded-lg">
          <div className="flex-1">
            <Label className="text-sm font-medium mb-2 block">
              Preisbereich: €{priceRange[0] * 100} - €{priceRange[1] * 100}
            </Label>
            <Slider value={priceRange} onValueChange={setPriceRange} max={50} min={7} step={1} className="w-full" />
          </div>
          <div className="flex-1">
            <Label className="text-sm font-medium mb-2 block">Mindestbewertung: {minRating} Sterne</Label>
            <Slider
              value={[minRating]}
              onValueChange={(value) => setMinRating(value[0])}
              max={5}
              min={0}
              step={0.1}
              className="w-full"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setPriceRange([0, 50])
              setMinRating(0)
              setSelectedCategory("all")
              setSearchQuery("")
              setCurrentPage(1)
            }}
          >
            Filter zurücksetzen
          </Button>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {filteredAndSortedAgents.length} Agent{filteredAndSortedAgents.length !== 1 ? "en" : ""} gefunden
          </span>
          {totalPages > 1 && (
            <span>
              Seite {currentPage} von {totalPages}
            </span>
          )}
        </div>
      </div>

      {/* Agent Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {paginatedAgents.map((agent) => (
          <Card key={agent.id} className="card-container hover:shadow-lg transition-all duration-200 hover-scale">
            <CardHeader className="pb-3">
              <div className="aspect-video relative mb-3 rounded-lg overflow-hidden bg-muted">
                <img src={agent.image || "/placeholder.svg"} alt={agent.title} className="w-full h-full object-cover" />
                <Badge className="absolute top-2 left-2 bg-background/80 text-foreground">
                  {getCategoryIcon(agent.category)}
                  <span className="ml-1">{agent.category}</span>
                </Badge>
              </div>
              <CardTitle className="text-lg">{agent.title}</CardTitle>
              <CardDescription className="text-sm line-clamp-2">{agent.description}</CardDescription>
            </CardHeader>

            <CardContent className="pb-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{agent.rating}</span>
                </div>
                <div className="flex items-center space-x-1 text-muted-foreground">
                  <Download className="h-4 w-4" />
                  <span className="text-sm">{agent.downloads}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {agent.features.slice(0, 2).map((feature, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
                {agent.features.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{agent.features.length - 2}
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">BA</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">{agent.author}</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">€{agent.price.toLocaleString()}</div>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button
                onClick={() => handlePurchase(agent)}
                className="w-full bg-gradient-accent text-white hover:bg-gradient-accent/90 shadow-glow"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Jetzt kaufen
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mb-8">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Zurück
          </Button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
            if (pageNum > totalPages) return null

            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                onClick={() => setCurrentPage(pageNum)}
                className={currentPage === pageNum ? "bg-gradient-accent text-white" : ""}
              >
                {pageNum}
              </Button>
            )
          })}

          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Weiter
          </Button>
        </div>
      )}

      {paginatedAgents.length === 0 && (
        <div className="text-center py-12">
          <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Keine Agenten gefunden</h3>
          <p className="text-muted-foreground">Versuche einen anderen Suchbegriff oder passe deine Filter an.</p>
        </div>
      )}
    </div>
  )
}
