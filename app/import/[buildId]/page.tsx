"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Bot, Calendar, Settings, Webhook, Upload, Users, Key } from "lucide-react"
import Link from "next/link"

// Mock data for the shared build
const mockBuildData = {
  id: "test-build-123",
  name: "teset",
  description:
    "Work as a receptionist for a (INDUSTRY) Company. Friendly, engaging, but also have the sales skills of Jeremy Miner.",
  sharedDate: "Aug 18, 2025",
  parameters: {
    model: "GPT-4",
    temperature: 0.3,
    topP: 1,
  },
  systemPrompt:
    "# 1. DESCRIPTION:\n- **Language of prompt:** Deutsch\n- **Communication Level:** Deutsch\n- **Core identity and personality of agent**",
  webhooks: [{ name: "bh", type: "Send" }],
  fileUploads: false,
  workerAgents: false,
}

// Mock API keys for dropdown
const mockApiKeys = [
  { id: "1", name: "OpenAI API Key 1", masked: "sk-...abc123" },
  { id: "2", name: "OpenAI API Key 2", masked: "sk-...def456" },
  { id: "3", name: "OpenAI API Key 3", masked: "sk-...ghi789" },
]

export default function ImportBuildPage({ params }: { params: { buildId: string } }) {
  const handleImport = () => {
    // TODO: Implement import functionality
    console.log("[v0] Importing build to user account")
  }

  const handleCancel = () => {
    // TODO: Implement cancel functionality
    console.log("[v0] Cancelling import")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zurück
          </Link>
          <h1 className="text-3xl font-bold">Import AI Build</h1>
        </div>

        <div className="space-y-6">
          {/* Build Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-accent rounded-lg">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">{mockBuildData.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Shared {mockBuildData.sharedDate}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Build Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Beschreibung des Builds</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{mockBuildData.description}</p>
            </CardContent>
          </Card>

          {/* Build Parameters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Parameter des Builds
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">AI Model</label>
                  <p className="font-semibold">{mockBuildData.parameters.model}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Temperature</label>
                  <p className="font-semibold">{mockBuildData.parameters.temperature}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Top P</label>
                  <p className="font-semibold">{mockBuildData.parameters.topP}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Prompt */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">System Prompt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg">
                <pre className="text-sm whitespace-pre-wrap font-mono">{mockBuildData.systemPrompt}</pre>
              </div>
            </CardContent>
          </Card>

          {/* Webhook Integration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Webhook className="h-5 w-5" />
                Webhook-Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mockBuildData.webhooks.length > 0 ? (
                <div className="space-y-3">
                  {mockBuildData.webhooks.map((webhook, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Webhook Name: {webhook.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Anzahl der Webhooks: {mockBuildData.webhooks.length}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Webhook ({webhook.type})
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Keine Webhooks konfiguriert</p>
              )}
            </CardContent>
          </Card>

          {/* File Uploads */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Upload className="h-5 w-5" />
                File Uploads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {mockBuildData.fileUploads ? "Datei-Upload-Integrationen verfügbar" : "No file upload integrations"}
              </p>
            </CardContent>
          </Card>

          {/* Worker Agents */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Worker Agents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {mockBuildData.workerAgents ? "Worker Agents konfiguriert" : "No worker agents configured"}
              </p>
            </CardContent>
          </Card>

          {/* API Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Key className="h-5 w-5" />
                API-Konfiguration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">Select your API key to import this build</p>

              <div className="space-y-2">
                <label className="text-sm font-medium">OpenAI API-Schlüssel</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="API-Schlüssel auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockApiKeys.map((key) => (
                      <SelectItem key={key.id} value={key.id}>
                        {key.name} ({key.masked})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleImport}
                  className="bg-gradient-accent hover:bg-gradient-accent/90 text-white shadow-glow"
                >
                  Import to My Account
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
