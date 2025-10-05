/* User API Routes - Get user by ID (public endpoint for displaying creator info) */

import { NextRequest, NextResponse } from 'next/server'
import { UserModel } from '@/models/User'

/* GET /api/users/[id] - Get user by ID */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await UserModel.findById(id)

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }


    const { password, ...safeUser } = user

    return NextResponse.json(
      {
        success: true,
        message: 'User fetched successfully',
        data: safeUser
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('API Get User By ID Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    )
  }
}

