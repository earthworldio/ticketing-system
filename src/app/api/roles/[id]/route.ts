/* Role API Routes (Single Role) */

import { NextRequest, NextResponse } from 'next/server'
import { RoleController } from '@/controllers/roleController'
import { CreateRoleDTO } from '@/types'

/* GET /api/roles/[id] - Get role by ID */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const result = await RoleController.getRoleById(id)

    if (!result.success) {
      return NextResponse.json(result, { status: 404 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch role',
        error: error.message
      },
      { status: 500 }
    )
  }
}

/* PUT /api/roles/[id] - Update role */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body: CreateRoleDTO = await request.json()

    const result = await RoleController.updateRole(id, body)

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update role',
        error: error.message
      },
      { status: 500 }
    )
  }
}

/* DELETE /api/roles/[id] - Delete role */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const result = await RoleController.deleteRole(id)

    if (!result.success) {
      return NextResponse.json(result, { status: 404 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete role',
        error: error.message
      },
      { status: 500 }
    )
  }
}

