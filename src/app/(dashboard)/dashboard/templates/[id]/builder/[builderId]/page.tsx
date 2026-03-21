
import React from 'react'

import { useApiQuery } from '@/hooks/useApiQuery'
import  ResumeBuilder from '@/components/modules/resume/ResumeBuilder'


const ResumeBuilderPage = async({params}:{params:{id:string;builderId:string}}) => {
    const {id,builderId} = await params


  return <ResumeBuilder id={id} builderId={builderId}/>;
}

export default ResumeBuilderPage