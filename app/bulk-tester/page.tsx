import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TestTube, Zap } from "lucide-react"
import Link from "next/link"

export default function BulkTesterPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bulk Tester</h1>
          <p className="text-muted-foreground">Teste deine Agenten mit mehreren Szenarien gleichzeitig</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        <Link href="/bulk-tester/assistant">
          <Card className="hover-scale cursor-pointer group">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center group-hover:shadow-glow transition-all">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle>OpenAI Assistant</CardTitle>
                  <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Empfohlen
                  </div>
                </div>
              </div>
              <CardDescription>
                Nutze die neueste OpenAI Assistant API für erweiterte Funktionen und bessere Performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-gradient-accent hover:bg-gradient-accent/90 text-white">
                Assistant wählen
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/bulk-tester/chat-completion">
          <Card className="hover-scale cursor-pointer group">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                  <TestTube className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <CardTitle>Chat Completion</CardTitle>
                  <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                    Classic Legacy
                  </div>
                </div>
              </div>
              <CardDescription>
                Verwende die klassische Chat Completion API für einfache Anwendungsfälle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full bg-transparent">
                Chat Completion wählen
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
