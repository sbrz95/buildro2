import { Badge } from "@/components/ui/badge"
import { Brain } from "lucide-react"

interface ModelDisclosureProps {
  model: string
  provider: string
  className?: string
}

export function ModelDisclosure({ model, provider, className = "" }: ModelDisclosureProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Brain className="h-3 w-3 text-muted-foreground" />
      <Badge variant="outline" className="text-xs">
        {provider} {model}
      </Badge>
    </div>
  )
}
