/* Priority API Routes */

import { NextRequest, NextResponse } from 'next/server'
import { PriorityController } from '@/controllers/priorityController'
import { CreatePriorityDTO } from '@/types'

/* POST /api/priorities - Create priority */
export async function POST(request: NextRequest) {
  try {
    const body: CreatePriorityDTO = await request.json()

    const result = await PriorityController.createPriority(body)

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error: any) {
    console.error('API Create Priority Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    )
  }
}

/* GET /api/priorities - Get all priorities */
export async function GET(request: NextRequest) {
  try {
    const result = await PriorityController.getAllPriorities()

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    console.error('API Get All Priorities Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    )
  }
}

