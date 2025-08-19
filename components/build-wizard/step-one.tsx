"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { MessageSquare, Headphones, Zap } from "lucide-react"

interface StepOneProps {
  data: any
  updateData: (data: any) => void
}

const agentTypes = [
  {
    id: "sales",
    name: "Sales",
    description: "Verkaufsunterstützung und Lead-Generierung",
    icon: MessageSquare,
  },
  {
    id: "support",
    name: "Support",
    description: "Kundenservice und technischer Support",
    icon: Headphones,
  },
  {
    id: "blank",
    name: "Blank",
    description: "Leerer Agent für individuelle Anpassung",
    icon: Zap,
  },
]

export function StepOne({ data, updateData }: StepOneProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Agenten-Basics</h2>
        <p className="text-muted-foreground">Grundlegende Informationen und Datenschutz-Einstellungen</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {agentTypes.map((type) => (
          <Card
            key={type.id}
            className={`cursor-pointer hover-scale transition-all ${
              data.type === type.id ? "ring-2 ring-purple-500 bg-gradient-accent/5" : ""
            }`}
            onClick={() => updateData({ type: type.id })}
          >
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center mx-auto mb-2">
                <type.icon className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">{type.name}</CardTitle>
              <CardDescription>{type.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            placeholder="z.B. Mein Sales Agent"
            value={data.name}
            onChange={(e) => updateData({ name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Beschreibung</Label>
          <Input
            id="description"
            placeholder="Kurze Beschreibung des Agenten"
            value={data.description || ""}
            onChange={(e) => updateData({ description: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">Sprache *</Label>
          <Select value={data.language} onValueChange={(value) => updateData({ language: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Deutsch">Deutsch</SelectItem>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Español">Español</SelectItem>
              <SelectItem value="Français">Français</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="agentType">Agenten-Typ</Label>
          <Select value={data.type} onValueChange={(value) => updateData({ type: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Typ wählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sales">Sales Agent</SelectItem>
              <SelectItem value="support">Support Agent</SelectItem>
              <SelectItem value="blank">Blank Agent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">DSGVO-Einstellungen</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="noPII"
              checked={data.noPII || false}
              onCheckedChange={(checked) => updateData({ noPII: checked })}
            />
            <Label htmlFor="noPII" className="text-sm">
              Keine personenbezogenen Daten (PII) speichern
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="anonymizeLogs"
              checked={data.anonymizeLogs || false}
              onCheckedChange={(checked) => updateData({ anonymizeLogs: checked })}
            />
            <Label htmlFor="anonymizeLogs" className="text-sm">
              Logs anonymisieren
            </Label>
          </div>
        </div>
      </div>
    </div>
  )
}
