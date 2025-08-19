"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/hooks/use-toast"
import { Copy, RotateCcw, Trash2, Plus, Key, AlertTriangle, Shield, Eye, EyeOff } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ApiKey {
  id: string
  name: string
  key: string
  maskedKey: string
  createdAt: string
  lastUsed: string | null
  isActive: boolean
}

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isKeyVisible, setIsKeyVisible] = useState<string | null>(null)
  const [newKeyName, setNewKeyName] = useState("")
  const [newKeyExpiry, setNewKeyExpiry] = useState("")
  const [gdprConsent, setGdprConsent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [createdKey, setCreatedKey] = useState<string | null>(null)

  const [projectName, setProjectName] = useState("")
  const [openaiApiKey, setOpenaiApiKey] = useState("")
  const [showOpenaiKey, setShowOpenaiKey] = useState(false)
  const [isProjectKeyLoading, setIsProjectKeyLoading] = useState(false)

  useEffect(() => {
    fetchApiKeys()
  }, [])

  const fetchApiKeys = async () => {
    try {
      const response = await fetch("/api/keys")
      const data = await response.json()
      setApiKeys(data.keys)
    } catch (error) {
      toast({
        title: "Fehler",
        description: "API Keys konnten nicht geladen werden.",
        variant: "destructive",
      })
    }
  }

  const createApiKey = async () => {
    if (!newKeyName.trim() || !gdprConsent) {
      toast({
        title: "Fehler",
        description: "Bitte fülle alle Pflichtfelder aus und stimme den Bedingungen zu.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newKeyName,
          expiryDate: newKeyExpiry || null,
        }),
      })

      const data = await response.json()
      setCreatedKey(data.key.key)
      setApiKeys((prev) => [...prev, data.key])
      setNewKeyName("")
      setNewKeyExpiry("")
      setGdprConsent(false)

      toast({
        title: "Erfolg",
        description: "API Key wurde erfolgreich erstellt.",
      })
    } catch (error) {
      toast({
        title: "Fehler",
        description: "API Key konnte nicht erstellt werden.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (key: string, name: string) => {
    try {
      await navigator.clipboard.writeText(key)
      toast({
        title: "Kopiert",
        description: `API Key "${name}" wurde in die Zwischenablage kopiert.`,
      })
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Kopieren fehlgeschlagen.",
        variant: "destructive",
      })
    }
  }

  const deleteApiKey = async (id: string, name: string) => {
    if (
      !confirm(`Möchtest du den API Key "${name}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`)
    ) {
      return
    }

    try {
      await fetch(`/api/keys/${id}`, { method: "DELETE" })
      setApiKeys((prev) => prev.filter((key) => key.id !== id))
      toast({
        title: "Gelöscht",
        description: `API Key "${name}" wurde gelöscht.`,
      })
    } catch (error) {
      toast({
        title: "Fehler",
        description: "API Key konnte nicht gelöscht werden.",
        variant: "destructive",
      })
    }
  }

  const resetApiKey = async (id: string, name: string) => {
    if (!confirm(`Möchtest du den API Key "${name}" wirklich zurücksetzen? Der alte Key wird ungültig.`)) {
      return
    }

    try {
      const response = await fetch(`/api/keys/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      })

      const data = await response.json()
      setApiKeys((prev) => prev.map((key) => (key.id === id ? data.key : key)))
      setCreatedKey(data.key.key)

      toast({
        title: "Zurückgesetzt",
        description: `API Key "${name}" wurde zurückgesetzt.`,
      })
    } catch (error) {
      toast({
        title: "Fehler",
        description: "API Key konnte nicht zurückgesetzt werden.",
        variant: "destructive",
      })
    }
  }

  const addProjectApiKey = async () => {
    if (!projectName.trim() || !openaiApiKey.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte fülle alle Pflichtfelder aus.",
        variant: "destructive",
      })
      return
    }

    setIsProjectKeyLoading(true)
    try {
      const response = await fetch("/api/keys/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName,
          openaiApiKey,
        }),
      })

      const data = await response.json()

      // Add to existing keys list
      setApiKeys((prev) => [...prev, data.key])

      // Reset form
      setProjectName("")
      setOpenaiApiKey("")
      setShowOpenaiKey(false)

      toast({
        title: "Erfolg",
        description: "API Key saved successfully!",
      })
    } catch (error) {
      toast({
        title: "Fehler",
        description: "API Key konnte nicht gespeichert werden.",
        variant: "destructive",
      })
    } finally {
      setIsProjectKeyLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500">
            <Key className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">API Keys verwalten</h1>
            <p className="text-muted-foreground">
              Hier kannst du deine persönlichen API-Schlüssel generieren, anzeigen und löschen.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Left Column - Add Project API Key Form */}
        <Card className="card-container">
          <CardHeader>
            <CardTitle>Add New Project API Key</CardTitle>
            <CardDescription>
              Provide a project name and your OpenAI API key. Your key will be encrypted and stored securely.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="projectName">Project Name *</Label>
              <Input
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="z.B. Mein KI-Projekt"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="openaiKey">OpenAI API Key *</Label>
              <div className="relative mt-1">
                <Input
                  id="openaiKey"
                  type={showOpenaiKey ? "text" : "password"}
                  value={openaiApiKey}
                  onChange={(e) => setOpenaiApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                >
                  {showOpenaiKey ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Your API key is encrypted before being saved.</p>
            </div>

            <Button
              onClick={addProjectApiKey}
              disabled={isProjectKeyLoading || !projectName.trim() || !openaiApiKey.trim()}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              {isProjectKeyLoading ? "Speichere..." : "Save API Key"}
            </Button>
          </CardContent>
        </Card>

        {/* Right Column - Security Info Box */}
        <Card className="card-container">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Sicherheit</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Dein API Key wird clientseitig verschlüsselt, bevor er gespeichert wird.</p>
                  <p>• Du kannst Keys jederzeit löschen oder neu generieren.</p>
                  <p>• Keys werden nur für deine Projekte verwendet.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* GDPR Notice */}
      <Card className="card-container border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-1">Sicherheit & DSGVO</h3>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                API Keys sind personenbezogen. Teile deine Keys nicht mit Dritten. DSGVO-konforme Speicherung: Keys
                können jederzeit gelöscht werden.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Keys Table */}
      <Card className="card-container">
        <CardHeader>
          <CardTitle>Deine API Keys</CardTitle>
          <CardDescription>Verwalte deine API-Schlüssel und überwache deren Nutzung.</CardDescription>
        </CardHeader>
        <CardContent>
          {apiKeys.length === 0 ? (
            <div className="text-center py-8">
              <Key className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Keine API Keys vorhanden</h3>
              <p className="text-muted-foreground mb-4">Erstelle deinen ersten API Key, um loszulegen.</p>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ersten Key erstellen
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Key</TableHead>
                    <TableHead>Erstellt</TableHead>
                    <TableHead>Letzte Nutzung</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aktionen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map((apiKey) => (
                    <TableRow key={apiKey.id}>
                      <TableCell className="font-medium">{apiKey.name}</TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <code className="text-sm bg-muted px-2 py-1 rounded cursor-help">{apiKey.maskedKey}</code>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Nur die ersten und letzten 4 Zeichen sichtbar</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>{formatDate(apiKey.createdAt)}</TableCell>
                      <TableCell>{apiKey.lastUsed ? formatDate(apiKey.lastUsed) : "Nie verwendet"}</TableCell>
                      <TableCell>
                        <Badge variant={apiKey.isActive ? "default" : "secondary"}>
                          {apiKey.isActive ? "Aktiv" : "Inaktiv"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => copyToClipboard(apiKey.key, apiKey.name)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Key kopieren</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button size="sm" variant="outline" onClick={() => resetApiKey(apiKey.id, apiKey.name)}>
                                  <RotateCcw className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Key zurücksetzen</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => deleteApiKey(apiKey.id, apiKey.name)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Key löschen</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Created Key Display */}
      {createdKey && (
        <Card className="card-container border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
          <CardHeader>
            <CardTitle className="text-green-800 dark:text-green-200 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              API Key erfolgreich erstellt
            </CardTitle>
            <CardDescription className="text-green-700 dark:text-green-300">
              Bitte speichere diesen Key sicher ab. Er wird später nicht mehr vollständig angezeigt.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 p-3 bg-white dark:bg-gray-900 rounded-lg border">
              <code className="flex-1 font-mono text-sm break-all">{createdKey}</code>
              <Button size="sm" variant="outline" onClick={() => copyToClipboard(createdKey, "Neuer Key")}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={() => setCreatedKey(null)} className="mt-3">
              Verstanden, Key ausblenden
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="mt-6">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
              <Plus className="h-4 w-4 mr-2" />
              Neuen Key erstellen
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Neuen API Key erstellen</DialogTitle>
              <DialogDescription>Erstelle einen neuen API Key für deine Anwendung.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="keyName">Key Name *</Label>
                <Input
                  id="keyName"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="z.B. Meine App API Key"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="keyExpiry">Ablaufdatum (optional)</Label>
                <Input
                  id="keyExpiry"
                  type="date"
                  value={newKeyExpiry}
                  onChange={(e) => setNewKeyExpiry(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="gdprConsent"
                  checked={gdprConsent}
                  onCheckedChange={(checked) => setGdprConsent(checked as boolean)}
                />
                <Label htmlFor="gdprConsent" className="text-sm leading-5">
                  Ich stimme zu, meinen Key sicher aufzubewahren und nicht mit Dritten zu teilen.
                </Label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Abbrechen
              </Button>
              <Button
                onClick={createApiKey}
                disabled={isLoading || !newKeyName.trim() || !gdprConsent}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                {isLoading ? "Erstelle..." : "Key erstellen"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
