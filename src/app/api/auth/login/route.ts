/* Login API Route */

import { NextRequest, NextResponse } from 'next/server'
import { AuthController } from '@/controllers/authController'
import { LoginDTO } from '@/types'

/* POST /api/auth/login */
export async function POST(request: NextRequest) {
  try {
    const body: LoginDTO = await request.json()

    const result = await AuthController.login(body)

    if (!result.success) {
      return NextResponse.json(result, { status: 401 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Login failed',
        error: error.message
      },
      { status: 500 }
    )
  }
}

