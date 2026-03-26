import PublicHeader from '@/components/global/PublicHeader'
import { Footer } from '@/components/modules/landing-pages/footer'
import React, { ReactNode } from 'react'

const publiclayout = ({children}:{children:ReactNode}) => {
  return (
    <div className='min-w-full dark:from-slate-950 dark:to-slate-900 ' >
           <PublicHeader/>
      
        {children}
      <Footer/>

    </div>
  )
}

export default publiclayout


