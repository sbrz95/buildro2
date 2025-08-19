import { ProtectedRoute } from "@/components/protected-route"
import type { ReactNode } from "react"

export default function BuildLayout({ children }: { children: ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>
}
