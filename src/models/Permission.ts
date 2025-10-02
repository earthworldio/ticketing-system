/* Permission Model - Database operations */

import { query } from '@/lib/db'
import { Permission, CreatePermissionDTO, UpdatePermissionDTO } from '@/types'

export class PermissionModel {
  /* Find permission by ID */
  static async findById(id: string): Promise<Permission | null> {
    const result = await query(
      'SELECT * FROM permission WHERE id = $1',
      [id]
    )
    
    return result.rows[0] || null
  }

  /* Find permission by name */
  static async findByName(name: string): Promise<Permission | null> {
    const result = await query(
      'SELECT * FROM permission WHERE name = $1',
      [name]
    )
    
    return result.rows[0] || null
  }

  /* Find all permissions */
  static async findAll(): Promise<Permission[]> {
    const result = await query('SELECT * FROM permission ORDER BY created_date DESC')
    return result.rows
  }

  /* Create a new permission */
  static async create(data: CreatePermissionDTO): Promise<Permission> {
    const result = await query(
      `INSERT INTO permission (name, description) 
       VALUES ($1, $2) 
       RETURNING *`,
      [data.name, data.description || null]
    )
    
    return result.rows[0]
  }

  /* Update permission */
  static async update(id: string, data: UpdatePermissionDTO): Promise<Permission | null> {
    const fields: string[] = []
    const values: any[] = []
    let paramCount = 1

    if (data.name !== undefined) {
      fields.push(`name = $${paramCount++}`)
      values.push(data.name)
    }

    if (data.description !== undefined) {
      fields.push(`description = $${paramCount++}`)
      values.push(data.description)
    }

    fields.push(`updated_date = now()`)
    values.push(id)

    const result = await query(
      `UPDATE permission SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    )

    return result.rows[0] || null
  }

  /* Delete permission */
  static async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM permission WHERE id = $1', [id])
    return (result.rowCount || 0) > 0
  }
}

