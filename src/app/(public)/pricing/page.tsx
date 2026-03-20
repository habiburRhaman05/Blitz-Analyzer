import PricingWrapper from '@/components/modules/pricing/PricingPage'
import { getAllPricingPlan } from '@/services/pricing.services';
import { dehydrate, HydrationBoundary, QueryClient, useQueryClient } from '@tanstack/react-query'


const PricingPage = async() => {

  const queryClient = new QueryClient();

  const cacheKey = "get-all-plans"

  await queryClient.prefetchQuery({queryKey:[cacheKey],queryFn:getAllPricingPlan})

  return (
   <HydrationBoundary state={dehydrate(queryClient)}>
<PricingWrapper 
cacheKey={cacheKey}
/>
   </HydrationBoundary>
  )
}

export default PricingPage