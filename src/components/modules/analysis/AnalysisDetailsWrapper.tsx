"use client";

import httpClient from "@/lib/axios-client";
import { useEffect, useState } from "react";
import AnalysisDetails from "./ATSAnalysisDetails";
import JobMatcherDetails from "./JobMatcherAnalysisDetails";
import { AnalysisSkeleton } from "./AnalysisDetailsSkelections";
import { AnalysisError, AnalysisNotFound } from "./AnalysisNotFound";
import { useQuery } from "@tanstack/react-query";
import { getAnalysisDetails } from "@/services/analysis.services";

interface Props {
  id: string;
}

const AnalysisDetailsWrapper = ({ id }: Props) => {

 const cacheKey = `fetch-analysis-details-${id}`


  const {data,isLoading,refetch,isError} = useQuery({queryKey:[cacheKey],queryFn: () =>  getAnalysisDetails(id)})

 
  
  

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <AnalysisSkeleton />
      </div>
    );
  }

  if (isError) {
  return <AnalysisError/>
  }

  if (!data) {
   return <AnalysisNotFound/>
  }
console.log("data",data);
  return (
    <div className="space-y-6">
   
        <AnalysisDetails cacheKey={cacheKey} analysisData={data?.data} onRetry={refetch}/>
    </div>
  );
};

export default AnalysisDetailsWrapper;