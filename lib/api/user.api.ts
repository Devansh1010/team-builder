import axios from 'axios'

export const fetchCurrentActiveUser = async () => {
  const res = await axios.get('/api/member/user/me')
  return res.data.data
}
