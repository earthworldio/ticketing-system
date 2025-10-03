/* Status API Routes */

import { NextRequest, NextResponse } from 'next/server'
import { StatusController } from '@/controllers/statusController'
import { CreateStatusDTO } from '@/types'

/* POST /api/statuses - Create status */
export async function POST(request: NextRequest) {
  try {
    const body: CreateStatusDTO = await request.json()
    const result = await StatusController.createStatus(body)

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error: any) {
    console.error('API Create Status Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    )
  }
}

/* GET /api/statuses - Get all statuses */
export async function GET(request: NextRequest) {
  try {
    const result = await StatusController.getAllStatuses()

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    console.error('API Get All Statuses Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    )
  }
}

