/* TicketFile Model - Database operations */

import { query } from '@/lib/db'
import { TicketFile, CreateTicketFileDTO, TicketFileWithUploader } from '@/types'

export class TicketFileModel {
  /* Find ticket file by ID */
  static async findById(id: string): Promise<TicketFile | null> {
    const result = await query(
      'SELECT * FROM ticket_file WHERE id = $1',
      [id]
    )
    return result.rows[0] || null
  }

  /* Find all files for a specific ticket */
  static async findByTicketId(ticket_id: string): Promise<TicketFileWithUploader[]> {
    const result = await query(
      `SELECT 
        tf.*,
        u.first_name as uploader_first_name,
        u.last_name as uploader_last_name,
        u.email as uploader_email
       FROM ticket_file tf
       LEFT JOIN "user" u ON tf.uploaded_by = u.id
       WHERE tf.ticket_id = $1
       ORDER BY tf.created_date DESC`,
      [ticket_id]
    )
    return result.rows
  }

  /* Create a new ticket file */
  static async create(data: CreateTicketFileDTO): Promise<TicketFile> {
    const result = await query(
      `INSERT INTO ticket_file (ticket_id, file_name, file_path, file_size, file_type, uploaded_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        data.ticket_id,
        data.file_name,
        data.file_path,
        data.file_size || null,
        data.file_type || null,
        data.uploaded_by || null
      ]
    )
    return result.rows[0]
  }

  /* Delete ticket file */
  static async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM ticket_file WHERE id = $1', [id])
    return (result.rowCount || 0) > 0
  }

  /* Delete all files for a ticket */
  static async deleteByTicketId(ticket_id: string): Promise<boolean> {
    const result = await query('DELETE FROM ticket_file WHERE ticket_id = $1', [ticket_id])
    return (result.rowCount || 0) > 0
  }
}

