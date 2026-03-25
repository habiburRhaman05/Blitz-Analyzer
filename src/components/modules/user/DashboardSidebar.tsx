"use client";

import React, { useMemo } from "react";
import { 
  LayoutDashboard, 
  User, 
  Settings, 
  CreditCard, 
  History, 
  FilePlus, 
  LucideBookTemplate,
  ChevronRight,
  ShieldCheck,
  HelpCircle,
  User2,
  Calculator
} from "lucide-react";

import { NavLink } from "@/components/global/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { useUser } from "@/context/UserContext";
import UserCreditCard from "./UserCreditCard";
import LogoutButton from "../auth/LogoutButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRole } from "@/interfaces/enums";

// Navigation Configuration
const NAVIGATION_CONFIG = {
  USER: [
    { path: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
    { path: "/dashboard/resumes", label: "My Resumes", icon: FilePlus },
    { path: "/dashboard/templates", label: "Templates", icon: LucideBookTemplate },
    { path: "/dashboard/history", label: "Analysis History", icon: History },
    { path: "/dashboard/profile", label: "Profile", icon: User },
    { path: "/dashboard/payments", label: "Payments History", icon: User },
    { path: "/dashboard/settings", label: "Settings", icon: Settings },


  ],
  ADMIN: [
    { path: "/admin/dashboard", label: "Admin Overview", icon: LayoutDashboard, exact: true },
    { path: "/admin/dashboard/templates", label: "Manage Templates", icon: LucideBookTemplate },
    { path: "/admin/dashboard/users", label: "Manage All Users", icon: User2 },
    { path: "/admin/dashboard/transactions", label: "Transactions", icon: History },
    { path: "/admin/dashboard/manage-plans", label: "Pricing Modals", icon: Calculator },
    { path: "/admin/dashboard/profile", label: "Profile", icon: User },
    { path: "/admin/dashboard/settings", label: "Settings", icon: Settings },


  ],
  SETTINGS: [
    { path: "/pricing", label: "Billing", icon: CreditCard },

  ]
};

export default function DashboardSidebar() {
  const { state } = useSidebar();
  const { user } = useUser(); // Assuming your context returns a user object with a role
  
  const isCollapsed = state === "collapsed";
  const isAdmin = user?.user.role === UserRole.ADMIN
console.log(isAdmin);

  // Determine which main nav items to show
  const mainNavItems = isAdmin ? NAVIGATION_CONFIG.ADMIN : NAVIGATION_CONFIG.USER;

  return (
    <Sidebar collapsible="offcanvas" className="border-r border-border/50 bg-card/50 backdrop-blur-xl">
      {/* Header / Logo Area */}
      <SidebarHeader className="h-16 flex items-center px-6 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <ShieldCheck className="text-primary-foreground h-5 w-5" />
          </div>
          {!isCollapsed && (
            <span className="font-bold text-lg tracking-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
              ResuBuilt
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 pt-4 gap-6">
        {/* Role Indicator (Modern Badge) */}
        {!isCollapsed && isAdmin && (
          <div className="mx-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-600 uppercase tracking-widest w-fit">
            Admin Access
          </div>
        )}

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2">
            Platform
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {mainNavItems.map((item) => (
                <SidebarItem key={item.path} item={item} isCollapsed={isCollapsed} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Support/Settings Group */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2">
            Account & System
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {NAVIGATION_CONFIG.SETTINGS.map((item) => (
                <SidebarItem key={item.path} item={item} isCollapsed={isCollapsed} />
              ))}
              <SidebarMenuItem>
                 <SidebarMenuButton asChild tooltip="Help Center">
                    <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
                       <HelpCircle className="h-4 w-4" />
                       {!isCollapsed && <span>Help Center</span>}
                    </a>
                 </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Credit Card Widget - Integrated nicely */}
     
      </SidebarContent>

      {/* Modern Footer Section */}
      <SidebarFooter className="border-t border-border/40 p-4 bg-muted/30">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} gap-2`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <Avatar className="h-9 w-9 border-2 border-background shadow-sm">
              <AvatarImage src={user?.image} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                {user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="text-sm font-semibold truncate leading-none mb-1">
                  {user?.name || "Guest User"}
                </span>
                <span className="text-[11px] text-muted-foreground truncate italic">
                  {user?.email || "Connect account"}
                </span>
              </div>
            )}
          </div>
          
          {!isCollapsed && (
            <div className="flex items-center">
               <LogoutButton />
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

/**
 * Reusable Sidebar Item Component
 */
function SidebarItem({ item, isCollapsed }: { item: any, isCollapsed: boolean }) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip={item.label} className="group h-10">
        <NavLink
          href={item.path}
          exact={item.exact}
          className="flex items-center w-full gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all relative overflow-hidden text-muted-foreground hover:text-foreground hover:bg-accent/50"
          activeClassName="bg-primary/10 text-primary font-bold shadow-[inset_0px_0px_12px_rgba(var(--primary),0.05)] after:absolute after:left-0 after:top-1/4 after:h-1/2 after:w-[3px] after:bg-primary after:rounded-r-full"
        >
          <item.icon className={`h-[18px] w-[18px] shrink-0 transition-transform group-hover:scale-110`} />
          {!isCollapsed && <span className="flex-1">{item.label}</span>}
          {!isCollapsed && item.exact && (
             <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          )}
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}