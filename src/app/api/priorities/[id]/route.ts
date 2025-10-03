/* Priority API Routes (Single Priority) */

import { NextRequest, NextResponse } from 'next/server'
import { PriorityController } from '@/controllers/priorityController'
import { UpdatePriorityDTO } from '@/types'

/* GET /api/priorities/[id] - Get priority by ID */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const result = await PriorityController.getPriorityById(id)

    if (!result.success) {
      return NextResponse.json(result, { status: 404 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch priority',
        error: error.message
      },
      { status: 500 }
    )
  }
}

/* PUT /api/priorities/[id] - Update priority */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body: UpdatePriorityDTO = await request.json()

    const result = await PriorityController.updatePriority(id, body)

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update priority',
        error: error.message
      },
      { status: 500 }
    )
  }
}

/* DELETE /api/priorities/[id] - Delete priority */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const result = await PriorityController.deletePriority(id)

    if (!result.success) {
      return NextResponse.json(result, { status: 404 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete priority',
        error: error.message
      },
      { status: 500 }
    )
  }
}

