/* Permission API Routes (Single Permission) */

import { NextRequest, NextResponse } from 'next/server'
import { PermissionController } from '@/controllers/permissionController'
import { CreatePermissionDTO } from '@/types'

/* GET /api/permissions/[id] - Get permission by ID */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const result = await PermissionController.getPermissionById(id)

    if (!result.success) {
      return NextResponse.json(result, { status: 404 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch permission',
        error: error.message
      },
      { status: 500 }
    )
  }
}

/* PUT /api/permissions/[id] - Update permission */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body: CreatePermissionDTO = await request.json()

    const result = await PermissionController.updatePermission(id, body)

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update permission',
        error: error.message
      },
      { status: 500 }
    )
  }
}

/* DELETE /api/permissions/[id] - Delete permission */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const result = await PermissionController.deletePermission(id)

    if (!result.success) {
      return NextResponse.json(result, { status: 404 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete permission',
        error: error.message
      },
      { status: 500 }
    )
  }
}

