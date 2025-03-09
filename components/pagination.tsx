"use client"

import { useRouter, useSearchParams } from "next/navigation"
import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface PaginationProps {
  totalPages: number
  currentPage: number
}

export function Pagination({ totalPages, currentPage }: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", pageNumber.toString())
    return `?${params.toString()}`
  }

  // Don't show pagination if there's only one page
  if (totalPages <= 1) {
    return null
  }

  // Calculate which page numbers to show
  const getVisiblePages = () => {
    const delta = 2 // Number of pages to show on each side of current page
    const pages = []

    // Always include first page
    pages.push(1)

    // Calculate range around current page
    const rangeStart = Math.max(2, currentPage - delta)
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta)

    // Add ellipsis if there's a gap after page 1
    if (rangeStart > 2) {
      pages.push("ellipsis-start")
    }

    // Add pages in the middle range
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i)
    }

    // Add ellipsis if there's a gap before the last page
    if (rangeEnd < totalPages - 1) {
      pages.push("ellipsis-end")
    }

    // Always include last page if it's not the first page
    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages
  }

  const visiblePages = getVisiblePages()

  return (
    <PaginationComponent>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={currentPage > 1 ? createPageURL(currentPage - 1) : "#"}
            aria-disabled={currentPage <= 1}
            tabIndex={currentPage <= 1 ? -1 : undefined}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {visiblePages.map((page, i) => {
          if (page === "ellipsis-start" || page === "ellipsis-end") {
            return (
              <PaginationItem key={`ellipsis-${i}`}>
                <PaginationEllipsis />
              </PaginationItem>
            )
          }

          return (
            <PaginationItem key={page}>
              <PaginationLink href={createPageURL(page)} isActive={page === currentPage}>
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        })}

        <PaginationItem>
          <PaginationNext
            href={currentPage < totalPages ? createPageURL(currentPage + 1) : "#"}
            aria-disabled={currentPage >= totalPages}
            tabIndex={currentPage >= totalPages ? -1 : undefined}
            className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationComponent>
  )
}

