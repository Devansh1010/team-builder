import UserProfileDetails from "@/components/member/profile/UserProfileDetails"
import UserActivityLogs from "@/components/member/profile/UserActivityLogs"

const ProfilePage = () => {

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