// utils/nextResponse.ts
import { NextResponse } from 'next/server'

export enum StatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE = 422,
  INTERNAL_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

type ApiResponse<T> = {
  success: boolean
  message: string
  data?: T
  error?: T
}

export function createResponse<T>(payload: ApiResponse<T>, status: StatusCode = StatusCode.OK) {
  return NextResponse.json(payload, { status })
}
