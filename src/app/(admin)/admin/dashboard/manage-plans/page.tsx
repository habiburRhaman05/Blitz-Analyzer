'use client'

import { useState, useMemo } from 'react'
import { useApiQuery } from '@/hooks/useApiQuery'
import { useApiMutation } from '@/hooks/useApiMutation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowUpDown, ChevronDown, Search, Edit, Check, Loader2 } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

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
  const [isUpdating, setIsUpdating] = useState(false)

  const { data, isFetching, refetch } = useApiQuery<{ data: Plan[] }>(['plans'], '/pricing', 'axios')
  console.log(data);
  
  const plans: Plan[] = data?.data || []

  // Mutation setup - Note: We pass the ID dynamically in mutateAsync if your hook supports it, 
  // or we ensure editingPlan exists during the call.
  const updatePlanMutation = useApiMutation({
    endpoint: `/pricing/${editingPlan?.id}`, // This updates when editingPlan changes
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
      setIsUpdating(true)
      
      // Execute mutation while editingPlan is still in state (so ID is valid)
      const result = await updatePlanMutation.mutateAsync(payload)
      
      if (result.success) {
        setEditingPlan(null) // Only close on success
        setShowSuccess(true)
        await refetch()
      }
    } catch (err) {
      console.error("Update failed:", err)
    } finally {
      setIsUpdating(false)
    }
  }

  // Filter & Sort Logic
  const filteredPlans = useMemo(() => {
    let items = [...plans]
    if (search) {
      const q = search.toLowerCase()
      items = items.filter(p => p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q))
    }
    items.sort((a, b) => {
      const mod = order === 'desc' ? -1 : 1
      if (sortBy === 'name') return a.name.localeCompare(b.name) * mod
      if (sortBy === 'price') return (a.price - b.price) * mod
      return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * mod
    })
    return items
  }, [plans, search, sortBy, order])

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight uppercase">Manage Plans</h1>
          <p className="text-muted-foreground text-sm italic">Subscription and Credit Management</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
              {sortBy}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSortBy('name')}>Name</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('price')}>Price</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('createdAt')}>Date</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table Content */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="grid grid-cols-12 px-6 py-4 text-[11px] uppercase font-bold bg-muted/50 border-b">
          <div className="col-span-4">Plan Name</div>
          <div className="col-span-2">Credits</div>
          <div className="col-span-2">Price</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-right">Action</div>
        </div>

        {plans.map((plan) => (
          <div key={plan.id} className="grid grid-cols-12 px-6 py-4 border-b items-center hover:bg-muted/20 transition">
            <div className="col-span-4 font-medium">{plan.name}</div>
            <div className="col-span-2">{plan.credits}</div>
            <div className="col-span-2">{plan.currency} {plan.price}</div>
            <div className="col-span-2">
              <Badge variant={plan.isActive ? "default" : "destructive"}>
                {plan.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div className="col-span-2 text-right">
              <Button size="sm" variant="ghost" onClick={() => {
                setEditingPlan(plan)
                setStatus(plan.isActive ? 'Active' : 'Inactive')
              }}>
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* --- EDIT MODAL --- */}
      <Dialog open={!!editingPlan && !isUpdating} onOpenChange={() => setEditingPlan(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Plan Details</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <Input 
             
              value={editingPlan?.name || ''} 
              onChange={e => setEditingPlan(prev => prev ? {...prev, name: e.target.value} : null)} 
            />
            <div className="grid grid-cols-2 gap-4">
              <Input 
                type="number" 
                value={editingPlan?.price || 0} 
                onChange={e => setEditingPlan(prev => prev ? {...prev, price: Number(e.target.value)} : null)} 
              />
              <Input 
                type="number" 
                value={editingPlan?.credits || 0} 
                onChange={e => setEditingPlan(prev => prev ? {...prev, credits: Number(e.target.value)} : null)} 
              />
            </div>
            <Select value={status} onValueChange={(val: any) => setStatus(val)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setEditingPlan(null)}>Cancel</Button>
            <Button onClick={handleUpdatePlan}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- LOADING POPUP MODAL --- */}
      <Dialog open={isUpdating}>
        <DialogContent className="sm:max-w-[300px] text-center p-10 flex flex-col items-center justify-center pointer-events-none">
          <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
          <p className="font-bold text-lg">Updating Plan...</p>
          <p className="text-sm text-muted-foreground">Please wait while we sync data.</p>
        </DialogContent>
      </Dialog>

      {/* --- SUCCESS MODAL --- */}
      <Dialog open={showSuccess} onOpenChange={() => setShowSuccess(false)}>
        <DialogContent className="sm:max-w-[300px] text-center p-8">
          <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-xl font-bold">Success!</h2>
          <p className="text-muted-foreground mb-6">Plan has been updated successfully.</p>
          <Button className="w-full" onClick={() => setShowSuccess(false)}>Great</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}