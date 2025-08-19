"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Rocket, Users, MessageSquare } from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Subaccount {
  id: string
  name: string
  agents: number
  status: "active" | "inactive" | "pending"
  conversations: number
  createdAt: string
}

export default function LaunchPage() {
  const [subaccounts, setSubaccounts] = useState<Subaccount[]>([
    {
      id: "sub-001",
      name: "E-Commerce Store",
      agents: 3,
      status: "active",
      conversations: 1247,
      createdAt: "vor 2 Wochen",
    },
    {
      id: "sub-002",
      name: "Support Center",
      agents: 1,
      status: "active",
      conversations: 892,
      createdAt: "vor 1 Woche",
    },
  ])

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newSubaccountName, setNewSubaccountName] = useState("")

  const createSubaccount = () => {
    if (newSubaccountName.trim()) {
      const newSubaccount: Subaccount = {
        id: `sub-${Date.now()}`,
        name: newSubaccountName.trim(),
        agents: 0,
        status: "pending",
        conversations: 0,
        createdAt: "gerade eben",
      }
      setSubaccounts([...subaccounts, newSubaccount])
      setNewSubaccountName("")
      setIsCreateModalOpen(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "inactive":
        return "bg-gray-500"
      case "pending":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Aktiv"
      case "inactive":
        return "Inaktiv"
      case "pending":
        return "Ausstehend"
      default:
        return "Unbekannt"
    }
  }

  if (subaccounts.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Launch</h1>
            <p className="text-muted-foreground">Deploye und verwalte deine Agenten in der Produktion</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 bg-gradient-accent rounded-xl flex items-center justify-center mb-6 shadow-glow">
            <Rocket className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Starte mit deinem ersten Subaccount</h2>
          <p className="text-muted-foreground mb-6 text-center max-w-md">
            Erstelle einen Subaccount, um deine Agenten zu organisieren und in der Produktion zu deployen
          </p>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-accent hover:bg-gradient-accent/90 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Subaccount erstellen
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Neuen Subaccount erstellen</DialogTitle>
                <DialogDescription>
                  Erstelle einen neuen Subaccount, um deine Agenten zu organisieren und zu deployen
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subaccount-name">Subaccount Name</Label>
                  <Input
                    id="subaccount-name"
                    placeholder="z.B. Mein E-Commerce Store"
                    value={newSubaccountName}
                    onChange={(e) => setNewSubaccountName(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && createSubaccount()}
                  />
                </div>
                <Button
                  onClick={createSubaccount}
                  disabled={!newSubaccountName.trim()}
                  className="w-full bg-gradient-accent hover:bg-gradient-accent/90 text-white"
                >
                  Subaccount erstellen
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Launch</h1>
          <p className="text-muted-foreground">Verwalte deine Subaccounts und deployten Agenten</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-accent hover:bg-gradient-accent/90 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Neuer Subaccount
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Neuen Subaccount erstellen</DialogTitle>
              <DialogDescription>
                Erstelle einen neuen Subaccount, um deine Agenten zu organisieren und zu deployen
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subaccount-name">Subaccount Name</Label>
                <Input
                  id="subaccount-name"
                  placeholder="z.B. Mein E-Commerce Store"
                  value={newSubaccountName}
                  onChange={(e) => setNewSubaccountName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && createSubaccount()}
                />
              </div>
              <Button
                onClick={createSubaccount}
                disabled={!newSubaccountName.trim()}
                className="w-full bg-gradient-accent hover:bg-gradient-accent/90 text-white"
              >
                Subaccount erstellen
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subaccounts.map((subaccount) => (
          <Link key={subaccount.id} href={`/launch/${subaccount.id}`}>
            <Card className="hover-scale cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{subaccount.name}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(subaccount.status)}`}></div>
                    <Badge variant="outline" className="text-xs">
                      {getStatusText(subaccount.status)}
                    </Badge>
                  </div>
                </div>
                <CardDescription>ID: {subaccount.id}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>Agenten:</span>
                    </div>
                    <span className="font-medium">{subaccount.agents}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span>Gespräche:</span>
                    </div>
                    <span className="font-medium">{subaccount.conversations.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Erstellt:</span>
                    <span>{subaccount.createdAt}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
