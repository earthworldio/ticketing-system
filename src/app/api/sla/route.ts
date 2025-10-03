/* SLA API Routes */

import { NextRequest, NextResponse } from 'next/server'
import { SLAController } from '@/controllers/slaController'
import { CreateSLADTO } from '@/types'

/* POST /api/sla - Create SLA */
export async function POST(request: NextRequest) {
  try {
    const body: CreateSLADTO = await request.json()

    const result = await SLAController.createSLA(body)

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error: any) {
    console.error('API Create SLA Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    )
  }
}

/* GET /api/sla - Get all SLAs */
export async function GET(request: NextRequest) {
  try {
    const result = await SLAController.getAllSLAs()

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    console.error('API Get All SLAs Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    )
  }
}

