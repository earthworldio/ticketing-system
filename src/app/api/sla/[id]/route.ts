/* SLA API Routes (Single SLA) */

import { NextRequest, NextResponse } from 'next/server'
import { SLAController } from '@/controllers/slaController'
import { UpdateSLADTO } from '@/types'

/* GET /api/sla/[id] - Get SLA by ID */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const result = await SLAController.getSLAById(id)

    if (!result.success) {
      return NextResponse.json(result, { status: 404 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch SLA',
        error: error.message
      },
      { status: 500 }
    )
  }
}

/* PUT /api/sla/[id] - Update SLA */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body: UpdateSLADTO = await request.json()

    const result = await SLAController.updateSLA(id, body)

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update SLA',
        error: error.message
      },
      { status: 500 }
    )
  }
}

/* DELETE /api/sla/[id] - Delete SLA */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const result = await SLAController.deleteSLA(id)

    if (!result.success) {
      return NextResponse.json(result, { status: 404 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete SLA',
        error: error.message
      },
      { status: 500 }
    )
  }
}

