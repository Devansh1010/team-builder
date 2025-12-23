import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { IAccessTo, IGroup } from '@/models/user_models/group.model'

const GroupHeader = ({ group }: { group: IGroup }) => {
  return (
   <div className="flex items-center justify-between">
      {/* Group Title */}
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
        {group.name.toUpperCase()}
      </h1>

      {/* Members - Overlapping Avatar Stack */}
      <div className="flex -space-x-3 hover:space-x-1 transition-all duration-300">
        {group.accessTo?.map((user: IAccessTo) => (
          <Avatar
            key={user.userId.toString()}
            className="h-9 w-9 border-2 border-white dark:border-[#161616] shadow-sm"
          >
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback className="bg-slate-100 dark:bg-white/5 text-xs">U</AvatarFallback>
          </Avatar>
        ))}
      </div>
    </div>
  )
}

export default GroupHeader
