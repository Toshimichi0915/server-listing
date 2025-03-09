import { Suspense } from "react"
import ServerList from "@/components/server-list"
import { SearchFilters } from "@/components/search-filters"
import { Skeleton } from "@/components/ui/skeleton"

export default function HomePage({
                                   searchParams,
                                 }: {
  searchParams?: {
    query?: string
    type?: string
    page?: string
  }
}) {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Game Servers</h1>
        <p className="text-muted-foreground">Browse and search through available game servers</p>
      </div>

      <SearchFilters />

      <Suspense fallback={<ServerListSkeleton />}>
        <ServerList searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

function ServerListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border">
        <div className="p-4 flex justify-between items-center">
          <Skeleton className="h-6 w-[250px]" />
          <Skeleton className="h-6 w-[100px]" />
        </div>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="border-t p-4">
            <div className="space-y-3">
              <Skeleton className="h-5 w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[100px]" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <Skeleton className="h-10 w-[350px]" />
      </div>
    </div>
  )
}
