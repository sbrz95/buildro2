"use client"

import { useState, useCallback, useEffect } from "react"
import { Canvas } from "@/components/improve/canvas"
import { TestLab } from "@/components/improve/test-lab"
import { Toolbar } from "@/components/improve/toolbar"
import { NodeDrawer } from "@/components/improve/node-drawer"
import { IntegrationPopover } from "@/components/improve/integration-popover"
import { useImproveStore } from "@/lib/stores/improve-store"
import { toast } from "sonner"

export default function ImprovePage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [popoverPosition, setPopoverPosition] = useState<{ x: number; y: number } | null>(null)
  const [showPopover, setShowPopover] = useState(false)
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null)

  const {
    nodes,
    edges,
    zoom,
    gridEnabled,
    unsavedChanges,
    setZoom,
    toggleGrid,
    fitToScreen,
    autoLayout,
    addNode,
    updateNode,
    deleteNode,
    addEdge,
    deleteEdge,
    saveGraph,
  } = useImproveStore()

  const handleNodeClick = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId)
    setIsDrawerOpen(true)
  }, [])

  const handleHotspotClick = useCallback((position: { x: number; y: number }, hotspot: string) => {
    setPopoverPosition(position)
    setActiveHotspot(hotspot)
    setShowPopover(true)
  }, [])

  const handleIntegrationSelect = useCallback(
    (type: "worker" | "webhook" | "files") => {
      if (!activeHotspot) return

      const newNode = {
        id: `node-${Date.now()}`,
        type,
        position: { x: 0, y: 0 }, // Will be calculated based on hotspot
        data: {
          name: type === "worker" ? "Neuer Worker Agent" : type === "webhook" ? "Webhook Integration" : "File Upload",
          config: {},
        },
      }

      addNode(newNode)

      // Add edge from main agent to new node
      const mainAgent = nodes.find((n) => n.type === "main")
      if (mainAgent) {
        addEdge({
          id: `edge-${Date.now()}`,
          from: mainAgent.id,
          to: newNode.id,
        })
      }

      setShowPopover(false)
      setSelectedNodeId(newNode.id)
      setIsDrawerOpen(true)

      toast.success(
        `${type === "worker" ? "Worker Agent" : type === "webhook" ? "Webhook" : "File Upload"} hinzugefügt`,
      )
    },
    [activeHotspot, nodes, addNode, addEdge],
  )

  const handleSave = useCallback(async () => {
    try {
      await saveGraph()
      toast.success("Änderungen gespeichert")
    } catch (error) {
      toast.error("Fehler beim Speichern")
    }
  }, [saveGraph])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" && selectedNodeId) {
        const node = nodes.find((n) => n.id === selectedNodeId)
        if (node && node.type !== "main") {
          deleteNode(selectedNodeId)
          setIsDrawerOpen(false)
          setSelectedNodeId(null)
        }
      }

      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault()
        handleSave()
      }

      if ((e.metaKey || e.ctrlKey) && e.key === "0") {
        e.preventDefault()
        fitToScreen()
      }

      if (e.key === "g" || e.key === "G") {
        toggleGrid()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedNodeId, nodes, deleteNode, handleSave, fitToScreen, toggleGrid])

  return (
    <div className="h-screen flex bg-background">
      {/* Canvas Area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Header with save indicator */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <div className="bg-card/80 backdrop-blur-sm border rounded-lg px-3 py-1.5 text-sm">
            <span className="text-muted-foreground">Agent Integration</span>
            {unsavedChanges && <span className="ml-2 w-2 h-2 bg-orange-500 rounded-full inline-block" />}
          </div>
        </div>

        {/* Canvas */}
        <Canvas
          nodes={nodes}
          edges={edges}
          zoom={zoom}
          gridEnabled={gridEnabled}
          onNodeClick={handleNodeClick}
          onHotspotClick={handleHotspotClick}
          onNodeMove={(nodeId, position) => {
            updateNode(nodeId, { position })
          }}
        />

        {/* Toolbar */}
        <Toolbar
          zoom={zoom}
          gridEnabled={gridEnabled}
          onZoomIn={() => setZoom(Math.min(zoom * 1.2, 3))}
          onZoomOut={() => setZoom(Math.max(zoom / 1.2, 0.1))}
          onFitToScreen={fitToScreen}
          onAutoLayout={autoLayout}
          onToggleGrid={toggleGrid}
        />

        {/* Integration Popover */}
        {showPopover && popoverPosition && (
          <IntegrationPopover
            position={popoverPosition}
            onSelect={handleIntegrationSelect}
            onClose={() => setShowPopover(false)}
          />
        )}
      </div>

      {/* Test Lab Sidebar */}
      <div className="w-[440px] border-l bg-card/50">
        <TestLab />
      </div>

      {/* Node Configuration Drawer */}
      <NodeDrawer
        isOpen={isDrawerOpen}
        nodeId={selectedNodeId}
        onClose={() => {
          setIsDrawerOpen(false)
          setSelectedNodeId(null)
        }}
        onSave={(nodeId, data) => {
          updateNode(nodeId, { data })
          toast.success("Konfiguration gespeichert")
        }}
        onDelete={(nodeId) => {
          deleteNode(nodeId)
          setIsDrawerOpen(false)
          setSelectedNodeId(null)
          toast.success("Integration entfernt")
        }}
      />
    </div>
  )
}
