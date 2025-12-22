// lib/api/group.api.ts
import axios from 'axios'
import { JoinGroupSchema } from '@/lib/schemas/group/SendRequest'

export const fetchActiveGroups = async () => {
  const res = await axios.get('/api/member/group/getGroupById')
  return res.data.data
}

export const fetchAllGroups = async () => {
  const res = await axios.get('/api/member/group/getAllGroups')
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
  const res = await axios.post(`/api/member/group/accept-reject-request`, null, {
    params: { groupId, requestedUser: requestedUserId, isAccept },
  })

  console.log('+++++++++++++++++++++++++++')
  console.log(res.data)
  return res.data
}

export const sendJoinRequest = async ({
  groupId,
  data,
}: {
  groupId: string
  data: JoinGroupSchema
}) => {
  return axios.post(`/api/member/group/joinGroup?groupId=${groupId}`, data)
}

export const widrawRequest = async (groupId: string) => {
  return axios.post(`/api/member/group/widrawRequest?groupId=${groupId}`)
}

export const handleLeaveGroup = async ({
  groupId,
  data,
}: {
  groupId: string
  data: JoinGroupSchema
}) => {
  return axios.post(`/api/member/group/leaveGroup?groupId=${groupId}`, data)
}

export const joinRequest = async (groupId: string) => {
  const res = await axios.post(`/api/member/group/joinGroup?groupId=${groupId}`)
  return {
    message: res.data.message,
  }
}

export const createGroup = async ({
  name,
  desc,
  techStack,
}: {
  name: string
  desc?: string
  techStack: string[]
}) => {
  const res = await axios.post(`/api/member/group/createGroup`, { name, desc, techStack })

  // ! Check data and update all the pages query accordingly
  console.log(res.data)
  return res.data
}
