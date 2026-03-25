"use client"
import { Transaction } from '@/components/modules/admin/TransactionHistoryWrapper'
import { useApiQuery } from '@/hooks/useApiQuery'
import { ApiResponse } from '@/interfaces/response'
import { getAdminDashboardData } from '@/services/admin.services'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

const AdminDashboard = () => {

    const { data, isLoading, isFetching } = useQuery({
    queryKey: ["admin-dashboard-data"],
    queryFn: () => getAdminDashboardData(),
    staleTime: 1000 * 30,
  });

console.log(data);


  return (
    <div>


 {JSON.stringify(data)}

    </div>
  )
}

export default AdminDashboard