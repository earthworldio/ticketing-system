/* RolePermission Model - Database operations */

import { query } from '@/lib/db'
import { RolePermission, AssignPermissionDTO } from '@/types'

export class RolePermissionModel {
  /* Find all role-permission assignments */
  static async findAll(): Promise<any[]> {
    const result = await query(`
      SELECT 
        rp.id,
        rp.role_id,
        rp.permission_id,
        rp.is_active,
        rp.created_date,
        rp.updated_date,
        r.name as role_name,
        p.name as permission_name
      FROM role_permission rp
      JOIN role r ON rp.role_id = r.id
      JOIN permission p ON rp.permission_id = p.id
      ORDER BY rp.created_date DESC
    `)
    return result.rows
  }

  /* Find by role and permission */
  static async findByRoleAndPermission(role_id: string, permission_id: string): Promise<RolePermission | null> {
    const result = await query(
      'SELECT * FROM role_permission WHERE role_id = $1 AND permission_id = $2',
      [role_id, permission_id]
    )
    return result.rows[0] || null
  }

  /* Assign permission to role */
  static async assign(data: AssignPermissionDTO): Promise<RolePermission> {
    const result = await query(
      `INSERT INTO role_permission (role_id, permission_id, is_active) 
       VALUES ($1, $2, true) 
       RETURNING *`,
      [data.role_id, data.permission_id]
    )
    return result.rows[0]
  }

  /* Toggle is_active status */
  static async toggleActive(id: string, is_active: boolean): Promise<RolePermission | null> {
    const result = await query(
      `UPDATE role_permission 
       SET is_active = $1, updated_date = now() 
       WHERE id = $2 
       RETURNING *`,
      [is_active, id]
    )
    return result.rows[0] || null
  }

  /* Update assignment */
  static async update(id: string, data: AssignPermissionDTO): Promise<any> {
    const result = await query(
      `UPDATE role_permission 
       SET role_id = $1, permission_id = $2, updated_date = now() 
       WHERE id = $3 
       RETURNING *`,
      [data.role_id, data.permission_id, id]
    )
    return result.rows[0] || null
  }

  /* Delete assignment */
  static async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM role_permission WHERE id = $1', [id])
    return (result.rowCount || 0) > 0
  }

  /* Get permissions by role */
  static async getPermissionsByRole(role_id: string): Promise<any[]> {
    const result = await query(`
      SELECT 
        p.*,
        rp.is_active,
        rp.id as assignment_id
      FROM permission p
      JOIN role_permission rp ON p.id = rp.permission_id
      WHERE rp.role_id = $1
    `, [role_id])
    return result.rows
  }
}

