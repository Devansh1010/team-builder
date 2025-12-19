import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { IAccessTo, IGroup } from '@/models/user_models/group.model'

const GroupHeader = ({ group }: { group: IGroup }) => {
  return (
    <div className="flex items-center justify-between">
      {/* Group Title */}
      <h1 className="text-2xl font-semibold tracking-wide text-gray-900 dark:text-gray-100">
        {group.name.toUpperCase()}
      </h1>

      {/* Members */}
      <div className="flex -space-x-2">
        {group.accessTo?.map((user: IAccessTo) => (
          <Avatar
            key={user.userId.toString()}
            className="h-8 w-8 border border-white dark:border-gray-900"
          >
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        ))}
      </div>
    </div>
  )
}

export default GroupHeader
