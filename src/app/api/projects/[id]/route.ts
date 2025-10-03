/* Project API Routes (Single Project) */

import { NextRequest, NextResponse } from 'next/server'
import { ProjectController } from '@/controllers/projectController'
import { UpdateProjectDTO } from '@/types'

/* GET /api/projects/[id] - Get project by ID */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const result = await ProjectController.getProjectById(id)

    if (!result.success) {
      return NextResponse.json(result, { status: 404 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch project',
        error: error.message
      },
      { status: 500 }
    )
  }
}

/* PUT /api/projects/[id] - Update project */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body: UpdateProjectDTO = await request.json()

    const result = await ProjectController.updateProject(id, body)

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update project',
        error: error.message
      },
      { status: 500 }
    )
  }
}

/* DELETE /api/projects/[id] - Delete project */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const result = await ProjectController.deleteProject(id)

    if (!result.success) {
      return NextResponse.json(result, { status: 404 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete project',
        error: error.message
      },
      { status: 500 }
    )
  }
}

