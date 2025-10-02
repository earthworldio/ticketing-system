import { query } from '@/lib/db';
import { User, CreateUserDTO, UpdateUserDTO } from '@/types';

export class UserModel {
  /* Find user by ID */
  static async findById(id: string): Promise<User | null> {
    const result = await query(
      'SELECT * FROM "user" WHERE id = $1',
      [id]
    );
    
    return result.rows[0] || null;
  }

  /* Find user by email */
  static async findByEmail(email: string): Promise<User | null> {
    const result = await query(
      'SELECT * FROM "user" WHERE email = $1',
      [email]
    );
    
    return result.rows[0] || null;
  }

  /* Find all users */
  static async findAll(): Promise<User[]> {
    const result = await query(
      'SELECT * FROM "user" ORDER BY created_date DESC'
    );
    return result.rows;
  }

  /* Find users by role */
  static async findByRole(roleId: string): Promise<User[]> {
    const result = await query(
      'SELECT * FROM "user" WHERE role_id = $1 ORDER BY created_date DESC',
      [roleId]
    );
    return result.rows;
  }

  /* Create a new user */
  static async create(data: CreateUserDTO): Promise<User> {
    const result = await query(
      `INSERT INTO "user" (
        role_id, email, password, title_name, first_name, last_name, phone
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *`,
      [
        data.role_id,
        data.email,
        data.password,
        data.title_name || null,
        data.first_name || 'ไม่ระบุ',
        data.last_name || 'ไม่ระบุ',
        data.phone || null
      ]
    );
    
    return result.rows[0];
  }

  /* Update user */
  static async update(id: string, data: UpdateUserDTO): Promise<User | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.role_id !== undefined) {
      fields.push(`role_id = $${paramCount++}`);
      values.push(data.role_id);
    }

    if (data.title_name !== undefined) {
      fields.push(`title_name = $${paramCount++}`);
      values.push(data.title_name);
    }

    if (data.first_name !== undefined) {
      fields.push(`first_name = $${paramCount++}`);
      values.push(data.first_name);
    }

    if (data.last_name !== undefined) {
      fields.push(`last_name = $${paramCount++}`);
      values.push(data.last_name);
    }

    if (data.image_url !== undefined) {
      fields.push(`image_url = $${paramCount++}`);
      values.push(data.image_url);
    }

    if (data.email !== undefined) {
      fields.push(`email = $${paramCount++}`);
      values.push(data.email);
    }

    if (data.password !== undefined) {
      fields.push(`password = $${paramCount++}`);
      values.push(data.password);
    }

    if (data.phone !== undefined) {
      fields.push(`phone = $${paramCount++}`);
      values.push(data.phone);
    }

    if (data.activate !== undefined) {
      fields.push(`activate = $${paramCount++}`);
      values.push(data.activate);
    }

    if (fields.length === 0) {
      return null;
    }

    fields.push(`updated_date = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await query(
      `UPDATE "user" SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  /* Delete user */
  static async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM "user" WHERE id = $1', [id]);
    return (result.rowCount || 0) > 0;
  }

  /* Count users */
  static async count(): Promise<number> {
    const result = await query('SELECT COUNT(*) as count FROM "user"');
    return parseInt(result.rows[0].count);
  }
}

