"use client";

import { 
  LayoutDashboard, 
  User, 
  Settings, 
  CreditCard, 
  History, 
  LogOut, 
  FilePlus 
} from "lucide-react";

import { NavLink } from "@/components/global/NavLink"; // Using the converted Next.js NavLink
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

const navItems = [
  { path: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { path: "/dashboard/profile", label: "Profile", icon: User },
  { path: "/create-resume", label: "Create Resume", icon: FilePlus },
  { path: "/profile/history", label: "History", icon: History },
  { path: "/profile/plans", label: "Plans", icon: CreditCard },
  { path: "/profile/settings", label: "Settings", icon: Settings },
];

export default function DashboardSidebar() {
  const router = useRouter();
  // const { logout } = useUser();
  const { state } = useSidebar();
  
  const isCollapsed = state === "collapsed";

  const handleLogout = async () => {
    try {
      // await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Sidebar collapsible="offcanvas" className="border-r border-sidebar-border bg-sidebar">
      <SidebarContent className="flex flex-col justify-between h-full py-4 pt-16">
        
        {/* Main Navigation Group */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] uppercase font-bold tracking-widest text-sidebar-foreground/40">
            { "Main Menu"}
          </SidebarGroupLabel>
          
          <SidebarGroupContent className="mt-2">
            <SidebarMenu className="gap-1 px-2">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild tooltip={item.label}>
                    <NavLink
                      href={item.path}
                      exact={item.exact}
                      className="flex items-center gap-3 rounded-[var(--radius)] px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition-all hover:bg-sidebar-accent hover:text-sidebar-foreground"
                      activeClassName="bg-primary/10 text-primary font-semibold shadow-sm shadow-primary/5"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!isCollapsed && <span>{item.label}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* System Group (Bottom) */}
        <SidebarGroup>
          <SidebarGroupContent className="px-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className="flex items-center gap-3 rounded-[var(--radius)] px-3 py-2 text-sm font-medium text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive transition-all w-full"
                  tooltip="Sign Out"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  {!isCollapsed && <span>Sign Out</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>
    </Sidebar>
  );
}