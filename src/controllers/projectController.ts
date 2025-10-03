/* Project Controller */

import { ProjectService } from '@/services/projectService'
import { CreateProjectDTO, UpdateProjectDTO, ApiResponse } from '@/types'

export class ProjectController {
  /* Create a new project */
  static async createProject(data: CreateProjectDTO): Promise<ApiResponse> {
    try {
      const project = await ProjectService.createProject(data)
      return {
        success: true,
        message: 'Project created successfully',
        data: project
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Error creating project',
        error: error.message
      }
    }
  }

  /* Get project by ID */
  static async getProjectById(id: string): Promise<ApiResponse> {
    try {
      const project = await ProjectService.getProjectById(id)
      if (!project) {
        return {
          success: false,
          message: 'Project not found',
          error: 'Project not found'
        }
      }
      return {
        success: true,
        message: 'Project fetched successfully',
        data: project
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Error fetching project',
        error: error.message
      }
    }
  }

  /* Get all projects */
  static async getAllProjects(): Promise<ApiResponse> {
    try {
      const projects = await ProjectService.getAllProjects()
      return {
        success: true,
        message: 'Projects fetched successfully',
        data: projects
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Error fetching projects',
        error: error.message
      }
    }
  }

  /* Update project */
  static async updateProject(id: string, data: UpdateProjectDTO): Promise<ApiResponse> {
    try {
      const updatedProject = await ProjectService.updateProject(id, data)
      if (!updatedProject) {
        return {
          success: false,
          message: 'Project not found or could not be updated',
          error: 'Update failed'
        }
      }
      return {
        success: true,
        message: 'Project updated successfully',
        data: updatedProject
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Error updating project',
        error: error.message
      }
    }
  }

  /* Delete project */
  static async deleteProject(id: string): Promise<ApiResponse> {
    try {
      const deleted = await ProjectService.deleteProject(id)
      if (!deleted) {
        return {
          success: false,
          message: 'Project not found',
          error: 'Project not found'
        }
      }
      return {
        success: true,
        message: 'Project deleted successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Error deleting project',
        error: error.message
      }
    }
  }
}

