import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

function generateApiKey(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = "sk-buildro-"
  for (let i = 0; i < 48; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

function maskApiKey(key: string): string {
  if (key.length < 8) return key
  return key.substring(0, 10) + "..." + key.substring(key.length - 4)
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: keys, error } = await supabase
      .from("api_keys")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching API keys:", error)
      return NextResponse.json({ error: "Failed to fetch API keys" }, { status: 500 })
    }

    // Transform to expected format and mask keys
    const transformedKeys = (keys || []).map((key) => ({
      id: key.id,
      name: key.name,
      key: key.key_value,
      maskedKey: maskApiKey(key.key_value),
      createdAt: key.created_at,
      lastUsed: key.last_used,
      isActive: key.is_active,
      expiryDate: key.expiry_date,
    }))

    return NextResponse.json({
      success: true,
      keys: transformedKeys,
    })
  } catch (error) {
    console.error("Error fetching API keys:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch API keys" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, expiryDate } = body

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 })
    }

    const newKey = generateApiKey()

    const { data: apiKey, error } = await supabase
      .from("api_keys")
      .insert([
        {
          user_id: user.id,
          name: name.trim(),
          key_value: newKey,
          expiry_date: expiryDate || null,
          is_active: true,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating API key:", error)
      return NextResponse.json({ success: false, error: "Failed to create API key" }, { status: 500 })
    }

    const transformedKey = {
      id: apiKey.id,
      name: apiKey.name,
      key: apiKey.key_value,
      maskedKey: maskApiKey(apiKey.key_value),
      createdAt: apiKey.created_at,
      lastUsed: apiKey.last_used,
      isActive: apiKey.is_active,
      expiryDate: apiKey.expiry_date,
    }

    return NextResponse.json({
      success: true,
      key: transformedKey,
      message: "API key created successfully",
    })
  } catch (error) {
    console.error("Error creating API key:", error)
    return NextResponse.json({ success: false, error: "Failed to create API key" }, { status: 500 })
  }
}
