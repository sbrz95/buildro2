import { NextResponse } from "next/server"

export async function GET() {
  // Mock affiliate statistics
  const stats = {
    rank: "Silber",
    progress: 65,
    currentXP: 6500,
    nextLevelXP: 10000,
    referralLink: "https://buildro.ai/ref/12345",
    monthlyEarnings: 245.5,
    totalEarnings: 1847.25,
    clicks: 1234,
    leads: 89,
    conversions: 23,
    conversionRate: 25.8,
  }

  return NextResponse.json(stats)
}
