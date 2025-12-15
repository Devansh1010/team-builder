import { cookies } from 'next/headers'
import { createResponse, StatusCode } from '../createResponce'
import jwt from 'jsonwebtoken'

export interface TokenPayload {
  id: string
  username: string
}

export async function VerifyUser() {
  const token = (await cookies()).get('authToken')?.value

  if (!token) {
    return {
      success: false,
      response: createResponse(
        { success: false, message: 'Login required' },
        StatusCode.UNAUTHORIZED
      ),
    }
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload
    return {
      success: true,
      user: decoded,
    }
  } catch {
    return {
      success: false,
      response: createResponse(
        { success: false, message: 'Invalid token' },
        StatusCode.UNAUTHORIZED
      ),
    }
  }
}
