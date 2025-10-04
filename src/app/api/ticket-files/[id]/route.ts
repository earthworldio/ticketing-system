/* Ticket File API Routes - Single file operations */

import { NextRequest, NextResponse } from 'next/server'
import { TicketFileController } from '@/controllers/ticketFileController'

/* DELETE /api/ticket-files/[id] - Delete a file */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const result = await TicketFileController.deleteFile(id)
    if (!result.success) {
      return NextResponse.json(result, { status: 404 })
    }
    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    console.error('API Delete File Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    )
  }
}

