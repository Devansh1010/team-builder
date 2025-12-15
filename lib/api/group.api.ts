// lib/api/group.api.ts
import axios from 'axios'

export const fetchActiveGroups = async () => {
  const res = await axios.get('/api/member/group/getGroupById')
  return res.data.data
}

export const handleGroupRequest = async ({
  groupId,
  requestedUserId,
  isAccept,
}: {
  groupId: string
  requestedUserId: string
  isAccept: boolean
}) => {
  return axios.post(
    `/api/member/group/accept-reject-request`,
    null,
    {
      params: { groupId, requestedUser: requestedUserId, isAccept },
    }
  )
}
