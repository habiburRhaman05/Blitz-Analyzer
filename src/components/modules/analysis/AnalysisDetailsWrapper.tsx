"use client"
import httpClient from '@/lib/axios-client';
import { useEffect, useState } from 'react';
import AnalysisDetails, { AnalysisSkeleton } from './ATSAnalysisDetails';
import JobMatcherDetails from './JobMatcherAnalysisDetails';
import SaveAnalysisResult from './SaveAnalysisResult';

const AnalysisDetailsWrapper = ({id}:{id:string}) => {

    const [loading,setLoadign] = useState(false);
    const [data, setData] = useState(null)

    const fetchData = async()=>{
        const response = await httpClient.post(
        `/analyzer/analysis/${id}`, 
        
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      
      setData(response.data.data)
    setLoadign(false)
    }

      useEffect(()=>{
      fetchData()
      },[])
    

      if(loading) return <h1>Loading.....</h1>
      if(!data && !loading) return <AnalysisSkeleton/>

  return (
    <div>
{data && <SaveAnalysisResult id={id}/>}

 {
    data && data?.analysis_type === "ATS_SCAN" ? <AnalysisDetails data={data}/> : <JobMatcherDetails data={data}/>
 }

    </div>
  )
}

export default AnalysisDetailsWrapper