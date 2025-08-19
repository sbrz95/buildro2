"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, Plus, X } from "lucide-react"
import { useState } from "react"

interface DomainSettingsProps {
  config: any
  updateConfig: (updates: any) => void
}

export function DomainSettings({ config, updateConfig }: DomainSettingsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [newDomain, setNewDomain] = useState("")

  const addDomain = () => {
    if (newDomain.trim()) {
      updateConfig({
        allowedDomains: [...config.allowedDomains, newDomain.trim()],
      })
      setNewDomain("")
    }
  }

  const removeDomain = (index: number) => {
    updateConfig({
      allowedDomains: config.allowedDomains.filter((_: any, i: number) => i !== index),
    })
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
        <span className="font-medium">Domain Settings</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 space-y-3">
        <div className="space-y-2">
          <Label>Allowed Domains</Label>
          <div className="space-y-2">
            {config.allowedDomains.map((domain: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <Input value={domain} readOnly className="flex-1" />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeDomain(index)}
                  className="h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex space-x-2">
              <Input
                placeholder="example.com"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addDomain()}
              />
              <Button
                onClick={addDomain}
                size="icon"
                className="bg-gradient-accent hover:bg-gradient-accent/90 text-white"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
