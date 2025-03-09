import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: Request) {
  try {
    // Get query parameters for filtering
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query") || ""
    const type = searchParams.get("type") || "name"

    // Build the where clause based on search parameters
    let whereClause = {}

    if (query) {
      switch (type) {
        case "name":
          whereClause = {
            description: {
              contains: query,
              mode: "insensitive",
            },
          }
          break
        case "host":
          whereClause = {
            host: {
              contains: query,
              mode: "insensitive",
            },
          }
          break
        case "type":
          whereClause = {
            server_type: {
              contains: query,
              mode: "insensitive",
            },
          }
          break
      }
    }

    // Get all servers matching the filter
    // Note: We're including related data for a complete export
    const servers = await db.servers.findMany({
      where: whereClause,
      orderBy: {
        player_count: "desc",
      },
      include: {
        online_players: true,
        mods: true,
      },
    })

    // Return the data as JSON
    return NextResponse.json(servers)
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json({ error: "Failed to export server data" }, { status: 500 })
  }
}
