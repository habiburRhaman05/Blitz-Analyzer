import PublicHeader from '@/components/global/PublicHeader'
import { Footer } from '@/components/modules/landing-pages/footer'
import AIChatbot from '@/components/modules/landing-pages/AIChatbot'
import React, { ReactNode } from 'react'

const publiclayout = ({children}:{children:ReactNode}) => {
  return (
    <div className='min-w-full dark:from-slate-950 dark:to-slate-900 ' >
           <PublicHeader/>
      
        {children}
      <Footer/>
      <AIChatbot />

    </div>
  )
}

export default publiclayout


