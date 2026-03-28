"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FilePlus,
  BookTemplate,
  History,
  User,
  Settings,
  Menu,
  X,
  FileText,
  BarChart3,
  CreditCard,
  PlusCircle,
  Clock,
  ArrowRight,
  Download,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { getUserDashboardData } from "@/services/user.services";
import { useUser } from "@/context/UserContext";

// TYPES
interface DashboardStats {
  totalAnalysis: number;
  totalResume: number;
  totalTransactions: number;
}

interface DashboardApiResponse {
  success: boolean;
  message: string;
  data: DashboardStats;
  meta: { timestamp: string };
}

// NAVIGATION ITEMS
const navItems = [
  { path: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { path: "/dashboard/resumes", label: "My Resumes", icon: FilePlus, exact: false },
  { path: "/dashboard/templates", label: "Templates", icon: BookTemplate, exact: false },
  { path: "/dashboard/history", label: "Analysis History", icon: History, exact: false },
  { path: "/dashboard/profile", label: "Profile", icon: User, exact: false },
  { path: "/dashboard/settings", label: "Settings", icon: Settings, exact: false },
];

// HELPER: Active route detection


// SKELETON COMPONENTS
const StatsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    ))}
  </div>
);

const RecentActivitySkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
    <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse"></div>
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const QuickActionsSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 animate-pulse">
    <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
    <div className="space-y-3">
      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
    </div>
  </div>
);

// MAIN COMPONENT
const UserDashboardPage = () => {
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
const {user} = useUser()
  // Fetch dashboard data
  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
  } = useQuery<DashboardApiResponse>({
    queryKey: ["user-dashboard-data"],
    queryFn: () => getUserDashboardData(),
    staleTime: 1000 * 30,
  });

  const stats = apiResponse?.data;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans antialiased">
   

  

      {/* Main Content */}
      <main className="transition-all duration-200">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
            
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-md text-gray-500 dark:text-gray-400 hidden sm:block">
                  Welcome back!  <b className="text-xl font-bold">{user?.name}</b>
                </p>
              </div>
            </div>
           
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Error State */}
          {isError && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
              <p className="text-red-600 dark:text-red-400 font-medium">Failed to load dashboard data.</p>
              <p className="text-sm text-red-500 dark:text-red-500 mt-1">{error?.message || "Please try again later."}</p>
            </div>
          )}

          {/* KPI Cards */}
          {isLoading ? (
            <StatsSkeleton />
          ) : (
            stats && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Total Analysis Card */}
                <div className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="h-12 w-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <BarChart3 size={24} />
                    </div>
                    <span className="text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                      +12% vs last month
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Analysis</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalAnalysis.toLocaleString()}</p>
                    <div className="mt-2 flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                      <TrendingUp size={12} />
                      <span>Active sessions</span>
                    </div>
                  </div>
                </div>

                {/* Total Resumes Card */}
                <div className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileText size={24} />
                    </div>
                    <span className="text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                      ATS ready
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Resumes</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalResume.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Last updated 2 days ago</p>
                  </div>
                </div>

                {/* Total Transactions Card */}
                <div className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="h-12 w-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <CreditCard size={24} />
                    </div>
                    <span className="text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                      Lifetime
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Transactions</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalTransactions.toLocaleString()}</p>
                    <div className="mt-2 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Download size={12} />
                      <span>Invoices ready</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}

          {/* Two Column Layout: Recent Activity & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity Section */}
            {isLoading ? (
              <RecentActivitySkeleton />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <History size={20} className="text-indigo-500" />
                    Recent Activity
                  </h2>
                  <Link href="/dashboard/history" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                    View all <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="space-y-4">
                  {/* Mock recent items - in real app, you'd fetch from API */}
                  {[
                    { name: "Frontend Developer Resume", type: "Resume Updated", date: "2 hours ago", icon: FilePlus },
                    { name: "Data Analyst ATS Analysis", type: "Analysis Completed", date: "Yesterday", icon: BarChart3 },
                    { name: "Premium Plan Renewal", type: "Transaction", date: "3 days ago", icon: CreditCard },
                  ].map((item, idx) => {
                    const IconComp = item.icon;
                    return (
                      <div key={idx} className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400">
                          <IconComp size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">{item.type}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                            <span className="text-xs text-gray-400 dark:text-gray-500">{item.date}</span>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quick Actions Section */}
            {isLoading ? (
              <QuickActionsSkeleton />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                  <PlusCircle size={20} className="text-indigo-500" />
                  Quick Actions
                </h2>
                <div className="space-y-3">
                  <Link
                    href="/dashboard/templates"
                    className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-100 dark:border-indigo-900/50 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <FilePlus size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">Create New Resume</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Start from scratch or template</p>
                      </div>
                    </div>
                    <ArrowRight size={18} className="text-indigo-400 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    href="/analysis"
                    className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center text-purple-600 dark:text-purple-400">
                        <BarChart3 size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">Analyze Resume</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Upload & get AI feedback</p>
                      </div>
                    </div>
                    <ArrowRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <div className="mt-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/30 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      💡 Pro tip: Use ATS-friendly keywords to boost your score.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

         
        </div>
      </main>
    </div>
  );
};

export default UserDashboardPage;