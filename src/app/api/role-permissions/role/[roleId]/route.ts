/* Role permissions by roleId API */

import { NextRequest, NextResponse } from 'next/server'
import { RolePermissionService } from '@/services/rolePermissionService'


export async function GET(
  _request: NextRequest,
  { params }: { params: { roleId: string } }
) {
  try {
    const { roleId } = params

    if (!roleId) {
      return NextResponse.json(
        { success: false, message: 'roleId is required' },
        { status: 400 }
      )
    }

    const data = await RolePermissionService.getPermissionsByRole(roleId)

    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch role permissions',
        error: error?.message || 'Unknown error',
      },
      { status: 500 }
    )
  }
}
