import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { IUser } from '@/interfaces/user'
import { LayoutDashboard, Settings } from 'lucide-react'
import Link from 'next/link'
import LogoutButton from './LogoutButton'


const UserProfile = ({user}:{user:IUser}) => {
  return (
  <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring rounded-full">
                    <Avatar className="h-9 w-9 border-2 border-primary/10 hover:border-primary/50 transition-all shadow-sm">
                      <AvatarImage src={user?.image || ""} alt={user.name} />
                      <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold uppercase">
                        {user.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-64 mt-2 p-2 rounded-2xl shadow-2xl border-border bg-popover" align="end">
                  <div className="px-3 py-3 border-b border-border/50 mb-1">
                    <p className="text-sm font-bold truncate text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    <div className="mt-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                      {user.role}
                    </div>
                  </div>
                  <div className="grid gap-1">
                    <Link href={`/dashboard`}>
                      <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                        <LayoutDashboard className="h-4 w-4" /> Dashboard
                      </div>
                    </Link>
                    <Link href="/dashboard/settings">
                      <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                        <Settings className="h-4 w-4" /> Settings
                      </div>
                    </Link>
                    <div className="pt-1 mt-1 border-t border-border/50">
                      <LogoutButton />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
  )
}

export default UserProfile