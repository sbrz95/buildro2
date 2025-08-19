"use client"

import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, Copy } from "lucide-react"
import { useState } from "react"

interface PlatformSettingsProps {
  config: any
  updateConfig: (updates: any) => void
}

export function PlatformSettings({ config, updateConfig }: PlatformSettingsProps) {
  const [isOpen, setIsOpen] = useState(false)

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(config.embedCode)
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
        <span className="font-medium">Platform Settings</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="embed-code">Widget Embed Code</Label>
            <Button variant="outline" size="sm" onClick={copyEmbedCode} className="hover-scale bg-transparent">
              <Copy className="mr-2 h-4 w-4" />
              Kopieren
            </Button>
          </div>
          <Textarea id="embed-code" value={config.embedCode} readOnly rows={3} className="font-mono text-sm bg-muted" />
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
