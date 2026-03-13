import React, { ReactNode } from 'react'

const publiclayout = ({children}:{children:ReactNode}) => {
  return (
    <div className='min-w-full'>
        public header
        <div className='w-full '>{children}</div>
    </div>
  )
}

export default publiclayout


