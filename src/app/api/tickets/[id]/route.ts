/* Ticket API Routes (Single Ticket) */

import { NextRequest, NextResponse } from 'next/server'
import { TicketController } from '@/controllers/ticketController'
import { UpdateTicketDTO } from '@/types'

/* GET /api/tickets/[id] - Get ticket by ID */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const result = await TicketController.getTicketById(id)

    if (!result.success) {
      return NextResponse.json(result, { status: 404 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    console.error('API Get Ticket By ID Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    )
  }
}

/* PUT /api/tickets/[id] - Update ticket */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Extract and verify token for updated_by
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    let updated_by: string | undefined = undefined
    if (token) {
      const { verifyToken } = await import('@/utils/jwt')
      const decoded = verifyToken(token)
      
      if (decoded && decoded.userId) {
        updated_by = decoded.userId
      }
    }

    const { id } = params
    const body: UpdateTicketDTO = await request.json()

    // Add updated_by to the ticket data
    const ticketData: UpdateTicketDTO = {
      ...body,
      updated_by
    }

    const result = await TicketController.updateTicket(id, ticketData)

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    console.error('API Update Ticket Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    )
  }
}

/* DELETE /api/tickets/[id] - Delete ticket */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const result = await TicketController.deleteTicket(id)

    if (!result.success) {
      return NextResponse.json(result, { status: 404 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    console.error('API Delete Ticket Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    )
  }
}

