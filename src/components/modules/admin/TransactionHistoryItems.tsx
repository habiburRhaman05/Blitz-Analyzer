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
  Download,
  MoreVertical
} from 'lucide-react'

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'SUCCESS':
      return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
    case 'FAILED':
      return 'bg-rose-500/10 text-rose-500 border-rose-500/20'
    default:
      return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
  }
}

const formatDateTime = (date: string) => {
  const d = new Date(date)

  return d.toLocaleString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const TransactionHistoryItems = ({data}) => {
 
  
  return (
    <div className="divide-y divide-border/40">
      <AnimatePresence>
        {data.map((item, index) => (
          <motion.div
            key={item.paymentId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-muted/40"
          >
            {/* User */}
            <div className="col-span-6 md:col-span-4">
              <p className="font-bold text-sm">{item.username}</p>
              <p className="text-xs text-muted-foreground">{item.email}</p>
              <p className="text-[10px] text-muted-foreground mt-1">
                {item.planName}
              </p>
            </div>

            {/* Date */}
            <div className="hidden md:block col-span-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDateTime(item.paymentTime)}
              </div>
            </div>

            {/* Amount */}
            <div className="hidden md:block col-span-2 font-bold text-sm">
              ${item.amount}
            </div>

            {/* Status */}
            <div className="col-span-3 md:col-span-2">
              <span
                className={cn(
                  'text-[10px] px-2 py-1 rounded-full border',
                  getStatusStyle(item.paymentStatus)
                )}
              >
                {item.paymentStatus}
              </span>
            </div>

            {/* Actions */}
            <div className="col-span-3 md:col-span-1 flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <a
                      href={item.invoice_url}
                      target="_blank"
                      download
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Invoice
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default TransactionHistoryItems