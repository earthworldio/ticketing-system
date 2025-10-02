/* Authentication Types */

export interface LoginDTO {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  message?: string
  data?: {
    token: string
    user: {
      id: string
      email: string
      first_name: string
      last_name: string
      role_id?: string
    }
  }
  error?: string
}

export interface JWTPayload {
  userId: string
  email: string
  roleId?: string
}

export interface AuthResponse {
  success: boolean
  message?: string
  token?: string
  user?: {
    id: string
    email: string
    first_name: string
    last_name: string
    role_id?: string
  }
  error?: string
}

