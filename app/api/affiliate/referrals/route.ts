import { NextResponse } from "next/server"

export async function GET() {
  // Mock referrals data
  const referrals = [
    {
      id: 1,
      name: "Max Mustermann",
      email: "m***@example.com",
      date: "2024-01-15",
      status: "Aktiv",
      commission: 25.0,
      clicks: 45,
      conversions: 1,
    },
    {
      id: 2,
      name: "Anna Schmidt",
      email: "a***@example.com",
      date: "2024-01-12",
      status: "Pending",
      commission: 0.0,
      clicks: 12,
      conversions: 0,
    },
    {
      id: 3,
      name: "Tom Weber",
      email: "t***@example.com",
      date: "2024-01-10",
      status: "Aktiv",
      commission: 50.0,
      clicks: 78,
      conversions: 2,
    },
    {
      id: 4,
      name: "Lisa Müller",
      email: "l***@example.com",
      date: "2024-01-08",
      status: "Aktiv",
      commission: 35.0,
      clicks: 56,
      conversions: 1,
    },
    {
      id: 5,
      name: "Peter Klein",
      email: "p***@example.com",
      date: "2024-01-05",
      status: "Inaktiv",
      commission: 15.0,
      clicks: 23,
      conversions: 1,
    },
  ]

  return NextResponse.json(referrals)
}
