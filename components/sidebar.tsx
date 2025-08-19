"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Hammer,
  TrendingUp,
  Play,
  Rocket,
  Store,
  Brain,
  Key,
  TestTube,
  Video,
  HelpCircle,
  Users,
  Settings,
  LogOut,
  Bot,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const workspaceItems = [
  { name: "Build", href: "/build", icon: Hammer },
  { name: "Improve", href: "/improve", icon: TrendingUp },
  { name: "Demo", href: "/demo", icon: Play },
  { name: "Launch", href: "/launch", icon: Rocket },
]

const resourceItems = [
  { name: "Marketplace", href: "/marketplace", icon: Store },
  { name: "AI Mentor", href: "/mentor", icon: Brain },
  { name: "API Key", href: "/api-keys", icon: Key },
  { name: "Bulk Tester", href: "/bulk-tester", icon: TestTube },
  { name: "Video Guides", href: "/guides", icon: Video },
  { name: "Support", href: "/support", icon: HelpCircle },
  { name: "Affiliate Program", href: "/affiliate", icon: Users },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-card border-r flex flex-col">
      <div className="p-6">
        <Link href="/" className="flex items-center space-x-2 hover-scale">
          <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center shadow-glow">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-lg">buildro.ai</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-8">
        <div>
          <h3 className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Workspace</h3>
          <div className="space-y-1">
            {workspaceItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start hover-scale transition-all",
                      isActive && "bg-gradient-accent text-white hover:bg-gradient-accent/90 shadow-glow",
                    )}
                  >
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </div>
        </div>

        <div>
          <h3 className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Resources</h3>
          <div className="space-y-1">
            {resourceItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start hover-scale transition-all",
                      isActive && "bg-gradient-accent text-white hover:bg-gradient-accent/90 shadow-glow",
                    )}
                  >
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center space-x-3 mb-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/diverse-user-avatars.png" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Benutzer</p>
            <div className="flex items-center space-x-1">
              <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="w-8 h-full bg-gradient-accent rounded-full"></div>
              </div>
              <span className="text-xs text-muted-foreground">Level 3</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-1">
          <Link href="/settings">
            <Button variant="ghost" size="icon" className="h-8 w-8 hover-scale">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="h-8 w-8 hover-scale">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
