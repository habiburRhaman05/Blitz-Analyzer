'use client'

import { ReactNode } from 'react'

const AuthLayout = ({ children }: { children: ReactNode }) => {


  return (
   <div className='mx-auto'>

    {children}
   
   </div>
  )
}

export default AuthLayout