import { fetchCurrentActiveUser, fetchUserLogs } from '@/lib/api/user.api'
import { ILogEntry } from '@/models/user_models/user-log.model'
import { useQuery } from '@tanstack/react-query'
import { History, ArrowRightLeft, UserPlus, UserMinus } from 'lucide-react'

const UserActivityLogs = () => {

    const { data: activeUserLogs, isLoading } = useQuery({
        queryKey: ['activeUserLogs'],
        queryFn: fetchUserLogs,
    })

    return (
        <div className="w-full space-y-6">
            <div className="flex flex-col gap-1">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Personal Audit Trail</h3>
                <p className="text-lg font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">Activity Logs</p>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-black/20 p-6 shadow-sm">
                {!activeUserLogs || activeUserLogs.length === 0 ? (
                    <div className="py-12 text-center">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">No logs found</p>
                    </div>
                ) : (
                    <div className="space-y-0 relative before:absolute before:inset-y-0 before:left-[17px] before:w-px before:bg-slate-100 dark:before:bg-slate-900">
                        {activeUserLogs.map((log: ILogEntry, index: number) => (
                            <div key={index} className="group relative flex items-start gap-6 pb-8 last:pb-0">
                                {/* Timeline Icon Marker */}
                                <div className={`relative z-10 mt-1 h-9 w-9 shrink-0 flex items-center justify-center rounded-lg border-2 border-white dark:border-slate-950 bg-slate-50 dark:bg-slate-900 transition-all group-hover:scale-110 shadow-sm
                  ${log.isCreated ? 'text-emerald-500' : log.isRemoved || log.isLeaved ? 'text-red-500' : 'text-slate-400'}`}>
                                    {log.isCreated ? <UserPlus size={16} /> : log.isLeaved ? <UserMinus size={16} /> : <History size={16} />}
                                </div>

                                <div className="flex-1 pt-1.5">
                                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                            {log.groupName}
                                            <span className="ml-2 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-tighter bg-slate-100 dark:bg-slate-800 rounded">
                                                Group Event
                                            </span>
                                        </p>
                                    </div>
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed italic">
                                        "{log.msg}"
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default UserActivityLogs