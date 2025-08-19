"use client"

import { useState, useEffect } from "react"
import {
  Save,
  Trash2,
  Bot,
  Webhook,
  FileUp,
  Copy,
  RefreshCw,
  Play,
  Eye,
  EyeOff,
  HelpCircle,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useImproveStore } from "@/lib/stores/improve-store"
import { toast } from "sonner"

interface NodeDrawerProps {
  isOpen: boolean
  nodeId: string | null
  onClose: () => void
  onSave: (nodeId: string, data: any) => void
  onDelete: (nodeId: string) => void
}

const mockBuilds = [
  { id: "build-1", name: "Kundenservice Agent", version: "v1.2" },
  { id: "build-2", name: "Sales Assistant", version: "v2.1" },
  { id: "build-3", name: "Support Bot", version: "v1.0" },
]

const mockDeliveryLog = [
  { timestamp: "2024-08-16T10:30:00Z", status: 200, responseTime: 145 },
  { timestamp: "2024-08-16T10:25:00Z", status: 200, responseTime: 203 },
  { timestamp: "2024-08-16T10:20:00Z", status: 500, responseTime: 1200 },
  { timestamp: "2024-08-16T10:15:00Z", status: 200, responseTime: 98 },
  { timestamp: "2024-08-16T10:10:00Z", status: 200, responseTime: 156 },
]

export function NodeDrawer({ isOpen, nodeId, onClose, onSave, onDelete }: NodeDrawerProps) {
  const { nodes } = useImproveStore()
  const node = nodeId ? nodes.find((n) => n.id === nodeId) : null

  const [formData, setFormData] = useState({
    // Common
    name: "",
    description: "",

    // Worker Agent
    buildId: "",
    role: "retriever",
    enabled: true,
    timeoutMs: 10000,
    maxTokens: null as number | null,
    notes: "",

    // Webhook
    url: "",
    secret: "",
    retryPolicy: "none",

    // File Upload
    allowedTypes: [] as string[],
    maxMb: 25,
    retention: "30d",
    autoIndex: true,
    profile: "balanced",
    chunkSize: 1024,
    folder: "",
  })

  const [showSecret, setShowSecret] = useState(false)
  const [isTestingWebhook, setIsTestingWebhook] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const [unsavedChanges, setUnsavedChanges] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (node) {
      const config = node.data.config || {}
      setFormData({
        name: node.data.name || "",
        description: config.description || "",
        buildId: config.buildId || "",
        role: config.role || "retriever",
        enabled: config.enabled !== false,
        timeoutMs: config.timeoutMs || 10000,
        maxTokens: config.maxTokens || null,
        notes: config.notes || "",
        url: config.url || "",
        secret: config.secret || "",
        retryPolicy: config.retryPolicy || "none",
        allowedTypes: config.allowed || [],
        maxMb: config.maxMb || 25,
        retention: config.retention || "30d",
        autoIndex: config.autoIndex !== false,
        profile: config.profile || "balanced",
        chunkSize: config.chunkSize || 1024,
        folder: config.folder || `/uploads/agents/${nodeId}`,
      })
      setUnsavedChanges(false)
      setErrors({})
    }
  }, [node, nodeId])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name ist erforderlich"
    } else if (formData.name.length < 2 || formData.name.length > 60) {
      newErrors.name = "Name muss zwischen 2 und 60 Zeichen lang sein"
    }

    if (node?.type === "worker") {
      if (!formData.buildId) {
        newErrors.buildId = "Build-Auswahl ist erforderlich"
      }
      if (formData.timeoutMs < 100 || formData.timeoutMs > 60000) {
        newErrors.timeoutMs = "Zeitlimit muss zwischen 100 und 60000 ms liegen"
      }
      if (formData.maxTokens !== null && (formData.maxTokens < 0 || formData.maxTokens > 8192)) {
        newErrors.maxTokens = "Max. Tokens muss zwischen 0 und 8192 liegen"
      }
    }

    if (node?.type === "webhook") {
      if (!formData.url.trim()) {
        newErrors.url = "URL ist erforderlich"
      } else if (!formData.url.match(/^https?:\/\/.+/)) {
        newErrors.url = "URL muss mit http:// oder https:// beginnen"
      }
      if (!formData.secret.trim()) {
        newErrors.secret = "Secret ist erforderlich"
      }
    }

    if (node?.type === "files") {
      if (formData.allowedTypes.length === 0) {
        newErrors.allowedTypes = "Mindestens ein Dateityp muss ausgewählt werden"
      }
      if (formData.maxMb < 1 || formData.maxMb > 200) {
        newErrors.maxMb = "Dateigröße muss zwischen 1 und 200 MB liegen"
      }
      if (formData.chunkSize < 256 || formData.chunkSize > 2048) {
        newErrors.chunkSize = "Chunk-Größe muss zwischen 256 und 2048 liegen"
      }
      if (formData.profile === "precise" && formData.chunkSize < 512) {
        newErrors.chunkSize = "Bei 'Präzise' muss Chunk-Größe mindestens 512 sein"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!nodeId || !validateForm()) return

    const updatedData = {
      name: formData.name,
      config:
        node?.type === "worker"
          ? {
              description: formData.description,
              buildId: formData.buildId,
              role: formData.role,
              enabled: formData.enabled,
              timeoutMs: formData.timeoutMs,
              maxTokens: formData.maxTokens,
              notes: formData.notes,
            }
          : node?.type === "webhook"
            ? {
                url: formData.url,
                secret: formData.secret,
                retry: formData.retryPolicy,
              }
            : {
                allowed: formData.allowedTypes,
                maxMb: formData.maxMb,
                retention: formData.retention,
                autoIndex: formData.autoIndex,
                profile: formData.profile,
                chunk: formData.chunkSize,
                folder: formData.folder,
              },
    }

    onSave(nodeId, updatedData)
    setUnsavedChanges(false)
    onClose()
  }

  const handleClose = () => {
    if (unsavedChanges) {
      if (confirm("Sie haben ungespeicherte Änderungen. Möchten Sie wirklich schließen?")) {
        onClose()
      }
    } else {
      onClose()
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && (e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault()
        handleSave()
      }
      if (isOpen && e.key === "Escape") {
        handleClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, unsavedChanges])

  const handleFormChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setUnsavedChanges(true)
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleDelete = () => {
    if (!nodeId || !node || node.type === "main") return
    if (confirm("Sind Sie sicher, dass Sie diese Integration löschen möchten?")) {
      onDelete(nodeId)
    }
  }

  const generateSecret = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      const secret = "sk_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      handleFormChange("secret", secret)
      toast.success("Secret generiert")
    } catch (error) {
      toast.error("Fehler beim Generieren des Secrets")
    }
  }

  const copyToClipboard = (text: string, label = "Text") => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} in Zwischenablage kopiert`)
  }

  const testWebhook = async () => {
    if (!formData.url) return

    setIsTestingWebhook(true)
    try {
      // Simulate webhook test
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const success = Math.random() > 0.3 // 70% success rate

      setTestResult({
        status: success ? 200 : 500,
        responseTime: Math.floor(Math.random() * 1000) + 100,
        body: success ? "OK" : "Internal Server Error",
        timestamp: new Date().toISOString(),
      })

      toast.success(success ? "Webhook-Test erfolgreich" : "Webhook-Test fehlgeschlagen")
    } catch (error) {
      toast.error("Webhook-Test fehlgeschlagen")
    } finally {
      setIsTestingWebhook(false)
    }
  }

  const handleFileUpload = async (files: FileList) => {
    const newFiles = Array.from(files).map((file) => ({
      id: Math.random().toString(36),
      name: file.name,
      size: file.size,
      status: "uploading" as const,
    }))

    setUploadedFiles((prev) => [...prev, ...newFiles])

    // Simulate upload process
    for (const file of newFiles) {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const success = Math.random() > 0.2 // 80% success rate
      const finalStatus = success ? (formData.autoIndex ? "indexed" : "uploaded") : "failed"

      setUploadedFiles((prev) => prev.map((f) => (f.id === file.id ? { ...f, status: finalStatus } : f)))
    }
  }

  const toggleFileType = (type: string) => {
    const newTypes = formData.allowedTypes.includes(type)
      ? formData.allowedTypes.filter((t) => t !== type)
      : [...formData.allowedTypes, type]
    handleFormChange("allowedTypes", newTypes)
  }

  if (!node) return null

  const getIcon = () => {
    switch (node.type) {
      case "worker":
        return <Bot className="w-5 h-5 text-blue-500" />
      case "webhook":
        return <Webhook className="w-5 h-5 text-emerald-500" />
      case "files":
        return <FileUp className="w-5 h-5 text-purple-500" />
      default:
        return <Bot className="w-5 h-5" />
    }
  }

  const getTitle = () => {
    switch (node.type) {
      case "worker":
        return "Worker Agent"
      case "webhook":
        return "Webhook"
      case "files":
        return "File Upload"
      default:
        return "Integration"
    }
  }

  const getBadgeVariant = () => {
    switch (node.type) {
      case "worker":
        return "default"
      case "webhook":
        return "secondary"
      case "files":
        return "outline"
      default:
        return "default"
    }
  }

  return (
    <TooltipProvider>
      <Sheet open={isOpen} onOpenChange={handleClose}>
        <SheetContent className="w-[420px] sm:w-[480px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getIcon()}
                {getTitle()}
                <Badge variant={getBadgeVariant()}>{node.type}</Badge>
              </div>
              {unsavedChanges && <div className="w-2 h-2 bg-orange-500 rounded-full" />}
            </SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Allgemein Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Allgemein</h3>

              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  placeholder="Name der Integration"
                  className={errors.name ? "border-red-500" : ""}
                  aria-label="Name der Integration"
                />
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="description">Beschreibung</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleFormChange("description", e.target.value)}
                  placeholder="Beschreibung der Integration (max. 280 Zeichen)"
                  rows={3}
                  maxLength={280}
                  aria-label="Beschreibung der Integration"
                />
                <p className="text-xs text-muted-foreground mt-1">{formData.description.length}/280 Zeichen</p>
              </div>
            </div>

            {/* Worker Agent Specific */}
            {node.type === "worker" && (
              <>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Verknüpfung</h3>

                  <div>
                    <Label htmlFor="buildId">Zugewiesener Build *</Label>
                    <Select value={formData.buildId} onValueChange={(value) => handleFormChange("buildId", value)}>
                      <SelectTrigger className={errors.buildId ? "border-red-500" : ""}>
                        <SelectValue placeholder="Build auswählen" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockBuilds.map((build) => (
                          <SelectItem key={build.id} value={build.id}>
                            {build.name} ({build.version})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.buildId && <p className="text-sm text-red-500 mt-1">{errors.buildId}</p>}
                  </div>

                  <div>
                    <Label htmlFor="role">Rolle</Label>
                    <Select value={formData.role} onValueChange={(value) => handleFormChange("role", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="retriever">Retriever</SelectItem>
                        <SelectItem value="classifier">Classifier</SelectItem>
                        <SelectItem value="action">Action-Runner</SelectItem>
                        <SelectItem value="fallback">Fallback</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Ablauf</h3>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="enabled">Aktiv</Label>
                    <Switch
                      id="enabled"
                      checked={formData.enabled}
                      onCheckedChange={(checked) => handleFormChange("enabled", checked)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="timeoutMs">Zeitlimit (ms)</Label>
                    <Input
                      id="timeoutMs"
                      type="number"
                      value={formData.timeoutMs}
                      onChange={(e) => handleFormChange("timeoutMs", Number.parseInt(e.target.value))}
                      min={100}
                      max={60000}
                      className={errors.timeoutMs ? "border-red-500" : ""}
                    />
                    {errors.timeoutMs && <p className="text-sm text-red-500 mt-1">{errors.timeoutMs}</p>}
                  </div>

                  <div>
                    <Label htmlFor="maxTokens">Max. Tokens (optional)</Label>
                    <Input
                      id="maxTokens"
                      type="number"
                      value={formData.maxTokens || ""}
                      onChange={(e) =>
                        handleFormChange("maxTokens", e.target.value ? Number.parseInt(e.target.value) : null)
                      }
                      min={0}
                      max={8192}
                      placeholder="Leer für unbegrenzt"
                      className={errors.maxTokens ? "border-red-500" : ""}
                    />
                    {errors.maxTokens && <p className="text-sm text-red-500 mt-1">{errors.maxTokens}</p>}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Notizen</h3>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => handleFormChange("notes", e.target.value)}
                    placeholder="Zusätzliche Notizen..."
                    rows={3}
                  />
                </div>

                {/* Test Run */}
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Testlauf</h4>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" disabled={!formData.buildId}>
                          <Play className="w-4 h-4 mr-1" />
                          Testen
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Agent Testlauf</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Testprompt</Label>
                            <Textarea placeholder="Geben Sie eine Testnachricht ein..." rows={3} />
                          </div>
                          <div className="flex gap-2">
                            <Button className="flex-1">Test starten</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  {!formData.buildId && <p className="text-sm text-red-500">Build muss ausgewählt werden</p>}
                </Card>
              </>
            )}

            {/* Webhook Specific */}
            {node.type === "webhook" && (
              <>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Ziel-Webhook</h3>

                  <div>
                    <Label htmlFor="url">Webhook-URL *</Label>
                    <Input
                      id="url"
                      value={formData.url}
                      onChange={(e) => handleFormChange("url", e.target.value)}
                      placeholder="https://api.example.com/webhook"
                      className={errors.url ? "border-red-500" : ""}
                    />
                    {errors.url && <p className="text-sm text-red-500 mt-1">{errors.url}</p>}
                  </div>

                  <div>
                    <Label htmlFor="secret">X-Webhook-Secret</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          id="secret"
                          value={formData.secret}
                          onChange={(e) => handleFormChange("secret", e.target.value)}
                          placeholder="Webhook Secret"
                          type={showSecret ? "text" : "password"}
                          className={errors.secret ? "border-red-500" : ""}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowSecret(!showSecret)}
                        >
                          {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        onClick={generateSecret}
                        className="shrink-0 bg-transparent"
                        aria-label="Secret generieren"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => copyToClipboard(formData.secret, "Secret")}
                        disabled={!formData.secret}
                        className="shrink-0"
                        aria-label="Secret in Zwischenablage kopieren"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    {errors.secret && <p className="text-sm text-red-500 mt-1">{errors.secret}</p>}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="retryPolicy">Retry Policy</Label>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="w-4 h-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Bestimmt, wie oft bei Fehlern wiederholt wird</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Select
                      value={formData.retryPolicy}
                      onValueChange={(value) => handleFormChange("retryPolicy", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Kein Retry</SelectItem>
                        <SelectItem value="backoff">Exponential Backoff (max 3)</SelectItem>
                        <SelectItem value="once">Sofort 1× wiederholen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* HTTP Headers */}
                <Card className="p-4">
                  <h4 className="font-medium mb-3">HTTP Header</h4>
                  <div className="space-y-2">
                    {[
                      { key: "X-Webhook-Secret", value: formData.secret ? "*****" : "Nicht gesetzt" },
                      { key: "Content-Type", value: "application/json" },
                      { key: "Cache-Control", value: "no-store" },
                    ].map((header) => (
                      <div key={header.key} className="flex items-center justify-between p-2 bg-muted rounded">
                        <code className="text-sm">
                          {header.key}: {header.value}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(`${header.key}: ${header.value}`, "Header")}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Example Payload */}
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Beispiel-Payload</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(
                          `{
  "message": "Hallo!",
  "threadId": "abc123",
  "type": "user_message",
  "meta": { "agentId": "${nodeId}" }
}`,
                          "Payload",
                        )
                      }
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Kopieren
                    </Button>
                  </div>
                  <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                    {`{
  "message": "Hallo!",
  "threadId": "abc123",
  "type": "user_message",
  "meta": { "agentId": "${nodeId}" }
}`}
                  </pre>
                </Card>

                {/* Tools */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Tools</h3>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={testWebhook}
                      disabled={!formData.url || isTestingWebhook}
                      className="flex-1 bg-transparent"
                    >
                      {isTestingWebhook ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Play className="w-4 h-4 mr-2" />
                      )}
                      Test-Ping
                    </Button>
                  </div>

                  {testResult && (
                    <Card className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={testResult.status === 200 ? "default" : "destructive"}>
                          {testResult.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{testResult.responseTime}ms</span>
                      </div>
                      <code className="text-xs">{testResult.body}</code>
                    </Card>
                  )}

                  {/* Delivery Log */}
                  <Card className="p-4">
                    <h4 className="font-medium mb-3">Delivery-Log</h4>
                    <div className="space-y-2">
                      {mockDeliveryLog.slice(0, 5).map((log, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{new Date(log.timestamp).toLocaleTimeString()}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant={log.status === 200 ? "default" : "destructive"} className="text-xs">
                              {log.status}
                            </Badge>
                            <span className="text-muted-foreground">{log.responseTime}ms</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </>
            )}

            {/* File Upload Specific */}
            {node.type === "files" && (
              <>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Regeln</h3>

                  <div>
                    <Label>Zulässige Dateitypen</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {["pdf", "docx", "txt", "csv", "md", "json"].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={type}
                            checked={formData.allowedTypes.includes(type)}
                            onChange={() => toggleFileType(type)}
                            className="w-4 h-4"
                          />
                          <Label htmlFor={type} className="text-sm uppercase">
                            {type}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {errors.allowedTypes && <p className="text-sm text-red-500 mt-1">{errors.allowedTypes}</p>}
                  </div>

                  <div>
                    <Label htmlFor="maxMb">Max. Dateigröße (MB)</Label>
                    <Input
                      id="maxMb"
                      type="number"
                      value={formData.maxMb}
                      onChange={(e) => handleFormChange("maxMb", Number.parseInt(e.target.value))}
                      min={1}
                      max={200}
                      className={errors.maxMb ? "border-red-500" : ""}
                    />
                    {errors.maxMb && <p className="text-sm text-red-500 mt-1">{errors.maxMb}</p>}
                  </div>

                  <div>
                    <Label htmlFor="retention">Aufbewahrung</Label>
                    <Select value={formData.retention} onValueChange={(value) => handleFormChange("retention", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7d">7 Tage</SelectItem>
                        <SelectItem value="30d">30 Tage</SelectItem>
                        <SelectItem value="90d">90 Tage</SelectItem>
                        <SelectItem value="unlimited">Unbegrenzt</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Verarbeitung</h3>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="autoIndex">Automatisch indexieren</Label>
                    <Switch
                      id="autoIndex"
                      checked={formData.autoIndex}
                      onCheckedChange={(checked) => handleFormChange("autoIndex", checked)}
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="profile">Index-Profil</Label>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="w-4 h-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Schnell: Basis-Indexierung
                            <br />
                            Ausgewogen: Standard-Qualität
                            <br />
                            Präzise: Höchste Qualität
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Select value={formData.profile} onValueChange={(value) => handleFormChange("profile", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fast">Schnell</SelectItem>
                        <SelectItem value="balanced">Ausgewogen</SelectItem>
                        <SelectItem value="precise">Präzise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="chunkSize">Chunk-Größe</Label>
                    <Input
                      id="chunkSize"
                      type="number"
                      value={formData.chunkSize}
                      onChange={(e) => handleFormChange("chunkSize", Number.parseInt(e.target.value))}
                      min={256}
                      max={2048}
                      className={errors.chunkSize ? "border-red-500" : ""}
                    />
                    {errors.chunkSize && <p className="text-sm text-red-500 mt-1">{errors.chunkSize}</p>}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Speicherort</h3>

                  <div>
                    <Label htmlFor="folder">Ordner</Label>
                    <Input
                      id="folder"
                      value={formData.folder}
                      onChange={(e) => handleFormChange("folder", e.target.value)}
                      placeholder="/uploads/agents/<id>"
                    />
                  </div>
                </div>

                {/* Upload Test */}
                <Card className="p-4">
                  <h4 className="font-medium mb-3">Upload-Test</h4>
                  <div
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                    onClick={() => document.getElementById("file-upload")?.click()}
                  >
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Dateien hier ablegen oder klicken zum Auswählen</p>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                    />
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {uploadedFiles.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-2 bg-muted rounded">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{file.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {(file.size / 1024 / 1024).toFixed(1)} MB
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {file.status === "uploading" && (
                              <Badge variant="secondary">
                                <Clock className="w-3 h-3 mr-1" />
                                Lädt hoch
                              </Badge>
                            )}
                            {file.status === "uploaded" && (
                              <Badge variant="default">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Hochgeladen
                              </Badge>
                            )}
                            {file.status === "indexed" && (
                              <Badge variant="default">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Indexiert
                              </Badge>
                            )}
                            {file.status === "failed" && (
                              <Badge variant="destructive">
                                <XCircle className="w-3 h-3 mr-1" />
                                Fehlgeschlagen
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </>
            )}

            {/* Actions */}
            <div className="flex justify-between pt-4 border-t">
              <div>
                {node.type !== "main" && (
                  <Button variant="destructive" onClick={handleDelete} className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    Löschen
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={handleClose}>
                  Abbrechen
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-purple-500 via-blue-500 to-emerald-500"
                  disabled={Object.keys(errors).length > 0}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Speichern
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  )
}
