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
      `INSERT INTO sla (resolve_time)
       VALUES ($1)
       RETURNING *`,
      [data.resolve_time]
    )
    return result.rows[0]
  }

  /* Update SLA */
  static async update(id: string, data: UpdateSLADTO): Promise<SLA | null> {
    if (data.resolve_time === undefined) return null

    const result = await query(
      `UPDATE sla SET resolve_time = $1 WHERE id = $2 RETURNING *`,
      [data.resolve_time, id]
    )
    return result.rows[0] || null
  }

  /* Delete SLA */
  static async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM sla WHERE id = $1', [id])
    return (result.rowCount || 0) > 0
  }
}

