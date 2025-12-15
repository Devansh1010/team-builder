import { fetchCurrentActiveUser } from '@/lib/api/user.api'
import { useQuery } from '@tanstack/react-query'

export const useActiveUser = () => {
  return useQuery({
    queryKey: ['activeUser'],
    queryFn: fetchCurrentActiveUser,
    staleTime: 5 * 60 * 1000, // 5 min
    refetchOnWindowFocus: false,
    retry: false,
  })
}
