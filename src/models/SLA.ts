/* SLA Model - Database operations */

import { query } from '@/lib/db'
import { SLA, CreateSLADTO, UpdateSLADTO } from '@/types'

export class SLAModel {
  /* Find SLA by ID */
  static async findById(id: string): Promise<SLA | null> {
    const result = await query(
      'SELECT * FROM sla WHERE id = $1',
      [id]
    )
    return result.rows[0] || null
  }

  /* Find all SLAs */
  static async findAll(): Promise<SLA[]> {
    const result = await query('SELECT * FROM sla ORDER BY resolve_time ASC')
    return result.rows
  }

  /* Create a new SLA */
  static async create(data: CreateSLADTO): Promise<SLA> {
    const result = await query(
      `INSERT INTO sla (name, resolve_time)
       VALUES ($1, $2)
       RETURNING *`,
      [data.name, data.resolve_time]
    )
    return result.rows[0]
  }

  /* Update SLA */
  static async update(id: string, data: UpdateSLADTO): Promise<SLA | null> {
    const fields: string[] = []
    const values: any[] = []
    let paramCount = 1

    if (data.name !== undefined) {
      fields.push(`name = $${paramCount++}`)
      values.push(data.name)
    }

    if (data.resolve_time !== undefined) {
      fields.push(`resolve_time = $${paramCount++}`)
      values.push(data.resolve_time)
    }

    if (fields.length === 0) return null

    fields.push(`updated_date = now()`)
    values.push(id)

    const result = await query(
      `UPDATE sla SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    )
    return result.rows[0] || null
  }

  /* Delete SLA */
  static async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM sla WHERE id = $1', [id])
    return (result.rowCount || 0) > 0
  }
}

