"use client"

import { useState } from "react"
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
  ChevronLeft,
  ChevronRight,
  Bot,
  FolderOpen,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

const workspaceItems = [
  { name: "Build", href: "/build", icon: Hammer },
  { name: "Improve", href: "/improve", icon: TrendingUp },
  { name: "Demo", href: "/demo", icon: Play },
  { name: "Launch", href: "/launch", icon: Rocket },
  { name: "Projekte", href: "/projects", icon: FolderOpen },
]

const resourceItems = [
  { name: "Marketplace", href: "/marketplace", icon: Store },
  { name: "AI Mentor", href: "/ai-mentor", icon: Brain },
  { name: "API Key", href: "/api-keys", icon: Key },
  { name: "Bulk Tester", href: "/bulk-tester", icon: TestTube },
  { name: "Video Guides", href: "/guides", icon: Video },
  { name: "Support", href: "/support", icon: HelpCircle },
  { name: "Affiliate Program", href: "/affiliate", icon: Users },
]

export function CollapsibleSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <div
      className={cn(
        "bg-card border-r flex flex-col transition-all duration-300 relative",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 bg-card border border-border rounded-full shadow-sm hover:shadow-md z-10 hover-scale"
        title={isCollapsed ? "Sidebar erweitern" : "Sidebar einklappen"}
      >
        {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>

      <div className="p-4 flex items-center">
        {!isCollapsed && (
          <Link href="/" className="flex items-center space-x-2 hover-scale">
            <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center shadow-glow">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg">buildro.ai</span>
          </Link>
        )}
        {isCollapsed && (
          <Link href="/" className="flex items-center justify-center hover-scale w-full">
            <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center shadow-glow">
              <Bot className="h-4 w-4 text-white" />
            </div>
          </Link>
        )}
      </div>

      <nav className="flex-1 px-2 space-y-6">
        <div>
          {!isCollapsed && (
            <h3 className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Workspace
            </h3>
          )}
          <div className="space-y-1">
            {workspaceItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full hover-scale transition-all",
                      isCollapsed ? "justify-center px-2" : "justify-start",
                      isActive && "bg-gradient-accent text-white hover:bg-gradient-accent/90 shadow-glow",
                    )}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                    {!isCollapsed && item.name}
                  </Button>
                </Link>
              )
            })}
          </div>
        </div>

        <div>
          {!isCollapsed && (
            <h3 className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Resources
            </h3>
          )}
          <div className="space-y-1">
            {resourceItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full hover-scale transition-all",
                      isCollapsed ? "justify-center px-2" : "justify-start",
                      isActive && "bg-gradient-accent text-white hover:bg-gradient-accent/90 shadow-glow",
                    )}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                    {!isCollapsed && item.name}
                  </Button>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      <div className="p-4 border-t">
        {!isCollapsed ? (
          <>
            <div className="flex items-center space-x-3 mb-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/diverse-user-avatars.png" />
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name || "Benutzer"}</p>
                <div className="flex items-center space-x-1">
                  <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="w-8 h-full bg-gradient-accent rounded-full"></div>
                  </div>
                  <span className="text-xs text-muted-foreground capitalize">{user?.plan || "starter"}</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-1">
              <Link href="/settings">
                <Button variant="ghost" size="icon" className="h-8 w-8 hover-scale">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover-scale" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/diverse-user-avatars.png" />
              <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <Link href="/settings">
              <Button variant="ghost" size="icon" className="h-8 w-8 hover-scale" title="Einstellungen">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover-scale" title="Abmelden" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
