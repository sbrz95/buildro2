"use client"

import { useImproveStore } from "@/lib/stores/improve-store"
import { Edit2, Copy, Trash2 } from "lucide-react"
import { useState } from "react"

interface ContextMenuProps {
  position: { x: number; y: number }
  target: { type: "node" | "edge"; id: string } | null
  onClose: () => void
}

export function ContextMenu({ position, target, onClose }: ContextMenuProps) {
  const { deleteNode, deleteEdge, duplicateNode, updateNode, nodes } = useImproveStore()
  const [isRenaming, setIsRenaming] = useState(false)
  const [newName, setNewName] = useState("")

  if (!target) return null

  const handleRename = () => {
    if (target.type === "node") {
      const node = nodes.find((n) => n.id === target.id)
      if (node) {
        setNewName(node.data.name)
        setIsRenaming(true)
      }
    }
  }

  const handleRenameSubmit = () => {
    if (target.type === "node" && newName.trim()) {
      updateNode(target.id, {
        data: { ...nodes.find((n) => n.id === target.id)?.data, name: newName.trim() },
      })
    }
    setIsRenaming(false)
    onClose()
  }

  const handleDelete = () => {
    if (target.type === "node") {
      deleteNode(target.id)
    } else if (target.type === "edge") {
      deleteEdge(target.id)
    }
    onClose()
  }

  const handleDuplicate = () => {
    if (target.type === "node") {
      duplicateNode(target.id)
    }
    onClose()
  }

  return (
    <div
      className="absolute z-50 bg-popover border rounded-lg shadow-lg py-1 min-w-[160px]"
      style={{ left: position.x, top: position.y }}
    >
      {isRenaming ? (
        <div className="p-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRenameSubmit()
              if (e.key === "Escape") {
                setIsRenaming(false)
                onClose()
              }
            }}
            onBlur={handleRenameSubmit}
            className="w-full px-2 py-1 text-sm border rounded"
            autoFocus
          />
        </div>
      ) : (
        <>
          {target.type === "node" && (
            <>
              <button
                onClick={handleRename}
                className="w-full px-3 py-2 text-sm text-left hover:bg-accent flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Umbenennen
              </button>
              <button
                onClick={handleDuplicate}
                className="w-full px-3 py-2 text-sm text-left hover:bg-accent flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Duplizieren
              </button>
            </>
          )}
          <button
            onClick={handleDelete}
            className="w-full px-3 py-2 text-sm text-left hover:bg-accent text-destructive flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            {target.type === "node" ? "Löschen" : "Kante löschen"}
          </button>
        </>
      )}
    </div>
  )
}
