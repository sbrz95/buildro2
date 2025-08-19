import { type NextRequest, NextResponse } from "next/server"

// Mock data (in a real app, this would be in a database)
const mockApiKeys = [
  {
    id: "1",
    name: "Production API Key",
    key: "sk-test-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz",
    maskedKey: "sk-t...x234",
    createdAt: "2024-01-15T10:30:00Z",
    lastUsed: "2024-01-20T14:22:00Z",
    isActive: true,
  },
  {
    id: "2",
    name: "Development Key",
    key: "sk-test-dev987fed654cba321hgf098edc765bca432ihg109fed876ecb",
    maskedKey: "sk-t...6ecb",
    createdAt: "2024-01-10T09:15:00Z",
    lastUsed: null,
    isActive: true,
  },
  {
    id: "3",
    name: "Testing Environment",
    key: "sk-test-xyz789abc123def456ghi789jkl012mno345pqr678stu901vwx",
    maskedKey: "sk-t...1vwx",
    createdAt: "2024-01-05T16:45:00Z",
    lastUsed: "2024-01-18T11:30:00Z",
    isActive: false,
  },
]

function generateApiKey(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = "sk-test-"
  for (let i = 0; i < 48; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

function maskApiKey(key: string): string {
  if (key.length < 8) return key
  return key.substring(0, 4) + "..." + key.substring(key.length - 4)
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const keyIndex = mockApiKeys.findIndex((key) => key.id === params.id)

    if (keyIndex === -1) {
      return NextResponse.json({ success: false, error: "API key not found" }, { status: 404 })
    }

    mockApiKeys.splice(keyIndex, 1)

    return NextResponse.json({
      success: true,
      message: "API key deleted successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete API key" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { action, name } = body

    const keyIndex = mockApiKeys.findIndex((key) => key.id === params.id)

    if (keyIndex === -1) {
      return NextResponse.json({ success: false, error: "API key not found" }, { status: 404 })
    }

    const existingKey = mockApiKeys[keyIndex]

    if (action === "reset") {
      const newKey = generateApiKey()
      const updatedKey = {
        ...existingKey,
        key: newKey,
        maskedKey: maskApiKey(newKey),
        lastUsed: null,
      }

      mockApiKeys[keyIndex] = updatedKey

      return NextResponse.json({
        success: true,
        key: updatedKey,
        message: "API key reset successfully",
      })
    } else if (action === "rename" && name) {
      const updatedKey = {
        ...existingKey,
        name: name.trim(),
      }

      mockApiKeys[keyIndex] = updatedKey

      return NextResponse.json({
        success: true,
        key: updatedKey,
        message: "API key renamed successfully",
      })
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update API key" }, { status: 500 })
  }
}
