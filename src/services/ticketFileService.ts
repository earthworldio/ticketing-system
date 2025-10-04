/* TicketFile Service - Business logic */

import { TicketFileModel } from '@/models/TicketFile'
import { CreateTicketFileDTO, TicketFileWithUploader } from '@/types'

export class TicketFileService {
  /* Get all files for a specific ticket */
  static async getTicketFiles(ticket_id: string): Promise<TicketFileWithUploader[]> {
    return await TicketFileModel.findByTicketId(ticket_id)
  }

  /* Upload a new file to a ticket */
  static async uploadFile(data: CreateTicketFileDTO): Promise<TicketFileWithUploader> {
    const file = await TicketFileModel.create(data)
    const files = await TicketFileModel.findByTicketId(file.ticket_id)
    return files.find(f => f.id === file.id) || file as TicketFileWithUploader
  }

  /* Delete a file */
  static async deleteFile(id: string): Promise<boolean> {
    const deleted = await TicketFileModel.delete(id)
    if (!deleted) {
      throw new Error('File not found or could not be deleted')
    }
    return deleted
  }
}

