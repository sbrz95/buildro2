"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

interface AppearanceSettingsProps {
  config: any
  updateConfig: (updates: any) => void
}

export function AppearanceSettings({ config, updateConfig }: AppearanceSettingsProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
        <span className="font-medium">Appearance</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 space-y-3">
        <div className="space-y-2">
          <Label htmlFor="theme">Theme</Label>
          <Select value={config.theme} onValueChange={(value) => updateConfig({ theme: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="auto">Auto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand-color">Brand Color</Label>
          <div className="flex space-x-2">
            <Input
              id="brand-color"
              type="color"
              value={config.brandColor}
              onChange={(e) => updateConfig({ brandColor: e.target.value })}
              className="w-12 h-10 p-1 border rounded"
            />
            <Input
              value={config.brandColor}
              onChange={(e) => updateConfig({ brandColor: e.target.value })}
              placeholder="#a855f7"
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="logo">Logo URL</Label>
          <Input
            id="logo"
            value={config.logo}
            onChange={(e) => updateConfig({ logo: e.target.value })}
            placeholder="https://example.com/logo.png"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="position">Position</Label>
          <Select value={config.position} onValueChange={(value) => updateConfig({ position: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bottom-right">Bottom Right</SelectItem>
              <SelectItem value="bottom-left">Bottom Left</SelectItem>
              <SelectItem value="top-right">Top Right</SelectItem>
              <SelectItem value="top-left">Top Left</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="launch-text">Launch Text</Label>
          <Input
            id="launch-text"
            value={config.launchText}
            onChange={(e) => updateConfig({ launchText: e.target.value })}
            placeholder="Wie kann ich helfen?"
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
