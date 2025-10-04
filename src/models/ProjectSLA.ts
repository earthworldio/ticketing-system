/* ProjectSLA Model - Database operations for junction table */

import { query } from '@/lib/db'
import { ProjectSLA, CreateProjectSLADTO, ProjectSLAWithDetails } from '@/types'

export class ProjectSLAModel {
  /* Find all SLAs for a project */
  static async findByProjectId(project_id: string): Promise<ProjectSLAWithDetails[]> {
    const result = await query(
      `SELECT 
        ps.id,
        ps.project_id,
        ps.sla_id,
        ps.created_date,
        ps.updated_date,
        s.name as sla_name,
        s.resolve_time as sla_resolve_time
       FROM project_sla ps
       LEFT JOIN sla s ON ps.sla_id = s.id
       WHERE ps.project_id = $1
       ORDER BY ps.created_date ASC`,
      [project_id]
    )
    return result.rows
  }

  /* Find all projects for an SLA */
  static async findBySLAId(sla_id: string): Promise<ProjectSLA[]> {
    const result = await query(
      'SELECT * FROM project_sla WHERE sla_id = $1 ORDER BY created_date DESC',
      [sla_id]
    )
    return result.rows
  }

  /* Create project-SLA assignment */
  static async create(data: CreateProjectSLADTO): Promise<ProjectSLA> {
    const result = await query(
      `INSERT INTO project_sla (project_id, sla_id)
       VALUES ($1, $2)
       RETURNING *`,
      [data.project_id, data.sla_id]
    )
    return result.rows[0]
  }

  /* Delete project-SLA assignment */
  static async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM project_sla WHERE id = $1', [id])
    return (result.rowCount || 0) > 0
  }

  /* Delete all SLAs for a project */
  static async deleteByProjectId(project_id: string): Promise<boolean> {
    const result = await query('DELETE FROM project_sla WHERE project_id = $1', [project_id])
    return (result.rowCount || 0) > 0
  }

  /* Check if assignment exists */
  static async exists(project_id: string, sla_id: string): Promise<boolean> {
    const result = await query(
      'SELECT id FROM project_sla WHERE project_id = $1 AND sla_id = $2',
      [project_id, sla_id]
    )
    return result.rows.length > 0
  }
}

