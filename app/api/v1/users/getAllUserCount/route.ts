import { createResponse, StatusCode } from '@/lib/createResponce'
import { dbConnect } from '@/lib/dbConnect'
import Set from '@/models/batch.model'
import { NextRequest } from 'next/server'
import { auth } from '@/auth'
import valkey from '@/lib/valkey'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()

    if (!session || !session?.user)
      return createResponse(
        {
          success: false,
          message: 'User Not Allowed',
        },
        StatusCode.UNAUTHORIZED
      )

    await dbConnect()

    const cachedCount = await valkey.get('user_count')

    if (cachedCount !== null) {
      console.log('📦 Returning cached user count')
      return createResponse(
        {
          success: true,
          message: 'Users found (cached)',
          data: Number(cachedCount),
        },
        StatusCode.OK
      )
    }

    const batchArray = await Set.find({})

    if (batchArray.length === 0)
      return createResponse(
        {
          success: false,
          message: 'No Batches found',
        },
        StatusCode.NOT_FOUND
      )

    const count = batchArray.reduce((acc, item) => acc + item.users.length, 0)

    await valkey.setEx('user_count', 600, String(count))

    return createResponse(
      {
        success: true,
        message: 'Batches found',
        data: count,
      },
      StatusCode.OK
    )
  } catch (error: any) {
    console.error('Error creating batch:', error)

    return createResponse(
      {
        success: false,
        message: 'Error Feetching Batch Count',
        error: {
          code: '500',
          message: 'Internal Server Error',
          details: error.message,
        },
      },
      StatusCode.INTERNAL_ERROR
    )
  }
}
