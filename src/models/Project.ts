/* Project Model - Database operations */

import { query } from '@/lib/db'
import { Project, CreateProjectDTO, UpdateProjectDTO } from '@/types'

export class ProjectModel {
  /* Find project by ID */
  static async findById(id: string): Promise<Project | null> {
    const result = await query(
      `SELECT 
        p.*,
        c.name as customer_name,
        c.code as customer_code
       FROM project p
       LEFT JOIN customer c ON p.customer_id = c.id
       WHERE p.id = $1`,
      [id]
    )
    return result.rows[0] || null
  }

  /* Find all projects */
  static async findAll(): Promise<Project[]> {
    const result = await query(`
      SELECT 
        p.*,
        c.name as customer_name,
        c.code as customer_code
      FROM project p
      LEFT JOIN customer c ON p.customer_id = c.id
      ORDER BY p.created_date DESC
    `)
    return result.rows
  }

  /* Create a new project */
  static async create(data: CreateProjectDTO): Promise<Project> {
    const result = await query(
      `INSERT INTO project (name, code, description, customer_id, start_date, end_date, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        data.name,
        data.code || null,
        data.description || null,
        data.customer_id,
        data.start_date || null,
        data.end_date || null,
        data.created_by || null
      ]
    )
    return result.rows[0]
  }

  /* Update project */
  static async update(id: string, data: UpdateProjectDTO): Promise<Project | null> {
    const fields: string[] = []
    const values: any[] = []
    let paramCount = 1

    if (data.name !== undefined) {
      fields.push(`name = $${paramCount++}`)
      values.push(data.name)
    }

    if (data.code !== undefined) {
      fields.push(`code = $${paramCount++}`)
      values.push(data.code)
    }

    if (data.description !== undefined) {
      fields.push(`description = $${paramCount++}`)
      values.push(data.description)
    }

    if (data.customer_id !== undefined) {
      fields.push(`customer_id = $${paramCount++}`)
      values.push(data.customer_id)
    }


    if (data.start_date !== undefined) {
      fields.push(`start_date = $${paramCount++}`)
      values.push(data.start_date)
    }

    if (data.end_date !== undefined) {
      fields.push(`end_date = $${paramCount++}`)
      values.push(data.end_date)
    }

    if (data.updated_by !== undefined) {
      fields.push(`updated_by = $${paramCount++}`)
      values.push(data.updated_by)
    }

    if (fields.length === 0) return null

    fields.push(`updated_date = now()`)
    values.push(id)

    const result = await query(
      `UPDATE project SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    )
    return result.rows[0] || null
  }

  /* Delete project */
  static async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM project WHERE id = $1', [id])
    return (result.rowCount || 0) > 0
  }
}
