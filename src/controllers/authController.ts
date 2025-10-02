/* Auth Controller */

import { AuthService } from '@/services/authService'
import { LoginDTO, LoginResponse } from '@/types'

export class AuthController {
  /* Handle login request */
  static async login(data: LoginDTO): Promise<LoginResponse> {
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(data.email)) {
        return {
          success: false,
          message: 'Invalid email format',
          error: 'Invalid email'
        }
      }

      if (data.password.length < 6) {
        return {
          success: false,
          message: 'Password must be at least 6 characters',
          error: 'Password too short'
        }
      }

      const result = await AuthService.login(data)

      if (!result.success) {
        return {
          success: false,
          message: result.message,
          error: result.error
        }
      }

      return {
        success: true,
        message: 'Login successful',
        data: {
          token: result.token!,
          user: result.user!
        }
      }
    } catch (error: any) {
      console.error('Auth controller error:', error)
      return {
        success: false,
        message: 'Login failed',
        error: error.message
      }
    }
  }
}

