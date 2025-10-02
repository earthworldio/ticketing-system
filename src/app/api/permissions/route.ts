/* Permissions API Routes */

import { NextRequest, NextResponse } from 'next/server'
import { PermissionController } from '@/controllers/permissionController'
import { CreatePermissionDTO } from '@/types'

/* POST /api/permissions - Create a new permission */
export async function POST(request: NextRequest) {
  try {
    const body: CreatePermissionDTO = await request.json()

    const result = await PermissionController.createPermission(body)

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create permission',
        error: error.message
      },
      { status: 500 }
    )
  }
}

/* GET /api/permissions - Get all permissions */
export async function GET() {
  try {
    const result = await PermissionController.getAllPermissions()

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch permissions',
        error: error.message
      },
      { status: 500 }
    )
  }
}

