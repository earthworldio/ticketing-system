/* Project API Routes */

import { NextRequest, NextResponse } from 'next/server'
import { ProjectController } from '@/controllers/projectController'
import { CreateProjectDTO } from '@/types'

/* POST /api/projects - Create project */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    let created_by: string | undefined = undefined
    if (token) {
      const { verifyToken } = await import('@/utils/jwt')
      const decoded = verifyToken(token)
      
      if (decoded && decoded.userId) {
        created_by = decoded.userId
      }
    }

    const body: CreateProjectDTO = await request.json()
    
    const projectData: CreateProjectDTO = {
      ...body,
      created_by
    }

    const result = await ProjectController.createProject(projectData)

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error: any) {
    console.error('API Create Project Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    )
  }
}

/* GET /api/projects - Get all projects */
export async function GET(request: NextRequest) {
  try {
    const result = await ProjectController.getAllProjects()

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    console.error('API Get All Projects Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    )
  }
}

