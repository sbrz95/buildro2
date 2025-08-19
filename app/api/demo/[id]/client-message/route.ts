import { type NextRequest, NextResponse } from "next/server"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()

    // Mock: Update client message settings
    const updatedDemo = {
      ...data,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(updatedDemo)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update client message settings" }, { status: 500 })
  }
}
