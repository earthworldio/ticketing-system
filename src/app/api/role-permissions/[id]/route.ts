/* Role-Permission API Routes (Single Assignment) */

import { NextRequest, NextResponse } from 'next/server'
import { RolePermissionController } from '@/controllers/rolePermissionController'

/* DELETE /api/role-permissions/[id] - Delete assignment */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const result = await RolePermissionController.deleteAssignment(id)

    if (!result.success) {
      return NextResponse.json(result, { status: 404 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete assignment',
        error: error.message
      },
      { status: 500 }
    )
  }
}

/* PATCH /api/role-permissions/[id] - Toggle active status */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { is_active } = body

    const result = await RolePermissionController.toggleActive(id, is_active)

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update status',
        error: error.message
      },
      { status: 500 }
    )
  }
}

