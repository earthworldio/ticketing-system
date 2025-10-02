import { UserService } from '@/services/userService';
import { CreateUserDTO, UpdateUserDTO, ApiResponse } from '@/types';

export class AdminUserController {
  /* Create a new user */
  static async createUser(data: CreateUserDTO): Promise<ApiResponse> {
    try {
      
      if (!data.email || !data.password || !data.role_id) {
        return {
          success: false,
          message: 'Missing required fields',
          error: 'Missing required fields'
        }
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        return {
          success: false,
          message: 'Invalid email format',
          error: 'Invalid email format'
        }
      }

      if (data.password.length < 6) {
        return {
          success: false,
          message: '​Password too short',
          error: '​Password too short'
        }
      }

      const user = await UserService.createUser(data);

      return {
        success: true,
        message: 'User created successfully',
        data: user
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Error creating user',
        error: error.message
      };
    }
  }

  /* Get user by ID*/
  static async getUserById(id: string): Promise<ApiResponse> {
    try {
      const user = await UserService.getUserById(id);

      if (!user) {
        return {
          success: false,
          message: 'User not found',
          error: 'User not found'
        };
      }

      return {
        success: true,
        data: user
      }
    } catch (error: any) {
      return {
        success: false,
        message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้งาน',
        error: error.message
      };
    }
  }

  /*Get all users*/
  static async getAllUsers(): Promise<ApiResponse> {
    try {
      const users = await UserService.getAllUsers();

      return {
        success: true,
        data: users
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้งาน',
        error: error.message
      };
    }
  }

  /*Update user*/
  static async updateUser(id: string, data: UpdateUserDTO): Promise<ApiResponse> {
    try {
      if (data.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
          return {
            success: false,
            message: 'รูปแบบอีเมลไม่ถูกต้อง',
            error: 'Invalid email format'
          };
        }
      }

      // Validate password length if provided
      if (data.password && data.password.length < 6) {
        return {
          success: false,
          message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร',
          error: 'Password too short'
        };
      }

      const user = await UserService.updateUser(id, data);

      if (!user) {
        return {
          success: false,
          message: 'ไม่พบผู้ใช้งาน',
          error: 'User not found'
        };
      }

      return {
        success: true,
        message: 'อัพเดทผู้ใช้งานสำเร็จ',
        data: user
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'เกิดข้อผิดพลาดในการอัพเดทผู้ใช้งาน',
        error: error.message
      };
    }
  }

  /*Delete user*/
  static async deleteUser(id: string): Promise<ApiResponse> {
    try {
      const deleted = await UserService.deleteUser(id);

      if (!deleted) {
        return {
          success: false,
          message: 'ไม่พบผู้ใช้งาน',
          error: 'User not found'
        };
      }

      return {
        success: true,
        message: 'ลบผู้ใช้งานสำเร็จ'
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'เกิดข้อผิดพลาดในการลบผู้ใช้งาน',
        error: error.message
      };
    }
  }
}

