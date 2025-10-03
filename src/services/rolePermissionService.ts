/* RolePermission Service - Business logic */

import { RolePermissionModel } from '@/models/RolePermission'
import { RoleModel } from '@/models/Role'
import { PermissionModel } from '@/models/Permission'
import { AssignPermissionDTO } from '@/types'

export class RolePermissionService {
  /* Assign permission to role */
  static async assignPermission(data: AssignPermissionDTO): Promise<any> {
    // Check if role exists
    const role = await RoleModel.findById(data.role_id)
    if (!role) {
      throw new Error('Role not found')
    }

    // Check if permission exists
    const permission = await PermissionModel.findById(data.permission_id)
    if (!permission) {
      throw new Error('Permission not found')
    }

    // Check if already assigned
    const existing = await RolePermissionModel.findByRoleAndPermission(
      data.role_id,
      data.permission_id
    )
    if (existing) {
      throw new Error('This permission is already assigned to this role')
    }

    // Assign permission
    return await RolePermissionModel.assign(data)
  }

  /* Get all assignments */
  static async getAllAssignments(): Promise<any[]> {
    return await RolePermissionModel.findAll()
  }

  /* Toggle active status */
  static async toggleActive(id: string, is_active: boolean): Promise<any> {
    return await RolePermissionModel.toggleActive(id, is_active)
  }

  /* Delete assignment */
  static async deleteAssignment(id: string): Promise<boolean> {
    return await RolePermissionModel.delete(id)
  }

  /* Get permissions by role */
  static async getPermissionsByRole(role_id: string): Promise<any[]> {
    return await RolePermissionModel.getPermissionsByRole(role_id)
  }
}

