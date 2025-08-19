"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Zap } from "lucide-react"
import { useEffect, useState } from "react"

export function LoadingOverlay() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100
        return prev + 2
      })
    }, 60)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-gradient-accent rounded-xl flex items-center justify-center mx-auto mb-6 shadow-glow animate-pulse">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">KI wird erstellt...</h2>
          <p className="text-muted-foreground mb-6">Dein Agent wird generiert. Das dauert ca. 1 Minute.</p>
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground">{progress}% abgeschlossen</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
