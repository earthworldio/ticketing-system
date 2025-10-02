/* Role Model */

import { query } from '@/lib/db';
import { Role, CreateRoleDTO, UpdateRoleDTO } from '@/types';

export class RoleModel {
  /*  Find role by ID*/
  static async findById(id: string): Promise<Role | null> {
    const result = await query(
      'SELECT * FROM role WHERE id = $1',
      [id]
    );
    
    return result.rows[0] || null;
  }

  /* Find role by name */
  static async findByName(name: string): Promise<Role | null> {
    const result = await query(
      'SELECT * FROM role WHERE name = $1',
      [name]
    );
    
    return result.rows[0] || null;
  }

  /* Find all roles */
  static async findAll(): Promise<Role[]> {
    const result = await query('SELECT * FROM role ORDER BY name');
    return result.rows;
  }

  /* Create a new role */
  static async create(data: CreateRoleDTO): Promise<Role> {
    const result = await query(
      `INSERT INTO role (name, description) 
       VALUES ($1, $2) 
       RETURNING *`,
      [data.name, data.description || null]
    );
    
    return result.rows[0];
  }

  /* Update role */
  static async update(id: string, data: UpdateRoleDTO): Promise<Role | null> {
    
    const fields: string[] = [];
    const values: any[] = [];
    
    let paramCount = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${paramCount++}`);
      values.push(data.name);
    }

    if (data.description !== undefined) {
      fields.push(`description = $${paramCount++}`);
      values.push(data.description);
    }

    fields.push(`updated_date = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await query(
      `UPDATE role SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  /* Delete role */
  static async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM role WHERE id = $1', [id]);
    return (result.rowCount || 0) > 0;
  }
}

