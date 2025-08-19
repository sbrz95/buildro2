"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

interface GeneralSettingsProps {
  config: any
  updateConfig: (updates: any) => void
}

export function GeneralSettings({ config, updateConfig }: GeneralSettingsProps) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
        <span className="font-medium">General</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 space-y-3">
        <div className="space-y-2">
          <Label htmlFor="type">Typ</Label>
          <Select value={config.type} onValueChange={(value) => updateConfig({ type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard-chat">Standard Chat</SelectItem>
              <SelectItem value="website-widget">Website Widget</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
              <SelectItem value="messenger">Messenger</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={config.name}
            onChange={(e) => updateConfig({ name: e.target.value })}
            placeholder="Demo Name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="build">Build</Label>
          <Select value={config.build} onValueChange={(value) => updateConfig({ build: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sales-agent">Sales Agent</SelectItem>
              <SelectItem value="support-bot">Support Bot</SelectItem>
              <SelectItem value="custom-agent">Custom Agent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
