"use client";

import { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAnalysisDetails } from "@/services/analysis.services";
import AnalysisDetails from "./ATSAnalysisDetails";
import { AnalysisError, AnalysisNotFound } from "./AnalysisNotFound";
import PremiumAnalysisLoader from "./AnalysisAnimation";
import { AnalysisSkeleton } from "./AnalysisDetailsSkelections";
import {motion} from "framer-motion"
import { useSearchParams } from "next/navigation";
interface Props {
  id: string;
}

const AnalysisDetailsWrapper = ({ id }: Props) => {
  const cacheKey = `fetch-analysis-details-${id}`;
  const [minTimeMet, setMinTimeMet] = useState(false);
 const searchParams = useSearchParams()
  const { data, isLoading, refetch, isError } = useQuery({
    queryKey: [cacheKey],
    queryFn: () => getAnalysisDetails(id),
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeMet(true);
    }, 5000); // 5-second minimum brand experience

    return () => clearTimeout(timer);
  }, []);

  // Condition: Still fetching from API OR the 5-second animation hasn't finished
  const showLoader = isLoading || !minTimeMet;

  if (showLoader) {
    return searchParams.get("type") === "new" ? (
      <div className="min-h-[70vh] flex items-center justify-center p-6 bg-background/50 backdrop-blur-sm">
        <PremiumAnalysisLoader />
      </div>
    ) : (
      <AnalysisSkeleton />
    );
  }

  if (isError) return <AnalysisError />;
  
  // Final check for data existence
  if (!data?.data) return <AnalysisNotFound />;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="space-y-6"
    >
      <AnalysisDetails 
        cacheKey={cacheKey} 
        analysisData={data.data} 
        onRetry={refetch}
      />
    </motion.div>
  );
};

export default AnalysisDetailsWrapper;