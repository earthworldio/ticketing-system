/* Ticket API Routes */

import { NextRequest, NextResponse } from 'next/server'
import { TicketController } from '@/controllers/ticketController'
import { CreateTicketDTO } from '@/types'

/* POST /api/tickets - Create ticket */
export async function POST(request: NextRequest) {
  try {
    // Extract and verify token
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    let created_by: string | undefined = undefined
    if (token) {
      const { verifyToken } = await import('@/utils/jwt')
      const decoded = verifyToken(token)
      
      if (decoded && decoded.userId) {
        created_by = decoded.userId
      }
    }

    const body: CreateTicketDTO = await request.json()
    
    // Add created_by to the ticket data
    const ticketData: CreateTicketDTO = {
      ...body,
      created_by
    }

    const result = await TicketController.createTicket(ticketData)

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error: any) {
    console.error('API Create Ticket Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    )
  }
}

/* GET /api/tickets - Get all tickets or by project_id */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const project_id = searchParams.get('project_id')

    let result
    if (project_id) {
      result = await TicketController.getTicketsByProject(project_id)
    } else {
      result = await TicketController.getAllTickets()
    }

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    console.error('API Get Tickets Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    )
  }
}

