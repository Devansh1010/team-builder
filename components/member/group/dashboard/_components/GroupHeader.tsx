import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { IAccessTo, IGroup } from '@/models/user_models/group.model'

const GroupHeader = ({ group }: { group: IGroup }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 px-1 border-b border-border/40 mb-8">
      {/* Left Section: Branding & Info */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20">
            Active Group
          </span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tighter text-slate-900 dark:text-white sm:text-4xl">
          {group.name.toUpperCase()}
        </h1>
        <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Project Dashboard • {group.accessTo?.length || 0} collaborators
        </p>
      </div>

      {/* Right Section: Member Stack & Actions */}
      <div className="flex items-center gap-4">
        <div className="flex -space-x-3 hover:-space-x-1 transition-all duration-500 ease-in-out py-2 px-1">
          {group.accessTo?.slice(0, 5).map((user: IAccessTo) => (
            <Avatar
              key={user.userId.toString()}
              className="h-10 w-10 border-2 border-background ring-2 ring-transparent hover:ring-primary/30 transition-all cursor-pointer shadow-md"
            >
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`} />
              <AvatarFallback className="bg-secondary text-[10px] font-bold">
                {user.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ))}

          {/* Excess Members Indicator */}
          {group.accessTo && group.accessTo.length > 5 && (
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-bold shadow-md">
              +{group.accessTo.length - 5}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GroupHeader
