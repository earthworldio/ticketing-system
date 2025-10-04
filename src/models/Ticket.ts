/* Ticket Model - Database operations */

import { query } from '@/lib/db'
import { Ticket, CreateTicketDTO, UpdateTicketDTO, TicketWithRelations } from '@/types'

export class TicketModel {
  /* Find ticket by ID with relations */
  static async findById(id: string): Promise<TicketWithRelations | null> {
    const result = await query(
      `SELECT 
        t.*,
        s.name as status_name,
        sla.name as sla_name,
        u_owner.first_name as owner_first_name,
        u_owner.last_name as owner_last_name,
        u_creator.first_name as creator_first_name,
        u_creator.last_name as creator_last_name
       FROM ticket t
       LEFT JOIN status s ON t.status_id = s.id
       LEFT JOIN sla ON t.sla_id = sla.id
       LEFT JOIN "user" u_owner ON t.owner = u_owner.id
       LEFT JOIN "user" u_creator ON t.created_by = u_creator.id
       WHERE t.id = $1`,
      [id]
    )
    return result.rows[0] || null
  }

  /* Find all tickets by project_id */
  static async findByProjectId(project_id: string): Promise<TicketWithRelations[]> {
    const result = await query(
      `SELECT
        t.*,
        s.name as status_name,
        sla.name as sla_name,
        u_owner.first_name as owner_first_name,
        u_owner.last_name as owner_last_name,
        u_creator.first_name as creator_first_name,
        u_creator.last_name as creator_last_name,
        c.code as customer_code,
        CONCAT(
          c.code, 
          '-', 
          LPAD(CAST((EXTRACT(YEAR FROM t.created_date) + 543 - 2500) AS TEXT), 2, '0'),
          LPAD(CAST(EXTRACT(MONTH FROM t.created_date) AS TEXT), 2, '0'),
          LPAD(
            CAST(
              ROW_NUMBER() OVER (
                PARTITION BY c.code, 
                EXTRACT(YEAR FROM t.created_date), 
                EXTRACT(MONTH FROM t.created_date) 
                ORDER BY t.created_date
              ) AS TEXT
            ), 
            4, 
            '0'
          )
        ) as ticket_number
       FROM ticket t
       LEFT JOIN status s ON t.status_id = s.id
       LEFT JOIN sla ON t.sla_id = sla.id
       LEFT JOIN "user" u_owner ON t.owner = u_owner.id
       LEFT JOIN "user" u_creator ON t.created_by = u_creator.id
       LEFT JOIN project proj ON t.project_id = proj.id
       LEFT JOIN customer c ON proj.customer_id = c.id
       WHERE t.project_id = $1
       ORDER BY t.created_date DESC`,
      [project_id]
    )
    return result.rows
  }

  /* Find all tickets */
  static async findAll(): Promise<TicketWithRelations[]> {
    const result = await query(`
      SELECT 
        t.*,
        s.name as status_name,
        sla.name as sla_name,
        u_owner.first_name as owner_first_name,
        u_owner.last_name as owner_last_name,
        u_creator.first_name as creator_first_name,
        u_creator.last_name as creator_last_name,
        c.code as customer_code,
        CONCAT(
          c.code, 
          '-', 
          LPAD(CAST((EXTRACT(YEAR FROM t.created_date) + 543 - 2500) AS TEXT), 2, '0'),
          LPAD(CAST(EXTRACT(MONTH FROM t.created_date) AS TEXT), 2, '0'),
          LPAD(
            CAST(
              ROW_NUMBER() OVER (
                PARTITION BY c.code, 
                EXTRACT(YEAR FROM t.created_date), 
                EXTRACT(MONTH FROM t.created_date) 
                ORDER BY t.created_date
              ) AS TEXT
            ), 
            4, 
            '0'
          )
        ) as ticket_number
      FROM ticket t
      LEFT JOIN status s ON t.status_id = s.id
      LEFT JOIN sla ON t.sla_id = sla.id
      LEFT JOIN "user" u_owner ON t.owner = u_owner.id
      LEFT JOIN "user" u_creator ON t.created_by = u_creator.id
      LEFT JOIN project proj ON t.project_id = proj.id
      LEFT JOIN customer c ON proj.customer_id = c.id
      ORDER BY t.created_date DESC
    `)
    return result.rows
  }

  /* Create a new ticket */
  static async create(data: CreateTicketDTO): Promise<Ticket> {
    const result = await query(
      `INSERT INTO ticket (project_id, status_id, sla_id, owner, name, created_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        data.project_id,
        data.status_id || null,
        data.sla_id || null,
        data.owner || null,
        data.name,
        data.created_by || null
      ]
    )
    return result.rows[0]
  }

  /* Update ticket */
  static async update(id: string, data: UpdateTicketDTO): Promise<Ticket | null> {
    const fields: string[] = []
    const values: any[] = []
    let paramCount = 1

    if (data.status_id !== undefined) {
      fields.push(`status_id = $${paramCount++}`)
      values.push(data.status_id)
    }

    if (data.sla_id !== undefined) {
      fields.push(`sla_id = $${paramCount++}`)
      values.push(data.sla_id)
    }

    if (data.owner !== undefined) {
      fields.push(`owner = $${paramCount++}`)
      values.push(data.owner)
    }

    if (data.name !== undefined) {
      fields.push(`name = $${paramCount++}`)
      values.push(data.name)
    }

    if (data.updated_by !== undefined) {
      fields.push(`updated_by = $${paramCount++}`)
      values.push(data.updated_by)
    }

    if (fields.length === 0) return null

    fields.push(`updated_date = now()`)
    values.push(id)

    const result = await query(
      `UPDATE ticket SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    )
    return result.rows[0] || null
  }

  /* Delete ticket */
  static async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM ticket WHERE id = $1', [id])
    return (result.rowCount || 0) > 0
  }
}

