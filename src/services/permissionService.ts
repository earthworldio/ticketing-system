/* Permission Service - Business logic */

import { PermissionModel } from '@/models/Permission'
import { CreatePermissionDTO, Permission } from '@/types'

export class PermissionService {
  /* Create a new permission */
  static async createPermission(data: CreatePermissionDTO): Promise<Permission> {
    const existingPermission = await PermissionModel.findByName(data.name)
    if (existingPermission) {
      throw new Error('Permission name already exists')
    }

    const permission = await PermissionModel.create(data)
    return permission
  }

  /* Get all permissions */
  static async getAllPermissions(): Promise<Permission[]> {
    return await PermissionModel.findAll()
  }

  /* Get permission by ID */
  static async getPermissionById(id: string): Promise<Permission | null> {
    return await PermissionModel.findById(id)
  }

  /* Update permission */
  static async updatePermission(id: string, data: CreatePermissionDTO): Promise<Permission | null> {
    const permission = await PermissionModel.findById(id)
    if (!permission) {
      throw new Error('Permission not found')
    }
    
    if (data.name && data.name !== permission.name) {
      const existingPermission = await PermissionModel.findByName(data.name)
      if (existingPermission) {
        throw new Error('Permission name already exists')
      }
    }

    return await PermissionModel.update(id, data)
  }

  /* Delete permission */
  static async deletePermission(id: string): Promise<boolean> {
    const permission = await PermissionModel.findById(id)
    if (!permission) {
      throw new Error('Permission not found')
    }

    return await PermissionModel.delete(id)
  }
}

