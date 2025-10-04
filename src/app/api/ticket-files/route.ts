/* Ticket File API Routes */

import { NextRequest, NextResponse } from 'next/server'
import { TicketFileController } from '@/controllers/ticketFileController'

/* POST /api/ticket-files - Upload a new file */
export async function POST(request: NextRequest) {
  try {
    const result = await TicketFileController.uploadFile(request)
    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }
    return NextResponse.json(result, { status: 201 })
  } catch (error: any) {
    console.error('API Upload File Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    )
  }
}

/* GET /api/ticket-files?ticket_id=xxx - Get all files for a ticket */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ticket_id = searchParams.get('ticket_id') as string

    const result = await TicketFileController.getTicketFiles(ticket_id)
    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }
    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    console.error('API Get Ticket Files Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    )
  }
}

