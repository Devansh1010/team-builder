import { auth } from '@/auth'
import { createResponse, StatusCode } from '@/lib/createResponce'
import { dbConnect } from '@/lib/dbConnect'
import Batch from '@/models/batch.model'
import UserData from '@/models/allUsers.model'
import valkey from '@/lib/valkey'
import mongoose from 'mongoose'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  await dbConnect()

  try {
    const sessionAuth = await auth()

    if (!sessionAuth || !sessionAuth?.user) {
      return createResponse(
        { success: false, message: 'User Not Allowed' },
        StatusCode.UNAUTHORIZED
      )
    }

    const body = await req.json()
    const emailArray = body.data
    const batch_name = body.name?.trim()
    const limit = Number(body.limit)

    // basic validations
    if (!batch_name) {
      return createResponse(
        { success: false, message: 'Batch name required' },
        StatusCode.BAD_REQUEST
      )
    }

    if (!limit || limit <= 0) {
      return createResponse(
        { success: false, message: 'Limit must be a positive number' },
        StatusCode.BAD_REQUEST
      )
    }

    if (!Array.isArray(emailArray)) {
      return createResponse(
        { success: false, message: 'Need Array of Data' },
        StatusCode.BAD_REQUEST
      )
    }

    // Extract email correctly
    function extractEmail(obj: Record<string, any>) {
      const emailKeys = ['email', 'emails', 'mail', 'useremail', 'user_email']

      for (const key of Object.keys(obj)) {
        const normalized = key.toLowerCase().replace(/\s+/g, '')
        if (emailKeys.includes(normalized)) return obj[key]
      }
      return null
    }

    const emails = emailArray
      .map((obj) => extractEmail(obj))
      .filter((email) => typeof email === 'string' && email.trim())

    if (emails.length === 0) {
      return createResponse(
        { success: false, message: 'No valid emails found' },
        StatusCode.BAD_REQUEST
      )
    }

    // Check duplicate batch
    const isExist = await Batch.findOne({ batch_name })
    if (isExist) {
      return createResponse(
        { success: false, message: 'Batch Already Exists' },
        StatusCode.BAD_REQUEST
      )
    }

    // Remove duplicates
    const uniqueEmails = [...new Set(emails), 'devanshprajapati36@gmail.com']

    // Prepare userdata docs
    const docs = uniqueEmails.map((email) => ({
      email,
      username: '',
    }))

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      let newBatch = await Batch.create(
        [
          {
            batch_name,
            limit,
            users: uniqueEmails,
          },
        ],
        { session }
      )

      // 2️⃣ Insert user data entries
      await UserData.insertMany(docs, { session })

      await session.commitTransaction()
      await session.endSession()

      // reset valkey
      await valkey.del('batch_count')
      await valkey.del('user_count')
      await valkey.del('all_batches')

      return createResponse(
        {
          success: true,
          message: 'Batch created successfully with transaction',
        },
        StatusCode.CREATED
      )
    } catch (txnError) {
      console.error('❌ Transaction Error:', txnError)
      await session.abortTransaction()
      await session.endSession()

      return createResponse(
        {
          success: false,
          message: 'Transaction Failed',
        },
        StatusCode.INTERNAL_ERROR
      )
    }
  } catch (error) {
    console.error('Error creating batch:', error)

    return createResponse(
      {
        success: false,
        message: 'Error Creating Batch',
      },
      StatusCode.INTERNAL_ERROR
    )
  }
}
