/* ProjectSLA Controller - Handle project-SLA assignment requests */

import { ProjectSLAService } from '@/services/projectSlaService'
import { CreateProjectSLADTO } from '@/types'
import { ApiResponse } from '@/types'

export class ProjectSLAController {
  /* Get all SLAs for a project */
  static async getSLAsByProjectId(project_id: string): Promise<ApiResponse> {
    try {
      const data = await ProjectSLAService.getSLAsByProjectId(project_id)
      return { success: true, data }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to fetch project SLAs',
      }
    }
  }

  /* Assign SLA to project */
  static async assignSLA(requestData: CreateProjectSLADTO): Promise<ApiResponse> {
    try {
      const data = await ProjectSLAService.assignSLAToProject(requestData)
      return { success: true, data, message: 'SLA assigned successfully' }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to assign SLA',
      }
    }
  }

  /* Assign multiple SLAs to project */
  static async assignMultipleSLAs(project_id: string, sla_ids: string[]): Promise<ApiResponse> {
    try {
      const data = await ProjectSLAService.assignMultipleSLAs(project_id, sla_ids)
      return { success: true, data, message: 'SLAs assigned successfully' }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to assign SLAs',
      }
    }
  }

  /* Remove SLA from project */
  static async removeSLA(id: string): Promise<ApiResponse> {
    try {
      await ProjectSLAService.removeSLAFromProject(id)
      return { success: true, message: 'SLA removed successfully' }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to remove SLA',
      }
    }
  }
}

