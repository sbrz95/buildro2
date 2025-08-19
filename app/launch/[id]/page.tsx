"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, MessageSquare, Users, TrendingUp, Activity, BarChart3, Settings } from "lucide-react"
import { LaunchSidebar } from "@/components/launch/launch-sidebar"
import { BackButton } from "@/components/ui/back-button"

interface Agent {
  id: string
  name: string
  type: string
  status: "active" | "inactive"
  conversations: number
  responseRate: number
}

export default function SubaccountPage({ params }: { params: { id: string } }) {
  const [agents] = useState<Agent[]>([
    {
      id: "agent-001",
      name: "Sales Assistant",
      type: "Sales",
      status: "active",
      conversations: 847,
      responseRate: 94.2,
    },
    {
      id: "agent-002",
      name: "Support Bot",
      type: "Support",
      status: "active",
      conversations: 623,
      responseRate: 98.1,
    },
  ])

  const kpiData = {
    conversations: 1470,
    messages: 8924,
    responseRate: 96.1,
    activeAgents: agents.filter((a) => a.status === "active").length,
  }

  return (
    <div className="h-screen flex bg-white text-gray-900">
      {/* Mini Sidebar */}
      <LaunchSidebar subaccountId={params.id} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b bg-white">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <BackButton href="/launch" className="hover:bg-gray-100" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Subaccount Dashboard</h1>
                <p className="text-sm text-gray-600">ID: {params.id}</p>
              </div>
            </div>

            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Agent hinzufügen
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-[#F9FAFB] border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.1)] dark:bg-[#1A1A1A] dark:border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#374151] dark:text-gray-400">Gespräche</CardTitle>
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#111827] dark:text-white">
                    {kpiData.conversations.toLocaleString()}
                  </div>
                  <p className="text-xs text-green-600">+12% seit letztem Monat</p>
                </CardContent>
              </Card>

              <Card className="bg-[#F9FAFB] border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.1)] dark:bg-[#1A1A1A] dark:border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#374151] dark:text-gray-400">Nachrichten</CardTitle>
                  <BarChart3 className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#111827] dark:text-white">
                    {kpiData.messages.toLocaleString()}
                  </div>
                  <p className="text-xs text-green-600">+8% seit letztem Monat</p>
                </CardContent>
              </Card>

              <Card className="bg-[#F9FAFB] border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.1)] dark:bg-[#1A1A1A] dark:border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#374151] dark:text-gray-400">Antwortrate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#111827] dark:text-white">{kpiData.responseRate}%</div>
                  <p className="text-xs text-green-600">+2.1% seit letztem Monat</p>
                </CardContent>
              </Card>

              <Card className="bg-[#F9FAFB] border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.1)] dark:bg-[#1A1A1A] dark:border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#374151] dark:text-gray-400">
                    Aktive Agenten
                  </CardTitle>
                  <Activity className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#111827] dark:text-white">{kpiData.activeAgents}</div>
                  <p className="text-xs text-[#374151] dark:text-gray-400">von {agents.length} gesamt</p>
                </CardContent>
              </Card>
            </div>

            {/* Agents Section */}
            <Card className="bg-[#F9FAFB] border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.1)] dark:bg-[#1A1A1A] dark:border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-[#111827] dark:text-white">KI-Agenten</CardTitle>
                    <CardDescription className="text-[#374151] dark:text-gray-400">
                      Verwalte deine deployten Agenten
                    </CardDescription>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Agent hinzufügen
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {agents.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#111827] dark:text-white mb-2">
                      Keine Agenten gefunden
                    </h3>
                    <p className="text-[#374151] dark:text-gray-400 mb-6">
                      Füge deinen ersten Agenten hinzu, um zu beginnen
                    </p>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="mr-2 h-4 w-4" />
                      Agent hinzufügen
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {agents.map((agent) => (
                      <div
                        key={agent.id}
                        className="flex items-center justify-between p-4 border border-[#E5E7EB] rounded-lg hover:bg-white dark:border-gray-700 dark:hover:bg-gray-800 transition-colors shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Users className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-[#111827] dark:text-white">{agent.name}</h4>
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  agent.status === "active"
                                    ? "border-green-200 text-green-700 bg-green-50"
                                    : "border-gray-200 text-gray-700 bg-gray-50"
                                }`}
                              >
                                {agent.status === "active" ? "Aktiv" : "Inaktiv"}
                              </Badge>
                              <span className="text-sm text-[#374151] dark:text-gray-400">{agent.type}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-6 text-sm text-[#374151] dark:text-gray-400">
                          <div className="text-center">
                            <div className="font-medium text-[#111827] dark:text-white">{agent.conversations}</div>
                            <div>Gespräche</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-[#111827] dark:text-white">{agent.responseRate}%</div>
                            <div>Antwortrate</div>
                          </div>
                          <Button variant="ghost" size="sm" className="hover:bg-gray-100 dark:hover:bg-gray-700">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
