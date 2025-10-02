/* Permission Controller */

import { PermissionService } from '@/services/permissionService'
import { CreatePermissionDTO, ApiResponse } from '@/types'

export class PermissionController {
  /* Create a new permission */
  static async createPermission(data: CreatePermissionDTO): Promise<ApiResponse> {
    try {
      if (!data.name || data.name.trim() === '') {
        return {
          success: false,
          message: 'Permission name is required',
          error: 'Missing required field'
        }
      }

      const permission = await PermissionService.createPermission(data)

      return {
        success: true,
        message: 'Permission created successfully',
        data: permission
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to create permission',
        error: error.message
      }
    }
  }

  /* Get all permissions */
  static async getAllPermissions(): Promise<ApiResponse> {
    try {
      const permissions = await PermissionService.getAllPermissions()

      return {
        success: true,
        data: permissions
      }
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to fetch permissions',
        error: error.message
      }
    }
  }

  /* Get permission by ID */
  static async getPermissionById(id: string): Promise<ApiResponse> {
    try {
      const permission = await PermissionService.getPermissionById(id)

      if (!permission) {
        return {
          success: false,
          message: 'Permission not found',
          error: 'Permission not found'
        }
      }

      return {
        success: true,
        data: permission
      }
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to fetch permission',
        error: error.message
      }
    }
  }

  /* Update permission */
  static async updatePermission(id: string, data: CreatePermissionDTO): Promise<ApiResponse> {
    try {
      if (!data.name || data.name.trim() === '') {
        return {
          success: false,
          message: 'Permission name is required',
          error: 'Missing required field'
        }
      }

      const permission = await PermissionService.updatePermission(id, data)

      if (!permission) {
        return {
          success: false,
          message: 'Permission not found',
          error: 'Permission not found'
        }
      }

      return {
        success: true,
        message: 'Permission updated successfully',
        data: permission
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to update permission',
        error: error.message
      }
    }
  }

  /* Delete permission */
  static async deletePermission(id: string): Promise<ApiResponse> {
    try {
      const deleted = await PermissionService.deletePermission(id)

      if (!deleted) {
        return {
          success: false,
          message: 'Permission not found',
          error: 'Permission not found'
        }
      }

      return {
        success: true,
        message: 'Permission deleted successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to delete permission',
        error: error.message
      }
    }
  }
}

