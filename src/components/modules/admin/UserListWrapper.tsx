'use client'

import { useState } from 'react'
import { useApiQuery } from '@/hooks/useApiQuery'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import AdminUsersItems from './UserItemm'

export default function AdminUsersWrapper() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  const cacheKey = `admin-users-${page}-${search}`

  const { data, isFetching } = useApiQuery(
    [cacheKey],
    `/admin/users?page=${page}&limit=10&search=${search}`,
    'axios'
  )

  const users = data?.data || []
  const meta = data?.meta

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Manages All Users</h1>
        <p className="text-muted-foreground text-sm">Manage all users</p>
      </div>

      {/* Search */}
      <div className="mb-6 flex gap-4">
        <div className="relative w-80">
          <Search className="absolute left-3 top-3 h-4 w-4" />
          <Input
            className="pl-9"
            placeholder="Search users..."
            value={search}
            onChange={(e) => {
              setPage(1)
              setSearch(e.target.value)
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border overflow-hidden">
        <div className="grid grid-cols-12 px-6 py-4 text-xs font-bold bg-muted">
          <div className="col-span-5">User</div>
          <div className="col-span-3 hidden md:block">Created</div>
          <div className="col-span-2 hidden md:block">Role</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {isFetching ? (
          <div className="p-6 text-center">Loading...</div>
        ) : (
          <AdminUsersItems users={users} cacheKey={cacheKey} />
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-end gap-2 mt-6">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </Button>

        <span className="px-3 text-sm flex items-center">
          {meta?.page} / {meta?.totalPage}
        </span>

        <Button
          variant="outline"
          disabled={page === meta?.totalPage}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  )
}