'use client'

import { useMemo, useState } from 'react'
import { useApiQuery } from '@/hooks/useApiQuery'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  ArrowUpDown,
  ChevronDown,
  Search
} from 'lucide-react'
import TransactionHistoryItems from './TransactionHistoryItems'

export type PaymentStatus = 'SUCCESS' | 'FAILED' | 'PENDING'

export interface Transaction {
  username: string
  email: string
  paymentId: string
  paymentTime: string
  invoice_url: string
  paymentStatus: PaymentStatus
  amount: number
  currency: string
  planName: string
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  timestamp: string
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: {
    data: T
    meta: PaginationMeta
  }
}
export default function TransactionHistoryWrapper() {
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'status'>('date')
  const [order, setOrder] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)
  const limit = 5

const { data, isFetching } = useApiQuery<ApiResponse<Transaction[]>>(
  ['transactions', page.toString()],
  `/payment/get-all-transactions?page=${page}&limit=${limit}`,
  'axios'
)

  const meta: PaginationMeta | undefined = data?.data?.data.meta
  const totalPages = meta ? Math.ceil(meta.total / meta.limit) : 1

const transactions = useMemo(() => {
  let items: Transaction[] = [...(data?.data?.data || []) as Transaction[]]


  if (search) {
    const q = search.toLowerCase()
    items = items.filter(
      (i) =>
        i.username.toLowerCase().includes(q) ||
        i.email.toLowerCase().includes(q) ||
        i.planName.toLowerCase().includes(q)
    )
  }

  items.sort((a, b) => {
    if (sortBy === 'date') {
      return order === 'desc'
        ? new Date(b.paymentTime).getTime() - new Date(a.paymentTime).getTime()
        : new Date(a.paymentTime).getTime() - new Date(b.paymentTime).getTime()
    }

    if (sortBy === 'amount') {
      return order === 'desc' ? b.amount - a.amount : a.amount - b.amount
    }

    if (sortBy === 'status') {
      return order === 'desc'
        ? b.paymentStatus.localeCompare(a.paymentStatus)
        : a.paymentStatus.localeCompare(b.paymentStatus)
    }

    return 0
  })

  return items
},[search,sortBy,order,data])



  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Transaction History</h1>
        <p className="text-muted-foreground text-sm">
          All your payments and invoices
        </p>
      </div>



      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-3 h-4 w-4" />
          <Input
            className="pl-9"
            placeholder="Search transactions..."
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
            <DropdownMenuItem onClick={() => setSortBy('date')}>
              Date
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('amount')}>
              Amount
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('status')}>
              Status
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() =>
                setOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))
              }
            >
              Toggle Order
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="rounded-2xl border overflow-hidden">
        <div className="grid grid-cols-12 px-6 py-4 text-xs font-bold bg-muted">
          <div className="col-span-4">User</div>
          <div className="hidden md:block col-span-3">Date</div>
          <div className="hidden md:block col-span-2">Amount</div>
          <div className="col-span-3 md:col-span-2">Status</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {isFetching ? (
          <div className="p-10 text-center">Loading...</div>
        ) : (
          <TransactionHistoryItems data={transactions} />
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-muted-foreground">
          Page {meta?.page || 1} of {totalPages}
        </p>

        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </Button>

          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i}
              variant={page === i + 1 ? 'default' : 'outline'}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}

          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}