import AnalysisDetails from '@/components/modules/analysis/ATSAnalysisDetails'
import JobMatcherDetails from '@/components/modules/analysis/JobMatcherAnalysisDetails'
import React from 'react'

const AnalysisDetailsPage = async ({params}:{params:{id:string}}) => {
    const {id} = await params
  return (
    <div>

      <AnalysisDetails id={id}/>
      {/* <JobMatcherDetails id={id}/> */}

    </div>
  )
}

export default AnalysisDetailsPage