"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

interface ClientMessageSettingsProps {
  config: any
  updateConfig: (updates: any) => void
}

export function ClientMessageSettings({ config, updateConfig }: ClientMessageSettingsProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
        <span className="font-medium">Client Message</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 space-y-3">
        <div className="space-y-2">
          <Label htmlFor="placeholder">Placeholder</Label>
          <Input
            id="placeholder"
            value={config.placeholder}
            onChange={(e) => updateConfig({ placeholder: e.target.value })}
            placeholder="Schreiben Sie eine Nachricht..."
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="allow-uploads">Allow Uploads</Label>
          <Switch
            id="allow-uploads"
            checked={config.allowUploads}
            onCheckedChange={(checked) => updateConfig({ allowUploads: checked })}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
