"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

interface UsageLimitsProps {
  config: any
  updateConfig: (updates: any) => void
}

export function UsageLimits({ config, updateConfig }: UsageLimitsProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
        <span className="font-medium">Usage & Limits</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 space-y-3">
        <div className="space-y-2">
          <Label htmlFor="monthly-limit">Monthly Limit</Label>
          <Input
            id="monthly-limit"
            type="number"
            value={config.monthlyLimit}
            onChange={(e) => updateConfig({ monthlyLimit: Number.parseInt(e.target.value) || 0 })}
            placeholder="1000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="daily-limit">Daily Limit</Label>
          <Input
            id="daily-limit"
            type="number"
            value={config.dailyLimit}
            onChange={(e) => updateConfig({ dailyLimit: Number.parseInt(e.target.value) || 0 })}
            placeholder="100"
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
