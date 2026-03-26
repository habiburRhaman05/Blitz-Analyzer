import React, { ReactNode } from 'react'

const publiclayout = ({children}:{children:ReactNode}) => {
  return (
    <div className='min-w-full dark:from-slate-950 dark:to-slate-900 ' >
        {children}
    </div>
  )
}

export default publiclayout


