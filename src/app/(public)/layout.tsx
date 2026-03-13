import React, { ReactNode } from 'react'

const publiclayout = ({children}:{children:ReactNode}) => {
  return (
    <div>
        public header
        <div>{children}</div>
    </div>
  )
}

export default publiclayout