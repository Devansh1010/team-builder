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
                <div className="space-y-3">
                    {groupLog.logs.map((log: ILogs, index: number) => (
                        <div
                            key={index}
                            className="flex flex-col p-3 rounded-lg border bg-card text-card-foreground hover:bg-accent/50 transition-colors"
                        >
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-semibold leading-none tracking-tight">
                                    {log.username}
                                </p>
                                <div className="flex gap-2">
                                    {log.isRemoved && (
                                        <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-destructive/10 text-destructive border border-destructive/20">
                                            Removed
                                        </span>
                                    )}
                                    {log.isLeaved && (
                                        <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-orange-100 text-orange-600 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-400">
                                            Left
                                        </span>
                                    )}
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{log.msg}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default GroupLog