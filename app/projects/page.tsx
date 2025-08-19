"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Edit, Trash2, FolderOpen, Calendar, Users } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import type { Project } from "@/lib/supabase/client"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { user } = useAuth()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects")
      if (response.ok) {
        const data = await response.json()
        setProjects(data.projects || [])
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteProject = async (projectId: string) => {
    if (!confirm("Sind Sie sicher, dass Sie dieses Projekt löschen möchten?")) return

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setProjects(projects.filter((p) => p.id !== projectId))
      }
    } catch (error) {
      console.error("Error deleting project:", error)
    }
  }

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const getProjectTypeIcon = (type: string) => {
    switch (type) {
      case "agent":
        return "🤖"
      case "demo":
        return "🎭"
      case "bulk_test":
        return "🧪"
      default:
        return "📁"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500 hover:bg-green-600"
      case "draft":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "archived":
        return "bg-gray-500 hover:bg-gray-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gradient-accent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projekte</h1>
          <p className="text-muted-foreground">Verwalte alle deine KI-Projekte an einem Ort</p>
        </div>
        <CreateProjectDialog onProjectCreated={fetchProjects} />
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Projekte suchen..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle className="mb-2">
              {projects.length === 0 ? "Noch keine Projekte" : "Keine Projekte gefunden"}
            </CardTitle>
            <CardDescription className="mb-4">
              {projects.length === 0
                ? "Erstelle dein erstes Projekt, um mit der Entwicklung von KI-Agenten zu beginnen."
                : "Versuche einen anderen Suchbegriff oder erstelle ein neues Projekt."}
            </CardDescription>
            <CreateProjectDialog onProjectCreated={fetchProjects} />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover-scale cursor-pointer group relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getProjectTypeIcon(project.type)}</span>
                    <div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription className="mt-1">{project.description || "Keine Beschreibung"}</CardDescription>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Bearbeiten
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => deleteProject(project.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Löschen
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm mb-3">
                  <Badge className={getStatusColor(project.status)}>
                    {project.status === "active" ? "Aktiv" : project.status === "draft" ? "Entwurf" : "Archiviert"}
                  </Badge>
                  <span className="text-muted-foreground capitalize">{project.type}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    {new Date(project.created_at).toLocaleDateString("de-DE")}
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-1 h-3 w-3" />
                    Privat
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function CreateProjectDialog({ onProjectCreated }: { onProjectCreated: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "agent" as "agent" | "demo" | "bulk_test",
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsOpen(false)
        setFormData({ name: "", description: "", type: "agent" })
        onProjectCreated()
      }
    } catch (error) {
      console.error("Error creating project:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="bg-gradient-accent hover:bg-gradient-accent/90 text-white">
        <Plus className="mr-2 h-4 w-4" />
        Neues Projekt
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Neues Projekt erstellen</CardTitle>
              <CardDescription>Erstelle ein neues Projekt für deine KI-Entwicklung</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Projektname *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="z.B. Mein Sales Agent"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Beschreibung</label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Kurze Beschreibung des Projekts"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Projekttyp</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="agent">KI-Agent</option>
                    <option value="demo">Demo</option>
                    <option value="bulk_test">Bulk Test</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={loading}>
                    Abbrechen
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || !formData.name.trim()}
                    className="bg-gradient-accent hover:bg-gradient-accent/90 text-white"
                  >
                    {loading ? "Erstelle..." : "Erstellen"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
