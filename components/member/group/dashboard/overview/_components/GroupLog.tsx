import { Badge } from '@/components/ui/badge'
import { fetchGroupLogs } from '@/lib/api/group.api'
import { ILogs } from '@/models/user_models/group-log.model'
import { IGroup } from '@/models/user_models/group.model'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'

const GroupLog = ({ group }: { group: IGroup }) => {

    const { data: groupLog, isLoading } = useQuery({
        queryKey: ['groupLog', group._id],
        queryFn: () => fetchGroupLogs(group._id!.toString()),

        gcTime: 1000 * 60 * 30,
        refetchOnWindowFocus: false,
    })

    return (
        <div className="w-full mx-auto p-4 border rounded-xl bg-background shadow-sm">
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground italic">Fetching logs...</p>
                </div>
            ) : !groupLog?.logs || groupLog.logs.length === 0 ? (
                /* Empty or Undefined State */
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground">No logs found</p>
                    <p className="text-xs text-muted-foreground/70">Activities will appear here once they occur.</p>
                </div>
            ) : (
                /* Active State */
                <div className="space-y-4">
                    {groupLog.logs.map((log: ILogs, index: number) => (
                        <div
                            key={index}
                            className="group relative flex flex-col gap-1 p-4 rounded-xl border bg-card transition-all hover:shadow-md hover:border-primary/20"
                        >
                            {/* Top Row: User and Badges */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                                    <span className="text-sm font-bold tracking-tight text-foreground">
                                        {log.username}
                                    </span>
                                </div>

                                <div className="flex gap-2">
                                    {log.isRemoved && (
                                        <Badge variant="destructive" className="h-5 text-[10px] uppercase font-bold px-2">
                                            Removed
                                        </Badge>
                                    )}
                                    {log.isLeaved && (
                                        <Badge className="h-5 text-[10px] uppercase font-bold px-2 bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 border-none">
                                            Left
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            {/* Message Content */}
                            <div className="pl-4 border-l-2 border-muted ml-1 mt-1">
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {log.msg || "No additional details provided."}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default GroupLog