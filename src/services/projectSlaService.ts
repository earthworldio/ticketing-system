/* ProjectSLA Service - Business logic for project-SLA assignments */

import { ProjectSLAModel } from '@/models/ProjectSLA'
import { CreateProjectSLADTO } from '@/types'

export class ProjectSLAService {
  /* Get all SLAs for a project */
  static async getSLAsByProjectId(project_id: string) {
    return await ProjectSLAModel.findByProjectId(project_id)
  }

  /* Assign SLA to project */
  static async assignSLAToProject(data: CreateProjectSLADTO) {
    /* Check if assignment already exists */
    const exists = await ProjectSLAModel.exists(data.project_id, data.sla_id)
    if (exists) {
      throw new Error('This SLA is already assigned to the project')
    }

    return await ProjectSLAModel.create(data)
  }

  /* Assign multiple SLAs to project */
  static async assignMultipleSLAs(project_id: string, sla_ids: string[]) {
    const assignments = []
    
    for (const sla_id of sla_ids) {
      const exists = await ProjectSLAModel.exists(project_id, sla_id)
      if (!exists) {
        const assignment = await ProjectSLAModel.create({ project_id, sla_id })
        assignments.push(assignment)
      }
    }

    return assignments
  }

  /* Remove SLA from project */
  static async removeSLAFromProject(id: string) {
    const deleted = await ProjectSLAModel.delete(id)
    if (!deleted) {
      throw new Error('Assignment not found')
    }
    return { success: true }
  }

  /* Remove all SLAs from project */
  static async removeAllSLAsFromProject(project_id: string) {
    await ProjectSLAModel.deleteByProjectId(project_id)
    return { success: true }
  }
}

