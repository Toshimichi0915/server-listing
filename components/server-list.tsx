import { Users, Server } from "lucide-react"
import { getServers } from "@/lib/data"
import { Pagination } from "@/components/pagination"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils";

interface SearchParams {
  [key: string]: string | string[] | undefined
}

export default async function ServerList({
                                           searchParams,
                                         }: {
  searchParams: SearchParams
}) {
  // Handle both string and string[] cases for query parameters
  const query = typeof searchParams.query === "string" ? searchParams.query : ""
  const type = typeof searchParams.type === "string" ? searchParams.type : "name"
  const pageParam = typeof searchParams.page === "string" ? searchParams.page : "1"
  const page = Number(pageParam) || 1
  const pageSize = 20

  const { servers, totalServers } = await getServers({
    query,
    type,
    page,
    pageSize,
  })

  const totalPages = Math.ceil(totalServers / pageSize)

  if (servers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Server className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold">No servers found</h3>
        <p className="text-muted-foreground">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {servers.length} of {totalServers} servers
        </p>
      </div>

      <div className="grid gap-4">
        {servers.map((server) => (
          <Card key={server.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{server.host}</CardTitle>
                  <CardDescription>
                    {server.description.length > 100
                      ? `${server.description.substring(0, 100)}...`
                      : server.description}
                  </CardDescription>
                </div>
                <Badge className={cn("ml-2", {
                    "bg-primary text-primary-foreground": server.server_type !== "BUNGEECORD",
                    "bg-accent text-accent-foreground": server.server_type === "BUNGEECORD",
                })}>
                  {server.server_type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center text-sm">
                <div className="flex flex-col sm:flex-row sm:gap-4">
                  <span>Version: {server.version}</span>
                  <span>Port: {server.port}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {server.player_count}/{server.max_player_count}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Pagination totalPages={totalPages} currentPage={page} />
    </div>
  )
}
