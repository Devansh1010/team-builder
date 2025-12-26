import axios from 'axios'

export const fetchCurrentActiveUser = async () => {
  const res = await axios.get('/api/member/user/me')
  return res.data.data
}

export const fetchUserLogs = async () => {
  const res = await axios.get(`/api/member/user/getUserLogs`)

  return res.data.data
}