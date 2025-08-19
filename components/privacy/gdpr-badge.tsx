"use client"

import { AlertTriangle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface GDPRBadgeProps {
  feature: string
}

export function GDPRBadge({ feature }: GDPRBadgeProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center space-x-1 px-1.5 py-0.5 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded text-xs font-medium">
            <AlertTriangle className="h-3 w-3" />
            <span>DSGVO</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">Diese Funktion kann personenbezogene Daten übertragen.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
