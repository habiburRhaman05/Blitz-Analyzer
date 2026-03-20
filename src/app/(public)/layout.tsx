import React, { ReactNode } from 'react'

const publiclayout = ({children}:{children:ReactNode}) => {
  return (
    <div className='min-w-full'>
        <div className='w-full container mx-auto '>{children}</div>
    </div>
  )
}

export default publiclayout


