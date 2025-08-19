import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { GDPRBanner } from "@/components/gdpr-banner"
import { ConditionalLayout } from "@/components/conditional-layout"
import { AuthProvider } from "@/contexts/auth-context"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "buildro.ai - KI-Agenten erstellen und deployen",
  description: "Erstelle, teste, optimiere und deploye eigene KI-Agenten mit buildro.ai",
  generator: "buildro.ai",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de" className={`${inter.variable} antialiased`} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange={false}>
          <AuthProvider>
            <ConditionalLayout>{children}</ConditionalLayout>
          </AuthProvider>
          <GDPRBanner />
        </ThemeProvider>
      </body>
    </html>
  )
}
