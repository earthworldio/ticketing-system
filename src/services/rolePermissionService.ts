/* RolePermission Service - Business logic */

import { RolePermissionModel } from '@/models/RolePermission'
import { RoleModel } from '@/models/Role'
import { PermissionModel } from '@/models/Permission'
import { AssignPermissionDTO, AssignPermissionsDTO } from '@/types'

export class RolePermissionService {
  /* Assign multiple permissions to role */
  static async assignPermissions(data: AssignPermissionsDTO): Promise<any> {
    // Check if role exists
    const role = await RoleModel.findById(data.role_id)
    if (!role) {
      throw new Error('Role not found')
    }

    const results = []
    const errors = []

    // วนลูปสร้าง assignment สำหรับแต่ละ permission
    for (const permission_id of data.permission_ids) {
      try {
        // Check if permission exists
        const permission = await PermissionModel.findById(permission_id)
        if (!permission) {
          errors.push(`Permission ID ${permission_id} not found`)
          continue
        }

        // Check if already assigned
        const existing = await RolePermissionModel.findByRoleAndPermission(
          data.role_id,
          permission_id
        )
        if (existing) {
          errors.push(`${permission.name} is already assigned to ${role.name}`)
          continue
        }

        // Assign permission
        const assignment = await RolePermissionModel.assign({
          role_id: data.role_id,
          permission_id: permission_id
        })
        results.push(assignment)
      } catch (error: any) {
        errors.push(`Failed to assign permission: ${error.message}`)
      }
    }

    return {
      success: results.length,
      failed: errors.length,
      results,
      errors
    }
  }

  /* Assign single permission to role (เก็บไว้เผื่อใช้งานอื่น) */
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

  /* Update assignment */
  static async updateAssignment(id: string, data: AssignPermissionDTO): Promise<any> {
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

    // Check if the new combination already exists (excluding current)
    const existing = await RolePermissionModel.findByRoleAndPermission(
      data.role_id,
      data.permission_id
    )
    if (existing && existing.id !== id) {
      throw new Error('This permission is already assigned to this role')
    }

    return await RolePermissionModel.update(id, data)
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

