"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export function ExportButton() {
  const [isExporting, setIsExporting] = useState(false)
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const handleExport = async () => {
    try {
      setIsExporting(true)

      // Build the API URL with current filters
      const params = new URLSearchParams()
      const query = searchParams.get("query")
      const type = searchParams.get("type")

      if (query) params.set("query", query)
      if (type) params.set("type", type)

      // Show toast for large exports
      toast({
        title: "Preparing export",
        description: "This might take a moment for large datasets...",
        duration: 3000,
      })

      // Fetch the data from our API
      const response = await fetch(`/api/export?${params.toString()}`)

      if (!response.ok) {
        throw new Error("Failed to export data")
      }

      const data = await response.json()

      // Create a Blob with the JSON data
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      })

      // Create a download link and trigger it
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")

      // Generate filename with current date
      const date = new Date().toISOString().split("T")[0]
      const filename = `servers-export-${date}.json`

      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()

      // Clean up
      URL.revokeObjectURL(url)
      document.body.removeChild(link)

      toast({
        title: "Export complete",
        description: `${data.length} servers exported successfully`,
        duration: 3000,
      })
    } catch (error) {
      console.error("Export error:", error)
      toast({
        title: "Export failed",
        description: "There was an error exporting the data",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      {isExporting ? "Exporting..." : "Export JSON"}
    </Button>
  )
}
