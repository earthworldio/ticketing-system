/* TicketFile Controller - Handles requests */

import { NextRequest } from 'next/server'
import { TicketFileService } from '@/services/ticketFileService'
import { CreateTicketFileDTO } from '@/types'

export class TicketFileController {
  /* Get all files for a ticket */
  static async getTicketFiles(ticket_id: string) {
    try {
      if (!ticket_id) {
        return { success: false, message: 'Ticket ID is required' }
      }
      const files = await TicketFileService.getTicketFiles(ticket_id)
      return { success: true, data: files }
    } catch (error: any) {
      console.error('Error fetching ticket files:', error)
      return { success: false, message: error.message || 'Failed to fetch files' }
    }
  }

  /* Upload a new file */
  static async uploadFile(request: NextRequest) {
    try {
      const body: CreateTicketFileDTO = await request.json()
      const { ticket_id, file_name, file_path, file_size, file_type, uploaded_by } = body

      if (!ticket_id || !file_name || !file_path) {
        return { success: false, message: 'Ticket ID, file name, and file path are required' }
      }

      const file = await TicketFileService.uploadFile({
        ticket_id,
        file_name,
        file_path,
        file_size,
        file_type,
        uploaded_by
      })
      return { success: true, data: file }
    } catch (error: any) {
      console.error('Error uploading file:', error)
      return { success: false, message: error.message || 'Failed to upload file' }
    }
  }

  /* Delete a file */
  static async deleteFile(id: string) {
    try {
      if (!id) {
        return { success: false, message: 'File ID is required' }
      }
      await TicketFileService.deleteFile(id)
      return { success: true, message: 'File deleted successfully' }
    } catch (error: any) {
      console.error('Error deleting file:', error)
      return { success: false, message: error.message || 'Failed to delete file' }
    }
  }
}

