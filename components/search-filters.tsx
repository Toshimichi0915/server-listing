"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "")
  const [searchType, setSearchType] = useState(searchParams.get("type") || "name")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams(searchParams.toString())

    if (searchQuery) {
      params.set("query", searchQuery)
    } else {
      params.delete("query")
    }

    params.set("type", searchType)
    params.set("page", "1") // Reset to first page on new search

    router.push(`/?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1 flex gap-3">
        <Select value={searchType} onValueChange={setSearchType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Search by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Server Name</SelectItem>
            <SelectItem value="host">Host</SelectItem>
            <SelectItem value="type">Server Type</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search servers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Button type="submit">Search</Button>
    </form>
  )
}

