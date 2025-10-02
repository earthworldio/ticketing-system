import { NextRequest, NextResponse } from 'next/server';
import { AdminUserController } from '@/controllers/admin/userController';
import { CreateUserDTO } from '@/types';


export async function POST(request: NextRequest) {
  try {
    
    const body: CreateUserDTO = await request.json();

    const result = await AdminUserController.createUser(body);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'เกิดข้อผิดพลาดในการสร้างผู้ใช้งาน',
        error: error.message
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await AdminUserController.getAllUsers();

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
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

