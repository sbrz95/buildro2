"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Copy, Check } from "lucide-react"

interface ShareAgentDialogProps {
  isOpen: boolean
  onClose: () => void
  agentName: string
  agentId: string
}

export function ShareAgentDialog({ isOpen, onClose, agentName, agentId }: ShareAgentDialogProps) {
  const [affiliateTracking, setAffiliateTracking] = useState(false)
  const [shareLink, setShareLink] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  const generateShareLink = async () => {
    setIsGenerating(true)

    // Simulate API call to generate share link
    setTimeout(() => {
      const baseUrl = window.location.origin
      const affiliateParam = affiliateTracking ? "&affiliate=true" : ""
      const generatedLink = `${baseUrl}/shared/agent/${agentId}?ref=share${affiliateParam}`
      setShareLink(generatedLink)
      setIsGenerating(false)
    }, 1000)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const handleClose = () => {
    setShareLink("")
    setAffiliateTracking(false)
    setCopied(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Build</DialogTitle>
          <DialogDescription>Share '{agentName}' with others</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Generate a shareable link for your build. Recipients can import it to their account with their own API keys
            and webhook URLs.
          </p>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="affiliate-tracking" className="text-sm font-medium">
                Enable Affiliate Tracking
              </Label>
              <p className="text-xs text-muted-foreground">Earn 40% commission on purchases from this link.</p>
            </div>
            <Switch id="affiliate-tracking" checked={affiliateTracking} onCheckedChange={setAffiliateTracking} />
          </div>

          {!shareLink ? (
            <Button
              onClick={generateShareLink}
              disabled={isGenerating}
              className="w-full bg-gradient-accent hover:bg-gradient-accent/90 text-white shadow-glow"
            >
              {isGenerating ? "Generating..." : "Generate Share Link"}
            </Button>
          ) : (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Share Link</Label>
              <div className="flex items-center space-x-2">
                <Input value={shareLink} readOnly className="flex-1 text-xs" />
                <Button size="icon" variant="outline" onClick={copyToClipboard} className="shrink-0 bg-transparent">
                  {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              {copied && <p className="text-xs text-green-600">Link copied to clipboard!</p>}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
