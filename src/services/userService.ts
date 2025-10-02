/**
 * User Service
 * Business logic for user operations
 */

import bcrypt from 'bcryptjs';
import { UserModel } from '@/models/User';
import { RoleModel } from '@/models/Role';
import { CreateUserDTO, UpdateUserDTO, User, UserResponse } from '@/types';

export class UserService {
  /**
   * Create a new user (Admin only)
   * เมื่อสร้างจะต้องระบุ role, email, password
   * ส่วนที่เหลือให้ user ไปทำเอง
   */
  static async createUser(data: CreateUserDTO): Promise<UserResponse> {
    // 1. ตรวจสอบว่า email ซ้ำหรือไม่
    const existingUser = await UserModel.findByEmail(data.email);
    if (existingUser) {
      throw new Error('อีเมลนี้มีในระบบแล้ว');
    }

    // 2. ตรวจสอบว่า role มีอยู่จริงหรือไม่
    const role = await RoleModel.findById(data.role_id);
    if (!role) {
      throw new Error('ไม่พบ Role ที่ระบุ');
    }

    // 3. เข้ารหัส password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 4. สร้าง user
    const newUser = await UserModel.create({
      role_id: data.role_id,
      email: data.email,
      password: hashedPassword,
      title_name: data.title_name,
      first_name: data.first_name || 'ไม่ระบุ',
      last_name: data.last_name || 'ไม่ระบุ',
      phone: data.phone,
    });

    // 5. ลบ password ออกจาก response
    return this.sanitizeUser(newUser);
  }

  /**
   * Get user by ID
   */
  static async getUserById(id: string): Promise<UserResponse | null> {
    const user = await UserModel.findById(id);
    if (!user) {
      return null;
    }
    return this.sanitizeUser(user);
  }

  /**
   * Get user by email
   */
  static async getUserByEmail(email: string): Promise<User | null> {
    return await UserModel.findByEmail(email);
  }

  /**
   * Get all users
   */
  static async getAllUsers(): Promise<UserResponse[]> {
    const users = await UserModel.findAll();
    return users.map(user => this.sanitizeUser(user));
  }

  /**
   * Update user
   */
  static async updateUser(id: string, data: UpdateUserDTO): Promise<UserResponse | null> {
    // ถ้ามีการอัพเดท password ให้เข้ารหัสก่อน
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    // ถ้ามีการอัพเดท email ให้ตรวจสอบว่าซ้ำหรือไม่
    if (data.email) {
      const existingUser = await UserModel.findByEmail(data.email);
      if (existingUser && existingUser.id !== id) {
        throw new Error('อีเมลนี้ถูกใช้แล้ว');
      }
    }

    // ถ้ามีการอัพเดท role ให้ตรวจสอบว่ามี role นั้นหรือไม่
    if (data.role_id) {
      const role = await RoleModel.findById(data.role_id);
      if (!role) {
        throw new Error('ไม่พบ Role ที่ระบุ');
      }
    }

    const updatedUser = await UserModel.update(id, data);
    if (!updatedUser) {
      return null;
    }
    return this.sanitizeUser(updatedUser);
  }

  /**
   * Delete user
   */
  static async deleteUser(id: string): Promise<boolean> {
    return await UserModel.delete(id);
  }

  /**
   * Verify password
   */
  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Remove password from user object
   */
  private static sanitizeUser(user: User): UserResponse {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

