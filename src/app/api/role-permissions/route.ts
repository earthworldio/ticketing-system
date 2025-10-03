/* Role-Permission API Routes */

import { NextRequest, NextResponse } from 'next/server'
import { RolePermissionController } from '@/controllers/rolePermissionController'
import { AssignPermissionsDTO } from '@/types'

/* POST /api/role-permissions - Assign permissions to role */
export async function POST(request: NextRequest) {
  try {
    const body: AssignPermissionsDTO = await request.json()

    const result = await RolePermissionController.assignPermissions(body)

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to assign permission',
        error: error.message
      },
      { status: 500 }
    )
  }
}

/* GET /api/role-permissions - Get all assignments */
export async function GET() {
  try {
    const result = await RolePermissionController.getAllAssignments()

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch assignments',
        error: error.message
      },
      { status: 500 }
    )
  }
}

