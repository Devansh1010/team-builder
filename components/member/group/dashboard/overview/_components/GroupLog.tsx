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
        <div className="w-full space-y-6 animate-in fade-in duration-500">
            {/* Header for the section */}
            <div className="flex items-center justify-between px-1">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Activity History
                </h3>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/30">
                    <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                    <p className="mt-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Synchronizing Logs...</p>
                </div>
            ) : !groupLog?.logs || groupLog.logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-tighter">No events recorded</p>
                    <p className="text-xs text-slate-500 mt-1">Activity logs will appear here in chronological order.</p>
                </div>
            ) : (
                <div className="relative space-y-0 before:absolute before:inset-y-0 before:left-[17px] before:w-px before:bg-slate-200 dark:before:bg-slate-800">
                    {groupLog.logs.map((log: ILogs, index: number) => (
                        <div
                            key={index}
                            className="group relative flex items-start gap-6 pb-8 last:pb-0"
                        >
                            {/* Timeline Dot */}
                            <div className="relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-white bg-slate-900 ring-4 ring-white dark:border-slate-950 dark:bg-slate-100 dark:ring-slate-950 transition-transform group-hover:scale-125" />

                            {/* Log Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                            {log.username}
                                        </span>

                                        {/* Badges - Simple & Professional */}
                                        <div className="flex gap-1.5">
                                            {log.isRemoved && (
                                                <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter bg-red-50 text-red-600 border border-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50">
                                                    Removed
                                                </span>
                                            )}
                                            {log.isLeaved && (
                                                <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50">
                                                    Left Group
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Timestamp placeholder if you have it in your log object */}
                                    <span className="text-[10px] font-medium text-slate-400 uppercase">
                                        {/* log.createdAt ? format(new Date(log.createdAt), 'MMM d, h:mm a') : 'Recent' */}
                                        Recent Activity
                                    </span>
                                </div>

                                <div className="rounded-lg border border-transparent group-hover:border-slate-100 dark:group-hover:border-slate-900 transition-colors p-0.5">
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
                                        "{log.msg || "No additional details provided."}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default GroupLog