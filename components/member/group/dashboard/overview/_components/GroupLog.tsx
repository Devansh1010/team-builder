import { fetchActiveGroups } from '@/lib/api/group.api'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'

const GroupLog = () => {

    const { data: groupLog, isLoading } = useQuery({
        queryKey: ['groupLog'],
        queryFn: fetchActiveGroups,

        gcTime: 1000 * 60 * 30,
        refetchOnWindowFocus: false,
    })

    return (
        <div>
            {
                isLoading ? (
                    <div>
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>) : (
                    <div>

                    </div>)
            }
        </div>
    )
}

export default GroupLog