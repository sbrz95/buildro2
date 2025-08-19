"use client"

import type React from "react"

import { Bot, Webhook, FileUp, Zap } from "lucide-react"
import { Card } from "@/components/ui/card"

interface Node {
  id: string
  type: "main" | "worker" | "webhook" | "files"
  position: { x: number; y: number }
  data: {
    name: string
    config: any
  }
}

interface NodeCardProps {
  node: Node
  onClick: () => void
  onMouseDown: (event: React.MouseEvent) => void
  onContextMenu?: (event: React.MouseEvent) => void
  isConnectable?: boolean
  isSaved?: boolean
}

export function NodeCard({ node, onClick, onMouseDown, onContextMenu, isConnectable, isSaved }: NodeCardProps) {
  const getIcon = () => {
    switch (node.type) {
      case "main":
        return <Zap className="w-5 h-5 text-gradient" />
      case "worker":
        return <Bot className="w-5 h-5 text-blue-500" />
      case "webhook":
        return <Webhook className="w-5 h-5 text-emerald-500" />
      case "files":
        return <FileUp className="w-5 h-5 text-purple-500" />
      default:
        return <Bot className="w-5 h-5" />
    }
  }

  const getCardStyle = () => {
    let baseStyle = ""

    if (node.type === "main") {
      baseStyle = "bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-emerald-500/10 border-gradient"
    } else {
      baseStyle = "bg-card hover:bg-card/80"
    }

    if (isConnectable) {
      baseStyle +=
        " ring-2 ring-gradient-to-r ring-from-purple-500 ring-via-blue-500 ring-to-emerald-500 shadow-lg shadow-purple-500/20"
    }

    if (isSaved) {
      baseStyle += " ring-2 ring-green-500 animate-pulse"
    }

    return baseStyle
  }

  return (
    <Card
      className={`p-4 min-w-[180px] cursor-pointer transition-all hover:shadow-lg ${getCardStyle()}`}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onContextMenu={onContextMenu}
    >
      <div className="flex items-center gap-3">
        {getIcon()}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">{node.data.name}</h3>
          {node.type === "main" && (
            <p className="text-xs text-muted-foreground">Build-ID: {node.data.config.buildId}</p>
          )}
        </div>
      </div>
    </Card>
  )
}
