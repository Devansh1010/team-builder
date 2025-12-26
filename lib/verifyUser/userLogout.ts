import { cookies } from 'next/headers'
import { createResponse, StatusCode } from '../createResponce'

export async function LogoutUser() {
  const cookieStore = await cookies()
  
  // Option 1: Using the delete method
  cookieStore.delete('authToken')

  // Option 2: Explicitly setting an expired cookie 
  
  /*
  cookieStore.set('authToken', '', {
    expires: new Date(0),
    path: '/',
  })
  */

  return createResponse(
    { success: true, message: 'Logged out successfully' },
    StatusCode.OK
  )
}