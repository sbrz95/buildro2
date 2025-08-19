"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Building, Users, BarChart3, UserPlus, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const sidebarItems = [
  { name: "All Subaccounts", href: "/launch", icon: Building },
  { name: "AI Agents", href: "#agents", icon: Users },
  { name: "Dashboard", href: "#dashboard", icon: BarChart3 },
  { name: "Team", href: "#team", icon: UserPlus },
  { name: "Settings", href: "#settings", icon: Settings },
]

interface LaunchSidebarProps {
  subaccountId: string
}

export function LaunchSidebar({ subaccountId }: LaunchSidebarProps) {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <span className="font-semibold text-gray-900">Launch</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = item.href === "/launch" ? pathname === "/launch" : false
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                  isActive && "bg-blue-50 text-blue-700 hover:bg-blue-50 hover:text-blue-700",
                )}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 mb-2">Subaccount</div>
        <div className="text-sm font-medium text-gray-900 truncate">{subaccountId}</div>
      </div>
    </div>
  )
}
