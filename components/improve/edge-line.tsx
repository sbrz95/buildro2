"use client"

import type React from "react"

interface Edge {
  id: string
  from: string
  to: string
}

interface EdgeLineProps {
  edge: Edge
  from: { x: number; y: number }
  to: { x: number; y: number }
  isHovered?: boolean
  onHover?: () => void
  onLeave?: () => void
  onContextMenu?: (event: React.MouseEvent) => void
}

export function EdgeLine({ edge, from, to, isHovered, onHover, onLeave, onContextMenu }: EdgeLineProps) {
  const midX = (from.x + to.x) / 2
  const midY = (from.y + to.y) / 2

  // Create a curved path
  const path = `M ${from.x} ${from.y} Q ${midX} ${midY - 50} ${to.x} ${to.y}`

  const mockLatency = Math.floor(Math.random() * 250) + 50 // 50-300ms

  return (
    <g>
      <path
        d={path}
        stroke={isHovered ? "hsl(var(--primary))" : "hsl(var(--muted-foreground) / 0.3)"}
        strokeWidth={isHovered ? "3" : "2"}
        fill="none"
        strokeDasharray="5,5"
        className="transition-all duration-200"
      />

      {/* Arrow marker */}
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill={isHovered ? "hsl(var(--primary))" : "hsl(var(--muted-foreground) / 0.3)"}
          />
        </marker>
      </defs>
      <path d={path} stroke="transparent" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />

      <path
        d={path}
        stroke="transparent"
        strokeWidth="12"
        fill="none"
        className="cursor-pointer"
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        onContextMenu={onContextMenu}
        style={{ pointerEvents: "stroke" }}
      />

      {isHovered && (
        <foreignObject x={midX - 25} y={midY - 60} width="50" height="20">
          <div className="bg-popover border rounded px-2 py-1 text-xs text-center shadow-lg">{mockLatency}ms</div>
        </foreignObject>
      )}
    </g>
  )
}
