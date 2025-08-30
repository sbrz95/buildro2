"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, Bot, Calendar, MoreHorizontal, Edit, FolderOpen, Share, Trash2, Shield } from "lucide-react"
import Link from "next/link"
import type { Agent, Project } from "@/lib/supabase/client"
import { ShareAgentDialog } from "@/components/share-agent-dialog"

interface ExtendedAgent extends Agent {
  creator?: {
    name: string
    email: string
  }
}

export default function BuildPage() {
  const [agents, setAgents] = useState<ExtendedAgent[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<ExtendedAgent | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [agentsResponse, projectsResponse] = await Promise.all([
        fetch("/api/agents"),
        fetch("/api/projects?type=agent"),
      ])

      if (agentsResponse.ok) {
        const agentsData = await agentsResponse.json()
        setAgents(agentsData.agents || [])
        setIsAdmin(agentsData.isAdmin || false)
      }

      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json()
        setProjects(projectsData.projects || [])
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAgent = async (agentId: string) => {
    if (!confirm("Sind Sie sicher, dass Sie diesen AI-Agent löschen möchten?")) return

    try {
      const response = await fetch(`/api/agents/${agentId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setAgents(agents.filter((agent) => agent.id !== agentId))
      }
    } catch (error) {
      console.error("Error deleting agent:", error)
    }
  }

  const handleMoveToFolder = (agentId: string) => {
    // TODO: Implement folder selection dialog
    console.log("Move agent to folder:", agentId)
  }

  const handleShareAgent = (agent: ExtendedAgent) => {
    setSelectedAgent(agent)
    setShareDialogOpen(true)
  }

  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (agent.description && agent.description.toLowerCase().includes(searchTerm.toLowerCase())),
  )

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
          <h1 className="text-3xl font-bold">
            Build
            {isAdmin && (
              <Badge variant="secondary" className="ml-2 bg-gradient-accent text-white">
                <Shield className="w-3 h-3 mr-1" />
                Admin
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground">
            {isAdmin ? "Verwalte alle KI-Agenten (Admin-Ansicht)" : "Erstelle und verwalte deine KI-Agenten"}
          </p>
        </div>
        <Link href="/projects">
          <Button variant="outline" className="mr-2 bg-transparent">
            Alle Projekte
          </Button>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Agenten suchen..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {isAdmin && (
          <Badge variant="outline" className="text-muted-foreground">
            {agents.length} Agenten insgesamt
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/build/new">
          <Card className="border-dashed border-2 hover-scale cursor-pointer group">
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center mb-4 group-hover:shadow-glow transition-all">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="mb-2">Neuen Build erstellen</CardTitle>
              <CardDescription>Starte mit einem neuen KI-Agenten</CardDescription>
            </CardContent>
          </Card>
        </Link>

        {filteredAgents.length === 0 && searchTerm ? (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <Bot className="h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="mb-2">Keine Agenten gefunden</CardTitle>
              <CardDescription>Versuche einen anderen Suchbegriff oder erstelle einen neuen Agenten.</CardDescription>
            </CardContent>
          </Card>
        ) : (
          filteredAgents.map((agent) => (
            <Card key={agent.id} className="hover-scale cursor-pointer group relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Bot className="mr-2 h-5 w-5" />
                    {agent.name}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{agent.model}</Badge>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => console.log("Edit agent:", agent.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            AI-Agent bearbeiten
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleMoveToFolder(agent.id)}>
                            <FolderOpen className="mr-2 h-4 w-4" />
                            In Ordner verschieben
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleShareAgent(agent)}>
                            <Share className="mr-2 h-4 w-4" />
                            AI-Agent teilen
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() => handleDeleteAgent(agent.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Löschen
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
                <CardDescription>{agent.description || "Keine Beschreibung"}</CardDescription>
                {isAdmin && agent.creator && (
                  <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                    <strong>Ersteller:</strong> {agent.creator.name} ({agent.creator.email})
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    {new Date(agent.created_at).toLocaleDateString("de-DE")}
                  </div>
                  <span>Temp: {agent.temperature}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {projects.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Aktuelle Projekte</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {projects.slice(0, 4).map((project) => (
              <Card key={project.id} className="hover-scale cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{project.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <Badge
                      variant="secondary"
                      className={
                        project.status === "active"
                          ? "bg-green-100 text-green-800"
                          : project.status === "draft"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                      }
                    >
                      {project.status === "active" ? "Aktiv" : project.status === "draft" ? "Entwurf" : "Archiviert"}
                    </Badge>
                    <span>{new Date(project.updated_at).toLocaleDateString("de-DE")}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {selectedAgent && (
        <ShareAgentDialog
          isOpen={shareDialogOpen}
          onClose={() => setShareDialogOpen(false)}
          agentName={selectedAgent.name}
          agentId={selectedAgent.id}
        />
      )}
    </div>
  )
}
