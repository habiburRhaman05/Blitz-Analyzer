import { deleteOrderServerAction } from "@/app/_actions/orders"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useDeleteOrder() {
  const qc = useQueryClient()
  return useMutation((id: string) => deleteOrderServerAction(id), {
    onSuccess: () => qc.invalidateQueries(["orders"]),
    onError: (err: any) => {
      // serverAction already redirected if refresh failed;
      // but this catches network/failure states for UI handling.
      console.error(err)
    },
  })
}