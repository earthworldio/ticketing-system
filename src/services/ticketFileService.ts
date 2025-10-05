/* TicketFile Service - Business logic */

import { TicketFileModel } from '@/models/TicketFile'
import { CreateTicketFileDTO, TicketFileWithUploader } from '@/types'
import { promises as fs } from 'fs'
import path from 'path'

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

  /* Delete a file - removes from DB and file system */
  static async deleteFile(id: string): Promise<boolean> {
    // First, get the file info to know the file path
    const fileToDelete = await TicketFileModel.findById(id)
    
    if (!fileToDelete) {
      throw new Error('File not found')
    }

    // Delete the actual file from file system first
    try {
      // file_path is like "/uploads/filename.pdf"
      const filePath = path.join(process.cwd(), 'public', fileToDelete.file_path)
      await fs.unlink(filePath)
      console.log(`File deleted from filesystem: ${filePath}`)
    } catch (error) {
      console.error('Error deleting file from filesystem:', error)
      // Continue even if file deletion fails - might be already deleted
    }

    // Then delete from database
    const deleted = await TicketFileModel.delete(id)
    if (!deleted) {
      throw new Error('File not found or could not be deleted from database')
    }

    return deleted
  }
}

