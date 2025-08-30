"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Search, ExternalLink, Edit, Share, Trash2, MoreHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

interface Demo {
  id: string
  name: string
  description: string
  agent_id: string
  is_public: boolean
  public_url: string
  settings: any
  created_at: string
  updated_at: string
}

export default function DemoPage() {
  const [demos, setDemos] = useState<Demo[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { user } = useAuth()

  useEffect(() => {
    const fetchDemos = async () => {
      if (!user) return

      try {
        const response = await fetch("/api/demos")
        if (response.ok) {
          const data = await response.json()
          setDemos(data.demos || [])
        }
      } catch (error) {
        console.error("Error fetching demos:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDemos()
  }, [user])

  const handleDeleteDemo = async (demoId: string) => {
    if (!confirm("Möchten Sie diese Demo wirklich löschen?")) return

    try {
      const response = await fetch(`/api/demos/${demoId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setDemos(demos.filter((demo) => demo.id !== demoId))
      } else {
        console.error("Failed to delete demo")
      }
    } catch (error) {
      console.error("Error deleting demo:", error)
    }
  }

  const filteredDemos = demos.filter(
    (demo) =>
      demo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      demo.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Demo – Kundenvorschau</h1>
            <p className="text-muted-foreground">Lade Demos...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Demo – Kundenvorschau</h1>
          <p className="text-muted-foreground">Erstelle und teile Demo-Versionen deiner Agenten für Kundentests</p>
        </div>
        <Link href="/demo/new">
          <Button className="bg-gradient-accent hover:bg-gradient-accent/90 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Neue Demo erstellen
          </Button>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Demos suchen..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/demo/new">
          <Card className="border-dashed border-2 hover-scale cursor-pointer group">
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center mb-4 group-hover:shadow-glow transition-all">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="mb-2">Demo erstellen</CardTitle>
              <CardDescription>Erstelle eine neue Demo für deine Agenten</CardDescription>
            </CardContent>
          </Card>
        </Link>

        {filteredDemos.map((demo) => (
          <Card key={demo.id} className="hover-scale cursor-pointer group relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{demo.name}</CardTitle>
                  <CardDescription className="mt-1">{demo.description || "Keine Beschreibung"}</CardDescription>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                  <Link href={`/demo/${demo.id}`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Share className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteDemo(demo.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Löschen
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Erstellt: {new Date(demo.created_at).toLocaleDateString()}
                </span>
                <Badge
                  variant={demo.is_public ? "default" : "secondary"}
                  className={demo.is_public ? "bg-green-500 hover:bg-green-600" : ""}
                >
                  {demo.is_public ? "Öffentlich" : "Privat"}
                </Badge>
              </div>
              {demo.is_public && demo.public_url && (
                <div className="mt-3 pt-3 border-t">
                  <Link
                    href={demo.public_url}
                    className="text-sm text-muted-foreground hover:text-foreground flex items-center"
                    target="_blank"
                  >
                    <ExternalLink className="mr-1 h-3 w-3" />
                    Öffentliche Vorschau
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {filteredDemos.length === 0 && demos.length > 0 && (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            <p>Keine Demos gefunden für "{searchTerm}"</p>
          </div>
        )}

        {demos.length === 0 && (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            <p>Noch keine Demos erstellt</p>
            <p className="text-sm">Erstelle deine erste Demo, um loszulegen</p>
          </div>
        )}
      </div>
    </div>
  )
}
