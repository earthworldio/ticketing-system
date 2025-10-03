/* RolePermission Controller */

import { RolePermissionService } from '@/services/rolePermissionService'
import { AssignPermissionDTO, AssignPermissionsDTO, ApiResponse } from '@/types'

export class RolePermissionController {
  /* Assign multiple permissions to role */
  static async assignPermissions(data: AssignPermissionsDTO): Promise<ApiResponse> {
    try {
      if (!data.role_id || !data.permission_ids || data.permission_ids.length === 0) {
        return {
          success: false,
          message: 'Role and at least one Permission are required',
          error: 'Missing required fields'
        }
      }

      const result = await RolePermissionService.assignPermissions(data)

      const message = result.success > 0 
        ? `Successfully assigned ${result.success} permission(s)${result.failed > 0 ? `. ${result.failed} failed.` : ''}`
        : 'Failed to assign permissions'

      return {
        success: result.success > 0,
        message,
        data: result
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to assign permissions',
        error: error.message
      }
    }
  }

  /* Assign single permission to role */
  static async assignPermission(data: AssignPermissionDTO): Promise<ApiResponse> {
    try {
      if (!data.role_id || !data.permission_id) {
        return {
          success: false,
          message: 'Role and Permission are required',
          error: 'Missing required fields'
        }
      }

      const assignment = await RolePermissionService.assignPermission(data)

      return {
        success: true,
        message: 'Permission assigned successfully',
        data: assignment
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to assign permission',
        error: error.message
      }
    }
  }

  /* Get all assignments */
  static async getAllAssignments(): Promise<ApiResponse> {
    try {
      const assignments = await RolePermissionService.getAllAssignments()

      return {
        success: true,
        data: assignments
      }
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to fetch assignments',
        error: error.message
      }
    }
  }

  /* Toggle active status */
  static async toggleActive(id: string, is_active: boolean): Promise<ApiResponse> {
    try {
      const assignment = await RolePermissionService.toggleActive(id, is_active)

      return {
        success: true,
        message: 'Status updated successfully',
        data: assignment
      }
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to update status',
        error: error.message
      }
    }
  }

  /* Update assignment */
  static async updateAssignment(id: string, data: AssignPermissionDTO): Promise<ApiResponse> {
    try {
      if (!data.role_id || !data.permission_id) {
        return {
          success: false,
          message: 'Role and Permission are required',
          error: 'Missing required fields'
        }
      }

      const assignment = await RolePermissionService.updateAssignment(id, data)

      return {
        success: true,
        message: 'Assignment updated successfully',
        data: assignment
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to update assignment',
        error: error.message
      }
    }
  }

  /* Delete assignment */
  static async deleteAssignment(id: string): Promise<ApiResponse> {
    try {
      const deleted = await RolePermissionService.deleteAssignment(id)

      if (!deleted) {
        return {
          success: false,
          message: 'Assignment not found',
          error: 'Assignment not found'
        }
      }

      return {
        success: true,
        message: 'Assignment deleted successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to delete assignment',
        error: error.message
      }
    }
  }
}

