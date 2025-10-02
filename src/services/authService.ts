/* Auth Service */

import { UserService } from './userService'
import { generateToken } from '@/utils/jwt'
import { LoginDTO, AuthResponse } from '@/types'

export class AuthService {
  /* Login with email and password */
  static async login(data: LoginDTO): Promise<AuthResponse> {
    try {
      if (!data.email || !data.password) {
        return {
          success: false,
          message: 'Email and password are required',
          error: 'Missing credentials'
        }
      }

      const user = await UserService.getUserByEmail(data.email)
      
      if (!user) {
        return {
          success: false,
          message: 'Invalid email or password',
          error: 'User not found'
        }
      }

      if (!user.activate) {
        return {
          success: false,
          message: 'Account is deactivated',
          error: 'Account inactive'
        }
      }

      const isPasswordValid = await UserService.verifyPassword(
        data.password,
        user.password
      )

      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Invalid email or password',
          error: 'Invalid password'
        }
      }

      const token = generateToken({
        userId: user.id,
        email: user.email,
        roleId: user.role_id || undefined
      })

      return {
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role_id: user.role_id || undefined
        }
      }
    } catch (error: any) {
      console.error('Login error:', error)
      return {
        success: false,
        message: 'Login failed',
        error: error.message
      }
    }
  }
}

