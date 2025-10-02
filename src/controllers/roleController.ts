/* Role Controller */

import { RoleService } from '@/services/roleService'
import { CreateRoleDTO, ApiResponse } from '@/types'

export class RoleController {
  /* Create a new role */
  static async createRole(data: CreateRoleDTO): Promise<ApiResponse> {
    try {
      if (!data.name || data.name.trim() === '') {
        return {
          success: false,
          message: 'Role name is required',
          error: 'Missing required field'
        }
      }

      const role = await RoleService.createRole(data)

      return {
        success: true,
        message: 'Role created successfully',
        data: role
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to create role',
        error: error.message
      }
    }
  }

  /* Get all roles */
  static async getAllRoles(): Promise<ApiResponse> {
    try {
      const roles = await RoleService.getAllRoles()

      return {
        success: true,
        data: roles
      }
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to fetch roles',
        error: error.message
      }
    }
  }

  /* Get role by ID */
  static async getRoleById(id: string): Promise<ApiResponse> {
    try {
      const role = await RoleService.getRoleById(id)

      if (!role) {
        return {
          success: false,
          message: 'Role not found',
          error: 'Role not found'
        }
      }

      return {
        success: true,
        data: role
      }
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to fetch role',
        error: error.message
      }
    }
  }

  /* Update role */
  static async updateRole(id: string, data: CreateRoleDTO): Promise<ApiResponse> {
    try {
      if (!data.name || data.name.trim() === '') {
        return {
          success: false,
          message: 'Role name is required',
          error: 'Missing required field'
        }
      }

      const role = await RoleService.updateRole(id, data)

      if (!role) {
        return {
          success: false,
          message: 'Role not found',
          error: 'Role not found'
        }
      }

      return {
        success: true,
        message: 'Role updated successfully',
        data: role
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to update role',
        error: error.message
      }
    }
  }

  /* Delete role */
  static async deleteRole(id: string): Promise<ApiResponse> {
    try {
      const deleted = await RoleService.deleteRole(id)

      if (!deleted) {
        return {
          success: false,
          message: 'Role not found',
          error: 'Role not found'
        }
      }

      return {
        success: true,
        message: 'Role deleted successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to delete role',
        error: error.message
      }
    }
  }
}

