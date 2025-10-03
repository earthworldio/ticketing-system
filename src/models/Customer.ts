/* Customer Model - Database operations */

import { query } from '@/lib/db'
import { Customer, CreateCustomerDTO, UpdateCustomerDTO } from '@/types'

export class CustomerModel {
  /* Find customer by ID */
  static async findById(id: string): Promise<Customer | null> {
    const result = await query(
      'SELECT * FROM customer WHERE id = $1',
      [id]
    )
    return result.rows[0] || null
  }

  /* Find customer by code */
  static async findByCode(code: string): Promise<Customer | null> {
    const result = await query(
      'SELECT * FROM customer WHERE code = $1',
      [code]
    )
    return result.rows[0] || null
  }

  /* Find all customers */
  static async findAll(): Promise<Customer[]> {
    const result = await query('SELECT * FROM customer ORDER BY name ASC')
    return result.rows
  }

  /* Create a new customer */
  static async create(data: CreateCustomerDTO): Promise<Customer> {
    const result = await query(
      `INSERT INTO customer (name, code)
       VALUES ($1, $2)
       RETURNING *`,
      [data.name, data.code]
    )
    return result.rows[0]
  }

  /* Update customer */
  static async update(id: string, data: UpdateCustomerDTO): Promise<Customer | null> {
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

    if (fields.length === 0) return null

    values.push(id)

    const result = await query(
      `UPDATE customer SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    )
    return result.rows[0] || null
  }

  /* Delete customer */
  static async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM customer WHERE id = $1', [id])
    return (result.rowCount || 0) > 0
  }
}

