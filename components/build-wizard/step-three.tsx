"use client"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"

interface StepThreeProps {
  data: any
  updateData: (data: any) => void
}

export function StepThree({ data, updateData }: StepThreeProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Persönlichkeit & Prompt</h2>
        <p className="text-muted-foreground">Definiere den System Prompt und Parameter für deinen Agenten</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="systemPrompt">System Prompt *</Label>
          <Textarea
            id="systemPrompt"
            placeholder="Du bist ein hilfsreicher AI-Agent. Deine Aufgabe ist es..."
            value={data.systemPrompt || ""}
            onChange={(e) => updateData({ systemPrompt: e.target.value })}
            rows={6}
            required
          />
          <p className="text-xs text-muted-foreground">
            Definiere hier die Rolle, Persönlichkeit und Verhaltensweisen deines Agenten
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Kreativität (Temperature): {data.temperature || 0.7}</Label>
            <Slider
              value={[data.temperature || 0.7]}
              onValueChange={(value) => updateData({ temperature: value[0] })}
              max={2}
              min={0}
              step={0.1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Niedrige Werte = konservative Antworten, Hohe Werte = kreative Antworten
            </p>
          </div>

          <div className="space-y-2">
            <Label>Max Tokens: {data.maxTokens || 1000}</Label>
            <Slider
              value={[data.maxTokens || 1000]}
              onValueChange={(value) => updateData({ maxTokens: value[0] })}
              max={4000}
              min={100}
              step={100}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">Maximale Länge der Antworten (100 = kurz, 4000 = sehr lang)</p>
          </div>
        </div>
      </div>
    </div>
  )
}
