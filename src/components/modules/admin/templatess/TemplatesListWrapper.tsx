'use client'

import { useState, useMemo } from "react"
import { useApiQuery } from "@/hooks/useApiQuery"
import { ResumeTemplate } from "@/interfaces/template"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Crown, 
  FileText, 
  Search, 
  Settings2, 
  MoreHorizontal, 
  Layers,
  ExternalLink,
  Plus
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const categories = ["all", "professional", "creative", "simple", "modern"] as const

export default function TemplatesAdminList() {
  const [category, setCategory] = useState<string>("all")
  const [showPremium, setShowPremium] = useState<"all" | "free" | "premium">("all")
  const [search, setSearch] = useState<string>("")

  const { data, isFetching } = useApiQuery(
    ["templates-list"],
    "/template",
    "axios",
    { staleTime: 1000 * 60 * 5 }
  )

  const templates: ResumeTemplate[] | any = data?.data || []

  const filtered = useMemo(() => {
    return templates.filter((t) => {
      const matchesCategory =
        category === "all" || t.slug.includes(category) || t.name.toLowerCase().includes(category)

      const matchesPremium =
        showPremium === "all" ||
        (showPremium === "free" && !t.isPremium) ||
        (showPremium === "premium" && t.isPremium)

      const matchesSearch =
        !search ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.slug.toLowerCase().includes(search.toLowerCase())

      return matchesCategory && matchesPremium && matchesSearch
    })
  }, [templates, category, showPremium, search])

  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-background pb-20">
      {/* Top Header Section */}
      <div className="bg-white dark:bg-card border-b">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Templates Management</h1>
              <p className="text-muted-foreground mt-1">
                Manage, edit, and monitor your resume template marketplace.
              </p>
            </div>
            <Button className="shrink-0 gap-2 shadow-sm">
              <Plus className="h-4 w-4" /> Create Template
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-8">
        {/* Controls Bar */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="bg-muted/50 p-1 rounded-lg border flex gap-1">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={category === cat ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setCategory(cat)}
                  className={`rounded-md px-4 capitalize ${
                    category === cat ? "bg-white dark:bg-background shadow-sm" : ""
                  }`}
                >
                  {cat}
                </Button>
              ))}
            </div>

            <div className="h-8 w-[1px] bg-border mx-2 hidden md:block" />

            <div className="flex bg-muted/50 p-1 rounded-lg border gap-1">
              {(["all", "free", "premium"] as const).map((type) => (
                <Button
                  key={type}
                  variant={showPremium === type ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setShowPremium(type)}
                  className={`rounded-md px-4 capitalize ${
                    showPremium === type ? "bg-white dark:bg-background shadow-sm" : ""
                  }`}
                >
                  {type === "premium" && <Crown className="h-3 w-3 mr-1.5 text-amber-500 fill-amber-500" />}
                  {type}
                </Button>
              ))}
            </div>
          </div>

          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white dark:bg-card shadow-sm"
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white dark:bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Template Details</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Category</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Structure</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Access</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isFetching ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-8">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-10 bg-muted rounded" />
                        <div className="space-y-2">
                          <div className="h-4 w-48 bg-muted rounded" />
                          <div className="h-3 w-32 bg-muted rounded" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : filtered.length > 0 ? (
                filtered.map((t) => (
                  <tr
                    key={t.id}
                    className="group hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-9 rounded border bg-muted/30 flex items-center justify-center text-muted-foreground group-hover:border-primary/30 transition-colors">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{t.name}</p>
                          <p className="text-xs text-muted-foreground">ID: {t.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <Badge variant="outline" className="font-normal capitalize bg-background">
                        {t.slug.split('-')[0] || "General"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                        <Layers className="h-4 w-4" />
                        <span>{t.sections.length} Sections</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {t.isPremium ? (
                        <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 gap-1 px-2 py-0.5">
                          <Crown className="h-3 w-3 fill-amber-500" /> Premium
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="font-normal px-2 py-0.5">Free</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                         <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground">
                            <ExternalLink className="h-4 w-4" />
                         </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => alert(`Edit ${t.name}`)}>
                              <Settings2 className="mr-2 h-4 w-4" /> Edit Template
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" /> Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                              Delete Template
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="bg-muted p-4 rounded-full mb-4">
                         <Search className="h-8 w-8 text-muted-foreground/50" />
                      </div>
                      <h3 className="text-lg font-medium">No templates found</h3>
                      <p className="text-muted-foreground max-w-xs mx-auto mt-1">
                        Try adjusting your filters or search terms to find what you're looking for.
                      </p>
                      <Button 
                        variant="link" 
                        onClick={() => {setSearch(""); setCategory("all"); setShowPremium("all")}}
                        className="mt-2"
                      >
                        Clear all filters
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {/* Footer Info */}
          <div className="px-6 py-4 bg-muted/10 border-t border-border flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Showing <span className="font-medium text-foreground">{filtered.length}</span> of <span className="font-medium text-foreground">{templates.length}</span> total templates
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}