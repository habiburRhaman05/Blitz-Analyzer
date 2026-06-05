import IndustryIssueTracker from '@/components/modules/issue/IssueListing'
import { Suspense } from 'react'

const IssuePage = () => {
  return (
    <Suspense>
      <IndustryIssueTracker />
    </Suspense>
  )
}

export default IssuePage