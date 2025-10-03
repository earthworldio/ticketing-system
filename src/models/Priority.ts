/* Priority Model - Database operations */

import { query } from '@/lib/db'
import { Priority, CreatePriorityDTO, UpdatePriorityDTO } from '@/types'

export class PriorityModel {
  /* Find priority by ID */
  static async findById(id: string): Promise<Priority | null> {
    const result = await query(
      'SELECT * FROM priority WHERE id = $1',
      [id]
    )
    return result.rows[0] || null
  }

  /* Find priority by name */
  static async findByName(name: string): Promise<Priority | null> {
    const result = await query(
      'SELECT * FROM priority WHERE name = $1',
      [name]
    )
    return result.rows[0] || null
  }

  /* Find all priorities */
  static async findAll(): Promise<Priority[]> {
    const result = await query('SELECT * FROM priority ORDER BY name ASC')
    return result.rows
  }

  /* Create a new priority */
  static async create(data: CreatePriorityDTO): Promise<Priority> {
    const result = await query(
      `INSERT INTO priority (name)
       VALUES ($1)
       RETURNING *`,
      [data.name]
    )
    return result.rows[0]
  }

  /* Update priority */
  static async update(id: string, data: UpdatePriorityDTO): Promise<Priority | null> {
    if (data.name === undefined) return null

    const result = await query(
      `UPDATE priority SET name = $1 WHERE id = $2 RETURNING *`,
      [data.name, id]
    )
    return result.rows[0] || null
  }

  /* Delete priority */
  static async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM priority WHERE id = $1', [id])
    return (result.rowCount || 0) > 0
  }
}

