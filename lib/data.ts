import { db } from "@/lib/db"

export interface Server {
  id: number
  host: string
  port: number
  version: string
  protocol: number
  player_count: number
  max_player_count: number
  description: string
  server_type: string
  created_at: Date
}

interface GetServersOptions {
  query?: string
  type?: string
  page?: number
  pageSize?: number
}

export async function getServers({ query = "", type = "name", page = 1, pageSize = 20 }: GetServersOptions) {
  // Calculate offset for pagination
  const offset = (page - 1) * pageSize

  // Build the where clause based on search parameters
  let whereClause = {}

  if (query) {
    switch (type) {
      case "name":
        // Search in description as there's no explicit name field
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

  // Get servers with pagination, sorted by player count
  const servers = await db.servers.findMany({
    where: whereClause,
    orderBy: {
      player_count: "desc",
    },
    skip: offset,
    take: pageSize,
  })

  // Get total count for pagination
  const totalServers = await db.servers.count({
    where: whereClause,
  })

  return {
    servers,
    totalServers,
  }
}

export async function getServerById(id: number) {
  const server = await db.servers.findUnique({
    where: { id },
    include: {
      online_players: true,
      mods: true,
    },
  })

  return server
}
