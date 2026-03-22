import DashboardHeader from '@/components/modules/user/DashboardHeader'
import DashboardSidebar from '@/components/modules/user/DashboardSidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import UserContextWrapper, { useUser } from '@/context/UserContext'

import { getUserCredit } from '@/services/credit.services'
import React, { ReactNode } from 'react'
const AdminDashboardLayout = async({children}:{children:ReactNode}) => {


  return (
   <UserContextWrapper>
     <div className='min-h-screen  w-full bg-background'>
          <DashboardHeader />

  
        
       <div className='flex items-start w-full'>

         <DashboardSidebar/>
         <div className='w-full'>
        
            {children}
      
         </div>

       </div>
    
  
    </div>
   </UserContextWrapper>
  )
}

export default AdminDashboardLayout