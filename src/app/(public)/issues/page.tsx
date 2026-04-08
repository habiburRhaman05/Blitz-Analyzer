import IndustryIssueTracker from '@/components/modules/issue/IssueListing'
import React, { Suspense } from 'react'

const IssuePage = () => {
  return (
    <Suspense>

      <IndustryIssueTracker/>
    </Suspense>
  )
}

export default IssuePage