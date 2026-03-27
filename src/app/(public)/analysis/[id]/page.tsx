import AnalysisDetailsWrapper from '@/components/modules/analysis/AnalysisDetailsWrapper'
import AnalysisDetails from '@/components/modules/analysis/ATSAnalysisDetails'
import JobMatcherDetails from '@/components/modules/analysis/JobMatcherAnalysisDetails'
import React, { Suspense } from 'react'

const AnalysisDetailsPage = async ({params}:{params:{id:string}}) => {
    const {id} = await params
  return (
    <Suspense>

    <AnalysisDetailsWrapper id={id}/>
    
    </Suspense>
  )
}

export default AnalysisDetailsPage