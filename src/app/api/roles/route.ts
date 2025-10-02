/* Roles API Routes */

import { NextRequest, NextResponse } from 'next/server'
import { RoleController } from '@/controllers/roleController'
import { CreateRoleDTO } from '@/types'

/* POST /api/roles - Create a new role */
export async function POST(request: NextRequest) {
  try {
    const body: CreateRoleDTO = await request.json()

    const result = await RoleController.createRole(body)

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create role',
        error: error.message
      },
      { status: 500 }
    )
  }
}

/* GET /api/roles - Get all roles */
export async function GET() {
  try {
    const result = await RoleController.getAllRoles()

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch roles',
        error: error.message
      },
      { status: 500 }
    )
  }
}

