
import React from 'react'
import ResumeBuilder from '../../page'
import ResumeBuilderPageForm from '@/components/modules/resume/ResumeBuilder'

const ResumeBuilderPage = async({params}) => {
    const {id,builderId} = await params
  return (
    <div>
<ResumeBuilderPageForm id={id} builderId={builderId} />
        
    </div>
  )
}

export default ResumeBuilderPage