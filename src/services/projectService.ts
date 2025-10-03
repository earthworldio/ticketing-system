/* Project Service - Business logic */

import { ProjectModel } from '@/models/Project'
import { CustomerModel } from '@/models/Customer'
import { query } from '@/lib/db'
import { CreateProjectDTO, UpdateProjectDTO, Project } from '@/types'

export class ProjectService {
  /* Find project by ID */
  static async getProjectById(id: string): Promise<Project | null> {
    return await ProjectModel.findById(id)
  }

  /* Find all projects */
  static async getAllProjects(): Promise<Project[]> {
    return await ProjectModel.findAll()
  }

  /* Create a new project */
  static async createProject(data: CreateProjectDTO): Promise<Project> {
    // Validate required fields
    if (!data.name) {
      throw new Error('Project name is required')
    }

    if (!data.customer_id) {
      throw new Error('Customer is required')
    }

    if (!data.sla_id) {
      throw new Error('SLA is required')
    }

    /* Validate customer exists */
    const customer = await CustomerModel.findById(data.customer_id)
    if (!customer) {
      throw new Error('Customer not found')
    }

    /* Validate SLA exists */
    const slaResult = await query('SELECT * FROM sla WHERE id = $1', [data.sla_id])
    if (slaResult.rows.length === 0) {
      throw new Error('SLA not found')
    }

    /* Validate dates if provided */
    if (data.start_date && data.end_date) {
      const startDate = new Date(data.start_date)
      const endDate = new Date(data.end_date)
      
      if (endDate < startDate) {
        throw new Error('End date must be after start date')
      }
    }

    return await ProjectModel.create(data)
  }

  /* Update project */
  static async updateProject(id: string, data: UpdateProjectDTO): Promise<Project | null> {
    const project = await ProjectModel.findById(id)
    if (!project) {
      throw new Error('Project not found')
    }

    /* Validate customer if updating */
    if (data.customer_id) {
      const customer = await CustomerModel.findById(data.customer_id)
      if (!customer) {
        throw new Error('Customer not found')
      }
    }

    /* Validate SLA if updating */
    if (data.sla_id) {
      const slaResult = await query('SELECT * FROM sla WHERE id = $1', [data.sla_id])
      if (slaResult.rows.length === 0) {
        throw new Error('SLA not found')
      }
    }

    /* Validate dates if provided */
    if (data.start_date && data.end_date) {
      const startDate = new Date(data.start_date)
      const endDate = new Date(data.end_date)
      
      if (endDate < startDate) {
        throw new Error('End date must be after start date')
      }
    }

    return await ProjectModel.update(id, data)
  }

  /* Delete project */
  static async deleteProject(id: string): Promise<boolean> {
    const deleted = await ProjectModel.delete(id)
    if (!deleted) {
      throw new Error('Project not found or could not be deleted')
    }
    return deleted
  }
}
