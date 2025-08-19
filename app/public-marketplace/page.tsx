"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Search, Star, Download, ShoppingCart, DollarSign, Bot, Zap, MessageSquare, BarChart3 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import Link from "next/link"

const mockAgents = [
  {
    id: "1",
    title: "Customer Support Pro",
    description:
      "Ein fortschrittlicher KI-Agent für professionellen Kundensupport mit Multi-Sprach-Unterstützung und Ticket-Management.",
    price: 29.99,
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
    price: 49.99,
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
    price: 39.99,
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
    price: 59.99,
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
    price: 34.99,
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
    price: 79.99,
    rating: 4.4,
    downloads: 234,
    image: "/finance-robot-calculator.png",
    category: "Finance",
    author: "buildro.ai",
    features: ["Budget Planning", "Expense Tracking", "Financial Reports"],
    createdAt: "2024-02-01",
  },
]

export default function PublicMarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("downloads")
  const [priceRange, setPriceRange] = useState([0, 100])
  const [minRating, setMinRating] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const filteredAndSortedAgents = useMemo(() => {
    const filtered = mockAgents.filter((agent) => {
      const matchesSearch =
        agent.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.category.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategory === "all" || agent.category === selectedCategory
      const matchesPrice = agent.price >= priceRange[0] && agent.price <= priceRange[1]
      const matchesRating = agent.rating >= minRating

      return matchesSearch && matchesCategory && matchesPrice && matchesRating
    })

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
    setCurrentPage(1)
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
        toast({
          title: "Weiterleitung zu Stripe...",
          description: "Du wirst zur sicheren Zahlungsseite weitergeleitet.",
        })

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

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-6 mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">KI-Agenten Marketplace</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Entdecke und kaufe professionelle KI-Agenten für dein Business. Sofort einsatzbereit und vollständig
              konfiguriert.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1 max-w-md mx-auto lg:mx-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Agenten durchsuchen..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
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
          </div>

          <div className="flex flex-col lg:flex-row gap-6 p-4 bg-muted/30 rounded-lg">
            <div className="flex-1">
              <Label className="text-sm font-medium mb-2 block">
                Preisbereich: €{priceRange[0]} - €{priceRange[1]}
              </Label>
              <Slider value={priceRange} onValueChange={setPriceRange} max={100} min={0} step={5} className="w-full" />
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
                setPriceRange([0, 100])
                setMinRating(0)
                setSelectedCategory("all")
                setSearchQuery("")
                setCurrentPage(1)
              }}
            >
              Filter zurücksetzen
            </Button>
          </div>

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {paginatedAgents.map((agent) => (
            <Card key={agent.id} className="card-container hover:shadow-lg transition-all duration-200 hover-scale">
              <CardHeader className="pb-3">
                <div className="aspect-video relative mb-3 rounded-lg overflow-hidden bg-muted">
                  <img
                    src={agent.image || "/placeholder.svg"}
                    alt={agent.title}
                    className="w-full h-full object-cover"
                  />
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
                    <div className="text-lg font-bold">€{agent.price}</div>
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
      </main>

      <footer className="border-t bg-muted/30 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center shadow-glow">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-xl">buildro.ai</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Die führende Plattform für KI-Agenten und Automatisierung.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Produkt</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/features">Features</Link>
                </li>
                <li>
                  <Link href="/pricing">Preise</Link>
                </li>
                <li>
                  <Link href="/public-marketplace">Marketplace</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Unternehmen</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about">Über uns</Link>
                </li>
                <li>
                  <Link href="/contact">Kontakt</Link>
                </li>
                <li>
                  <Link href="/careers">Karriere</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/datenschutz">Datenschutz</Link>
                </li>
                <li>
                  <Link href="/ai-act">EU AI Act</Link>
                </li>
                <li>
                  <Link href="/terms">AGB</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 buildro.ai. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
