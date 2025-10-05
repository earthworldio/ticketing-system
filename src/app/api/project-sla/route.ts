/* Project-SLA API Routes */

import { NextRequest, NextResponse } from 'next/server'
import { ProjectSLAController } from '@/controllers/projectSlaController'

/* POST /api/project-sla - Assign multiple SLAs to project */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { project_id, sla_ids } = body

    if (!project_id || !sla_ids || !Array.isArray(sla_ids)) {
      return NextResponse.json(
        { success: false, message: 'project_id and sla_ids (array) are required' },
        { status: 400 }
      )
    }

    const result = await ProjectSLAController.assignMultipleSLAs(project_id, sla_ids)

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error: any) {
    console.error('API Assign Project-SLA Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    )
  }
}

/* GET /api/project-sla?project_id=xxx - Get SLAs for a project */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const project_id = searchParams.get('project_id')

    if (!project_id) {
      return NextResponse.json(
        { success: false, message: 'project_id is required' },
        { status: 400 }
      )
    }

    const result = await ProjectSLAController.getSLAsByProjectId(project_id)

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    console.error('API Get Project-SLAs Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    )
  }
}

/* DELETE /api/project-sla?project_id=xxx - Delete all SLAs for a project */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const project_id = searchParams.get('project_id')

    if (!project_id) {
      return NextResponse.json(
        { success: false, message: 'project_id is required' },
        { status: 400 }
      )
    }

    const result = await ProjectSLAController.removeAllSLAs(project_id)

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    console.error('API Delete Project-SLAs Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    )
  }
}

