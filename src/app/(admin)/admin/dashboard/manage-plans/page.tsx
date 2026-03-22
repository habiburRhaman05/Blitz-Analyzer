'use client'

import { useState, useMemo } from 'react'
import { useApiQuery } from '@/hooks/useApiQuery'
import { useApiMutation } from '@/hooks/useApiMutation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowUpDown, ChevronDown, Search, Edit, Check } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import * as Dialog from '@radix-ui/react-dialog'

export interface Plan {
  id: string
  name: string
  slug: string
  price: number
  currency: string
  credits: number
  isActive: boolean
  createdAt: string
}

export default function ManagesPlansWrapper() {
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'createdAt'>('createdAt')
  const [order, setOrder] = useState<'asc' | 'desc'>('desc')
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active')

  // --- API Fetch ---
  const { data, isFetching } = useApiQuery<{ data: Plan[] }>(['plans'], '/pricing', 'axios')
  const plans: Plan[] = data?.data || []

  // --- Update Mutation ---
  const updatePlanMutation = useApiMutation({
    endpoint: `/pricing/${editingPlan?.id}`,
    actionName: 'update plan',
    actionType: 'SERVER_SIDE',
    method: 'PATCH'
  })

  const handleUpdatePlan = async () => {
    if (!editingPlan) return
    const payload = {
      name: editingPlan.name,
      price: editingPlan.price,
      credits: editingPlan.credits,
      isActive: status === 'Active'
    }
    try {
      const result = await updatePlanMutation.mutateAsync(payload)
      if(result.success){
        setEditingPlan(null)
      setShowSuccess(true)
      }
    } catch (err) {
      console.error(err)
    }
  }

  // --- Filter + Sort ---
  const filteredPlans = useMemo(() => {
    let items = [...plans]
    if (search) {
      const q = search.toLowerCase()
      items = items.filter(p => p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q))
    }
    items.sort((a, b) => {
      if (sortBy === 'name') return order === 'desc' ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)
      if (sortBy === 'price') return order === 'desc' ? b.price - a.price : a.price - b.price
      if (sortBy === 'createdAt') return order === 'desc'
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      return 0
    })
    return items
  }, [plans, search, sortBy, order])

  // --- Skeleton Loader ---
  const SkeletonRow = () => (
    <div className="grid grid-cols-12 px-6 py-4 gap-2 animate-pulse border-b">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-4 bg-muted rounded col-span-2" />
      ))}
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Manage Plans</h1>
        <p className="text-muted-foreground text-sm">All your pricing plans and credits</p>
      </div>

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-3 h-4 w-4" />
          <Input
            className="pl-9"
            placeholder="Search plans..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <ArrowUpDown className="h-4 w-4" />
              Sort: {sortBy} ({order})
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setSortBy('name')}>Name</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('price')}>Price</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('createdAt')}>Created At</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOrder(prev => prev === 'desc' ? 'asc' : 'desc')}>Toggle Order</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="rounded-2xl border overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 px-6 py-4 text-xs font-bold bg-muted items-center">
          <div className="col-span-3">Name</div>
          <div className="hidden md:block col-span-2">Credits</div>
          <div className="hidden md:block col-span-2">Price</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 hidden md:block">Created At</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {/* Rows */}
        {isFetching
          ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
          : filteredPlans.map((plan) => (
              <div
                key={plan.id}
                className="grid grid-cols-12 px-6 py-4 border-b items-center gap-2 hover:bg-gray-50 dark:hover:bg-zinc-900 transition"
              >
                <div className="col-span-3 font-medium">{plan.name}</div>
                <div className="hidden md:block col-span-2">{plan.credits}</div>
                <div className="hidden md:block col-span-2">{plan.currency} {plan.price}</div>
                <div className="col-span-2">
                  <Badge className={`rounded-full px-2 py-1 ${plan.isActive ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    {plan.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="col-span-2 hidden md:block">{new Date(plan.createdAt).toLocaleDateString()}</div>
                <div className="col-span-1 text-right">
                  <Button size="sm" variant="outline" onClick={() => { setEditingPlan(plan); setStatus(plan.isActive ? 'Active' : 'Inactive') }}>
                    <Edit className="h-4 w-4" /> Edit
                  </Button>
                </div>
              </div>
            ))}
      </div>

      {/* Update Modal */}
      <Dialog.Root open={!!editingPlan} onOpenChange={() => setEditingPlan(null)}>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background rounded-2xl p-6 w-[400px] shadow-lg">
          <Dialog.Title className="text-lg font-bold mb-4">Edit Plan</Dialog.Title>

          <div className="flex flex-col gap-3">
            <Input
              placeholder="Name"
              value={editingPlan?.name || ''}
              onChange={(e) => editingPlan && setEditingPlan({ ...editingPlan, name: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Price"
              value={editingPlan?.price || 0}
              onChange={(e) => editingPlan && setEditingPlan({ ...editingPlan, price: Number(e.target.value) })}
            />
            <Input
              type="number"
              placeholder="Credits"
              value={editingPlan?.credits || 0}
              onChange={(e) => editingPlan && setEditingPlan({ ...editingPlan, credits: Number(e.target.value) })}
            />

            <Select value={status} onValueChange={(val: 'Active' | 'Inactive') => setStatus(val)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setEditingPlan(null)}>Cancel</Button>
              <Button variant="default" onClick={handleUpdatePlan}>Save</Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Root>

      {/* Success Modal */}
      <Dialog.Root open={showSuccess} onOpenChange={() => setShowSuccess(false)}>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background rounded-2xl p-6 w-[300px] shadow-lg text-center">
          <Check className="mx-auto h-8 w-8 text-green-500 mb-4 animate-bounce" />
          <p className="font-bold text-lg mb-2">Plan updated successfully!</p>
          <Button variant="default" onClick={() => setShowSuccess(false)}>Close</Button>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  )
}