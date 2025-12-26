import { fetchCurrentActiveUser } from "@/lib/api/user.api"
import { useQuery } from "@tanstack/react-query"
import UserProfileDetails from "@/components/member/profile/UserProfileDetails"
import UserActivityLogs from "@/components/member/profile/UserActivityLogs"


const ProfilePage = () => {
  const { data: activeUser, isLoading } = useQuery({
    queryKey: ['activeUser'],
    queryFn: fetchCurrentActiveUser,
  })
 
  if (isLoading) return <div className="p-10 text-center font-black uppercase tracking-widest animate-pulse">Syncing Profile...</div>

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-12">
      {/* Top Section: User Identity */}
      <UserProfileDetails />
      
      {/* Bottom Section: Activity Timeline */}
      <UserActivityLogs  />
    </div>
  )
}

export default ProfilePage