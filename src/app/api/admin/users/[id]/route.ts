/**
 * Admin User API Routes (Single User)
 * GET /api/admin/users/[id] - Get user by ID
 * PUT /api/admin/users/[id] - Update user
 * DELETE /api/admin/users/[id] - Delete user
 */

import { NextRequest, NextResponse } from 'next/server';
import { AdminUserController } from '@/controllers/admin/userController';
import { UpdateUserDTO } from '@/types';

/**
 * GET /api/admin/users/[id]
 * Get user by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await AdminUserController.getUserById(id);

    if (!result.success) {
      return NextResponse.json(result, { status: 404 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้งาน',
        error: error.message
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/users/[id]
 * Update user
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: UpdateUserDTO = await request.json();

    const result = await AdminUserController.updateUser(id, body);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'เกิดข้อผิดพลาดในการอัพเดทผู้ใช้งาน',
        error: error.message
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/users/[id]
 * Delete user
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await AdminUserController.deleteUser(id);

    if (!result.success) {
      return NextResponse.json(result, { status: 404 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'เกิดข้อผิดพลาดในการลบผู้ใช้งาน',
        error: error.message
      },
      { status: 500 }
    );
  }
}

