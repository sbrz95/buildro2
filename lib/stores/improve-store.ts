"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

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

interface HistoryState {
  nodes: Node[]
  edges: Edge[]
}

interface ImproveStore {
  nodes: Node[]
  edges: Edge[]
  zoom: number
  gridEnabled: boolean
  unsavedChanges: boolean
  history: HistoryState[]
  historyIndex: number
  contextMenu: {
    isOpen: boolean
    position: { x: number; y: number }
    target: { type: "node" | "edge"; id: string } | null
  }
  hoveredEdge: string | null
  connectingNodes: string[]

  // Actions
  setZoom: (zoom: number) => void
  toggleGrid: () => void
  fitToScreen: () => void
  autoLayout: () => void
  addNode: (node: Node) => void
  updateNode: (id: string, updates: Partial<Node>) => void
  deleteNode: (id: string) => void
  duplicateNode: (id: string) => void
  addEdge: (edge: Edge) => void
  deleteEdge: (id: string) => void
  saveGraph: () => Promise<void>
  moveNode: (id: string, position: { x: number; y: number }) => void
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
  saveToHistory: () => void
  openContextMenu: (position: { x: number; y: number }, target: { type: "node" | "edge"; id: string }) => void
  closeContextMenu: () => void
  setHoveredEdge: (edgeId: string | null) => void
  setConnectingNodes: (nodeIds: string[]) => void
}

export const useImproveStore = create<ImproveStore>()(
  persist(
    (set, get) => ({
      nodes: [
        {
          id: "main-agent",
          type: "main",
          position: { x: 400, y: 300 },
          data: {
            name: "Haupt-Agent",
            config: { buildId: "build-123" },
          },
        },
      ],
      edges: [],
      zoom: 1,
      gridEnabled: true,
      unsavedChanges: false,
      history: [],
      historyIndex: -1,
      contextMenu: {
        isOpen: false,
        position: { x: 0, y: 0 },
        target: null,
      },
      hoveredEdge: null,
      connectingNodes: [],

      setZoom: (zoom) => set({ zoom }),

      toggleGrid: () => set((state) => ({ gridEnabled: !state.gridEnabled })),

      fitToScreen: () => set({ zoom: 1 }),

      autoLayout: () => {
        const { nodes, saveToHistory } = get()
        saveToHistory()

        const mainAgent = nodes.find((n) => n.type === "main")
        if (!mainAgent) return

        const otherNodes = nodes.filter((n) => n.type !== "main")
        const radius = 200
        const angleStep = (2 * Math.PI) / Math.max(otherNodes.length, 1)

        const updatedNodes = nodes.map((node) => {
          if (node.type === "main") return node

          const index = otherNodes.findIndex((n) => n.id === node.id)
          const angle = index * angleStep

          return {
            ...node,
            position: {
              x: mainAgent.position.x + Math.cos(angle) * radius,
              y: mainAgent.position.y + Math.sin(angle) * radius,
            },
          }
        })

        set({ nodes: updatedNodes, unsavedChanges: true })
      },

      addNode: (node) => {
        const { saveToHistory } = get()
        saveToHistory()
        set((state) => ({
          nodes: [...state.nodes, node],
          unsavedChanges: true,
        }))
      },

      updateNode: (id, updates) =>
        set((state) => ({
          nodes: state.nodes.map((node) => (node.id === id ? { ...node, ...updates } : node)),
          unsavedChanges: true,
        })),

      deleteNode: (id) => {
        const { saveToHistory } = get()
        saveToHistory()
        set((state) => ({
          nodes: state.nodes.filter((node) => node.id !== id),
          edges: state.edges.filter((edge) => edge.from !== id && edge.to !== id),
          unsavedChanges: true,
        }))
      },

      duplicateNode: (id) => {
        const { nodes, saveToHistory } = get()
        saveToHistory()

        const nodeToDuplicate = nodes.find((n) => n.id === id)
        if (!nodeToDuplicate) return

        const newNode: Node = {
          ...nodeToDuplicate,
          id: `${nodeToDuplicate.id}-copy-${Date.now()}`,
          position: {
            x: nodeToDuplicate.position.x + 50,
            y: nodeToDuplicate.position.y + 50,
          },
          data: {
            ...nodeToDuplicate.data,
            name: `${nodeToDuplicate.data.name} (Kopie)`,
          },
        }

        set((state) => ({
          nodes: [...state.nodes, newNode],
          unsavedChanges: true,
        }))
      },

      addEdge: (edge) => {
        const { saveToHistory } = get()
        saveToHistory()
        set((state) => ({
          edges: [...state.edges, edge],
          unsavedChanges: true,
        }))
      },

      deleteEdge: (id) => {
        const { saveToHistory } = get()
        saveToHistory()
        set((state) => ({
          edges: state.edges.filter((edge) => edge.id !== id),
          unsavedChanges: true,
        }))
      },

      moveNode: (id, position) => {
        const { gridEnabled } = get()
        let finalPosition = position

        if (gridEnabled) {
          const gridSize = 20
          finalPosition = {
            x: Math.round(position.x / gridSize) * gridSize,
            y: Math.round(position.y / gridSize) * gridSize,
          }
        }

        set((state) => ({
          nodes: state.nodes.map((node) => (node.id === id ? { ...node, position: finalPosition } : node)),
          unsavedChanges: true,
        }))
      },

      saveToHistory: () => {
        const { nodes, edges, history, historyIndex } = get()
        const newHistoryState = { nodes: [...nodes], edges: [...edges] }
        const newHistory = history.slice(0, historyIndex + 1)
        newHistory.push(newHistoryState)

        // Keep only last 10 states
        if (newHistory.length > 10) {
          newHistory.shift()
        }

        set({
          history: newHistory,
          historyIndex: newHistory.length - 1,
        })
      },

      undo: () => {
        const { history, historyIndex } = get()
        if (historyIndex > 0) {
          const previousState = history[historyIndex - 1]
          set({
            nodes: [...previousState.nodes],
            edges: [...previousState.edges],
            historyIndex: historyIndex - 1,
            unsavedChanges: true,
          })
        }
      },

      redo: () => {
        const { history, historyIndex } = get()
        if (historyIndex < history.length - 1) {
          const nextState = history[historyIndex + 1]
          set({
            nodes: [...nextState.nodes],
            edges: [...nextState.edges],
            historyIndex: historyIndex + 1,
            unsavedChanges: true,
          })
        }
      },

      canUndo: () => {
        const { historyIndex } = get()
        return historyIndex > 0
      },

      canRedo: () => {
        const { history, historyIndex } = get()
        return historyIndex < history.length - 1
      },

      openContextMenu: (position, target) => {
        set({
          contextMenu: {
            isOpen: true,
            position,
            target,
          },
        })
      },

      closeContextMenu: () => {
        set({
          contextMenu: {
            isOpen: false,
            position: { x: 0, y: 0 },
            target: null,
          },
        })
      },

      setHoveredEdge: (edgeId) => set({ hoveredEdge: edgeId }),

      setConnectingNodes: (nodeIds) => set({ connectingNodes: nodeIds }),

      saveGraph: async () => {
        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 500))
        set({ unsavedChanges: false })
      },
    }),
    {
      name: "improve-store",
    },
  ),
)
