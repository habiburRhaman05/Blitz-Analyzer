'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Calendar,
  Loader2,
  MoreVertical,
  Trash2,
  User,
  UserCheck,
  UserX
} from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateUserStatus, deleteUser } from '@/services/admin.services'
import { useState } from 'react'
import { UserStatus } from '@/interfaces/enums'

const AdminUsersItems = ({ users, cacheKey }: { users: any[]; cacheKey: string }) => {
  const queryClient = useQueryClient()

  const [actionLoading, setActionLoading] = useState<{
    id: string | null
    type: 'status' | 'delete' | null
  }>({ id: null, type: null })

  // Helper to check if any action is happening for a specific user
  const isAnyLoading = (id: string) => actionLoading.id === id

  const handleStatus = async (id: string, status: string) => {
    try {
      setActionLoading({ id, type: 'status' })
      const res = await updateUserStatus(id, status)
      if (res?.success) {
        toast.success(res.message || 'Status updated')
        await queryClient.invalidateQueries({ queryKey: [cacheKey] })
      } else {
        toast.error(res?.message || 'Failed to update')
      }
    } catch (err: any) {
      toast.error(err?.message || 'Something went wrong')
    } finally {
      setActionLoading({ id: null, type: null })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setActionLoading({ id, type: 'delete' })
      const res = await deleteUser(id)
      if (res?.success) {
        toast.success(res.message || 'User deleted')
        await queryClient.invalidateQueries({ queryKey: [cacheKey] })
      } else {
        toast.error(res?.message || 'Delete failed')
      }
    } catch (err: any) {
      toast.error(err?.message || 'Something went wrong')
    } finally {
      setActionLoading({ id: null, type: null })
    }
  }

  return (
    <div className="divide-y divide-border/40">
      <AnimatePresence>
        {users.map((item, index) => {
          const isActive = item.status === 'ACTIVE'
          const loadingForThisUser = isAnyLoading(item.id)

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: index * 0.03 }}
              className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-muted/40 group"
            >
              {/* User Info */}
              <div className="col-span-6 md:col-span-5 flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{item.email}</p>
                  <div className="mt-1">
                    <span className={cn(
                      'text-[10px] px-2 py-0.5 rounded-full border',
                      isActive ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                    )}>
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Date */}
              <div className="hidden md:block col-span-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(item.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* Role */}
              <div className="hidden md:block col-span-2 text-xs font-semibold">
                {item.role}
              </div>

              {/* Actions Row Level Loading */}
              <div className="col-span-6 md:col-span-2 flex justify-end items-center">
                {loadingForThisUser ? (
                  <div className="flex items-center gap-2 text-primary animate-in fade-in zoom-in duration-200">
                    <span className="text-[10px] font-medium hidden sm:block">Processing...</span>
                    <div className="h-9 w-9 flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-9 w-9">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem
                        onClick={() => handleStatus(item.id, isActive ? UserStatus.BANNED : UserStatus.ACTIVE)}
                      >
                        {isActive ? (
                          <UserX className="h-4 w-4 mr-2 text-rose-500" />
                        ) : (
                          <UserCheck className="h-4 w-4 mr-2 text-emerald-500" />
                        )}
                        {isActive ? 'Block' : 'Activate'}
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => handleDelete(item.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

export default AdminUsersItems