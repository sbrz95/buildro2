"use client"

import type React from "react"
import { useRef, useCallback, useState, useEffect } from "react"
import { NodeCard } from "./node-card"
import { EdgeLine } from "./edge-line"
import { ContextMenu } from "./context-menu"
import { Plus } from "lucide-react"
import { useImproveStore } from "@/lib/stores/improve-store"

interface Node {
  id: string
  type: "main" | "worker" | "webhook" | "files"
  position: { x: number; y: number }
  data: {
    name: string
    config: any
  }
}

interface Edge {
  id: string
  from: string
  to: string
}

interface CanvasProps {
  nodes: Node[]
  edges: Edge[]
  zoom: number
  gridEnabled: boolean
  onNodeClick: (nodeId: string) => void
  onHotspotClick: (position: { x: number; y: number }, hotspot: string) => void
  onNodeMove: (nodeId: string, position: { x: number; y: number }) => void
}

export function Canvas({ nodes, edges, zoom, gridEnabled, onNodeClick, onHotspotClick, onNodeMove }: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [draggedNode, setDraggedNode] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 })
  const [savedNodes, setSavedNodes] = useState<Set<string>>(new Set())

  const {
    contextMenu,
    hoveredEdge,
    connectingNodes,
    openContextMenu,
    closeContextMenu,
    setHoveredEdge,
    moveNode,
    saveToHistory,
  } = useImproveStore()

  const mainAgent = nodes.find((n) => n.type === "main") || {
    id: "main-agent",
    type: "main" as const,
    position: { x: 400, y: 300 },
    data: {
      name: "Haupt-Agent",
      config: { buildId: "build-123" },
    },
  }

  const handleHotspotClick = useCallback(
    (hotspot: string, event: React.MouseEvent) => {
      event.stopPropagation()
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      const position = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      }

      onHotspotClick(position, hotspot)
    },
    [onHotspotClick],
  )

  const handleNodeMouseDown = useCallback(
    (nodeId: string, event: React.MouseEvent) => {
      if (event.button !== 0) return // Only left click

      event.preventDefault()
      event.stopPropagation()

      const node = nodes.find((n) => n.id === nodeId)
      if (!node) return

      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      saveToHistory()

      setDraggedNode(nodeId)
      setDragOffset({
        x: event.clientX - rect.left - node.position.x,
        y: event.clientY - rect.top - node.position.y,
      })
    },
    [nodes, saveToHistory],
  )

  const handleNodeContextMenu = useCallback(
    (nodeId: string, event: React.MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()

      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      openContextMenu({ x: event.clientX - rect.left, y: event.clientY - rect.top }, { type: "node", id: nodeId })
    },
    [openContextMenu],
  )

  const handleEdgeContextMenu = useCallback(
    (edgeId: string, event: React.MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()

      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      openContextMenu({ x: event.clientX - rect.left, y: event.clientY - rect.top }, { type: "edge", id: edgeId })
    },
    [openContextMenu],
  )

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!draggedNode || !canvasRef.current) return

      const rect = canvasRef.current.getBoundingClientRect()
      const newPosition = {
        x: event.clientX - rect.left - dragOffset.x,
        y: event.clientY - rect.top - dragOffset.y,
      }

      moveNode(draggedNode, newPosition)
    },
    [draggedNode, dragOffset, moveNode],
  )

  const handleMouseUp = useCallback(() => {
    if (draggedNode) {
      setSavedNodes((prev) => new Set([...prev, draggedNode]))
      setTimeout(() => {
        setSavedNodes((prev) => {
          const newSet = new Set(prev)
          newSet.delete(draggedNode)
          return newSet
        })
      }, 1000)
    }

    setDraggedNode(null)
    setDragOffset({ x: 0, y: 0 })
  }, [draggedNode])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "z" && !event.shiftKey) {
        event.preventDefault()
        useImproveStore.getState().undo()
      } else if (
        ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === "Z") ||
        ((event.ctrlKey || event.metaKey) && event.key === "y")
      ) {
        event.preventDefault()
        useImproveStore.getState().redo()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    if (draggedNode) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [draggedNode, handleMouseMove, handleMouseUp])

  const handleCanvasClick = useCallback(() => {
    if (contextMenu.isOpen) {
      closeContextMenu()
    }
  }, [contextMenu.isOpen, closeContextMenu])

  return (
    <div
      ref={canvasRef}
      className="w-full h-full relative overflow-hidden cursor-grab active:cursor-grabbing"
      onClick={handleCanvasClick}
      style={{
        backgroundImage: gridEnabled
          ? `radial-gradient(circle, hsl(var(--muted-foreground) / 0.2) 1px, transparent 1px)`
          : "none",
        backgroundSize: gridEnabled ? "20px 20px" : "auto",
        transform: `scale(${zoom}) translate(${canvasOffset.x}px, ${canvasOffset.y}px)`,
      }}
    >
      {/* Render edges */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {edges.map((edge) => {
          const fromNode = nodes.find((n) => n.id === edge.from)
          const toNode = nodes.find((n) => n.id === edge.to)

          if (!fromNode || !toNode) return null

          return (
            <EdgeLine
              key={edge.id}
              edge={edge}
              from={fromNode.position}
              to={toNode.position}
              isHovered={hoveredEdge === edge.id}
              onHover={() => setHoveredEdge(edge.id)}
              onLeave={() => setHoveredEdge(null)}
              onContextMenu={(e) => handleEdgeContextMenu(edge.id, e)}
            />
          )
        })}
      </svg>

      {/* Main Agent with Hotspots */}
      <div
        className="absolute"
        style={{
          left: mainAgent.position.x,
          top: mainAgent.position.y,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="relative">
          <NodeCard
            node={mainAgent}
            onClick={() => onNodeClick(mainAgent.id)}
            onMouseDown={(e) => handleNodeMouseDown(mainAgent.id, e)}
            onContextMenu={(e) => handleNodeContextMenu(mainAgent.id, e)}
            isConnectable={connectingNodes.includes(mainAgent.id)}
            isSaved={savedNodes.has(mainAgent.id)}
          />

          {/* Hotspots */}
          <button
            className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-purple-500 via-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"
            onClick={(e) => handleHotspotClick("top", e)}
          >
            <Plus className="w-4 h-4" />
          </button>

          <button
            className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-purple-500 via-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"
            onClick={(e) => handleHotspotClick("bottom", e)}
          >
            <Plus className="w-4 h-4" />
          </button>

          <button
            className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-purple-500 via-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"
            onClick={(e) => handleHotspotClick("left", e)}
          >
            <Plus className="w-4 h-4" />
          </button>

          <button
            className="absolute -right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-purple-500 via-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"
            onClick={(e) => handleHotspotClick("right", e)}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Other Nodes */}
      {nodes
        .filter((n) => n.type !== "main")
        .map((node) => (
          <div
            key={node.id}
            className="absolute"
            style={{
              left: node.position.x,
              top: node.position.y,
              transform: "translate(-50%, -50%)",
            }}
          >
            <NodeCard
              node={node}
              onClick={() => onNodeClick(node.id)}
              onMouseDown={(e) => handleNodeMouseDown(node.id, e)}
              onContextMenu={(e) => handleNodeContextMenu(node.id, e)}
              isConnectable={connectingNodes.includes(node.id)}
              isSaved={savedNodes.has(node.id)}
            />
          </div>
        ))}

      {/* Context Menu */}
      {contextMenu.isOpen && (
        <ContextMenu position={contextMenu.position} target={contextMenu.target} onClose={closeContextMenu} />
      )}
    </div>
  )
}
