import { type NextRequest, NextResponse } from "next/server"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()

    // Validate domains
    const invalidDomains = data.allowedDomains?.filter((domain: string) => {
      try {
        new URL(domain)
        return false
      } catch {
        return true
      }
    })

    if (invalidDomains?.length > 0) {
      return NextResponse.json({ error: "Invalid domain format", invalidDomains }, { status: 400 })
    }

    // Mock: Update domain settings
    const updatedDemo = {
      ...data,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(updatedDemo)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update domain settings" }, { status: 500 })
  }
}
