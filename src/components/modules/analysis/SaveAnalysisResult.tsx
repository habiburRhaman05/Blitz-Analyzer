"use client"
import { Button } from '@/components/ui/button'
import { useUser } from '@/context/UserContext'
import { useApiMutation } from '@/hooks/useApiMutation'
import { AnalysisResult } from '@/interfaces/analysis'
import { useQueryClient } from '@tanstack/react-query'
import { File, Loader, Store } from 'lucide-react'
import React from 'react'

const SaveAnalysisResult = ({id,cacheKey}:{id:string,cacheKey:string}) => {

    const {user,isLoading} = useUser()
  
    const queryClient = useQueryClient()

    const {isPending,mutateAsync} = useApiMutation({
        actionName:"save-analysis-details",
        actionType:"SERVER_SIDE",
        endpoint:`/analyzer/analysis/save/${id}`,
        method:"POST"
    })


    const handleSaveDetails = async ()=>{
       const result = await mutateAsync({})
       if(result.success){
           
           
        queryClient.invalidateQueries({queryKey:[cacheKey]})


       }
       
       
    }

    
    const findAnalysis = user?.analysisHistory.filter((item:AnalysisResult) => item.id === id);
    const isAlreadySaved = findAnalysis && findAnalysis.length > 0 


  return (
<div>
        <Button
    onClick={handleSaveDetails}
    disabled={ isAlreadySaved || isPending || isLoading || !user}
    >
  {isPending ? <>
  <Loader className='mr-3 animate-spin'/> <p>Saving Analysis</p>
  </> :     <>
  <Store className='mr-3'/> <p>Save Analysis</p></>}
    </Button>
    {!user && !isLoading && <p className='text-destructive-foreground my-2'>Please Login First to Save Analysis</p>}
</div>
  )
}

export default SaveAnalysisResult