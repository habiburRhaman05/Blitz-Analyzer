import ResumeListingWrapper from '@/components/modules/resume/ResumeListingWrapper';
import { getAllResumeById } from '@/services/resume.services';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import React from 'react'

const MyResumeLists = async() => {

  const cacheKey = "fetch-users-resumes"
const queryClient = new QueryClient();
  await queryClient.prefetchQuery({queryKey:[cacheKey],queryFn:getAllResumeById})




  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
    <ResumeListingWrapper cacheKey={cacheKey}/>
     </HydrationBoundary>
  )
}

export default MyResumeLists