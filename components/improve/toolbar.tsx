"use client"

import { ZoomIn, ZoomOut, Maximize, LayoutGrid, Grid3X3, Undo, Redo } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useImproveStore } from "@/lib/stores/improve-store"

interface ToolbarProps {
  zoom: number
  gridEnabled: boolean
  onZoomIn: () => void
  onZoomOut: () => void
  onFitToScreen: () => void
  onAutoLayout: () => void
  onToggleGrid: () => void
}

export function Toolbar({
  zoom,
  gridEnabled,
  onZoomIn,
  onZoomOut,
  onFitToScreen,
  onAutoLayout,
  onToggleGrid,
}: ToolbarProps) {
  const { undo, redo, canUndo, canRedo } = useImproveStore()

  return (
    <Card className="absolute bottom-4 left-4 p-2 bg-card/80 backdrop-blur-sm">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={undo}
          disabled={!canUndo()}
          className="h-8 w-8 p-0"
          title="Rückgängig (Strg+Z)"
        >
          <Undo className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={redo}
          disabled={!canRedo()}
          className="h-8 w-8 p-0"
          title="Wiederholen (Strg+Y)"
        >
          <Redo className="w-4 h-4" />
        </Button>

        <div className="w-px h-4 bg-border mx-1" />

        <Button variant="ghost" size="sm" onClick={onZoomOut} disabled={zoom <= 0.1} className="h-8 w-8 p-0">
          <ZoomOut className="w-4 h-4" />
        </Button>

        <div className="px-2 text-xs text-muted-foreground min-w-[3rem] text-center">{Math.round(zoom * 100)}%</div>

        <Button variant="ghost" size="sm" onClick={onZoomIn} disabled={zoom >= 3} className="h-8 w-8 p-0">
          <ZoomIn className="w-4 h-4" />
        </Button>

        <div className="w-px h-4 bg-border mx-1" />

        <Button variant="ghost" size="sm" onClick={onFitToScreen} className="h-8 w-8 p-0">
          <Maximize className="w-4 h-4" />
        </Button>

        <Button variant="ghost" size="sm" onClick={onAutoLayout} className="h-8 w-8 p-0">
          <LayoutGrid className="w-4 h-4" />
        </Button>

        <Button variant={gridEnabled ? "default" : "ghost"} size="sm" onClick={onToggleGrid} className="h-8 w-8 p-0">
          <Grid3X3 className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  )
}
