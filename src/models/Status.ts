/* Status Model - Database operations */

import { query } from '@/lib/db'
import { Status, CreateStatusDTO, UpdateStatusDTO } from '@/types'

export class StatusModel {
  /* Find status by ID */
  static async findById(id: string): Promise<Status | null> {
    const result = await query('SELECT * FROM status WHERE id = $1', [id])
    return result.rows[0] || null
  }

  /* Find all statuses */
  static async findAll(): Promise<Status[]> {
    const result = await query('SELECT * FROM status ORDER BY name ASC')
    return result.rows
  }

  /* Create a new status */
  static async create(data: CreateStatusDTO): Promise<Status> {
    const result = await query(
      `INSERT INTO status (name) VALUES ($1) RETURNING *`,
      [data.name]
    )
    return result.rows[0]
  }

  /* Update status */
  static async update(id: string, data: UpdateStatusDTO): Promise<Status | null> {
    if (!data.name) return null

    const result = await query(
      `UPDATE status SET name = $1 WHERE id = $2 RETURNING *`,
      [data.name, id]
    )
    return result.rows[0] || null
  }

  /* Delete status */
  static async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM status WHERE id = $1', [id])
    return (result.rowCount || 0) > 0
  }
}

