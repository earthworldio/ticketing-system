/* Role Service - Business logic */

import { RoleModel } from '@/models/Role'
import { CreateRoleDTO, Role } from '@/types'

export class RoleService {
  /* Create a new role */
  static async createRole(data: CreateRoleDTO): Promise<Role> {
    const existingRole = await RoleModel.findByName(data.name)
    if (existingRole) {
      throw new Error('Role name already exists')
    }

    const role = await RoleModel.create(data)
    return role
  }

  /* Get all roles */
  static async getAllRoles(): Promise<Role[]> {
    return await RoleModel.findAll()
  }

  /* Get role by ID */
  static async getRoleById(id: string): Promise<Role | null> {
    return await RoleModel.findById(id)
  }

  /* Update role */
  static async updateRole(id: string, data: CreateRoleDTO): Promise<Role | null> {
    const role = await RoleModel.findById(id)
    if (!role) {
      throw new Error('Role not found')
    }

    if (data.name && data.name !== role.name) {
      const existingRole = await RoleModel.findByName(data.name)
      if (existingRole) {
        throw new Error('Role name already exists')
      }
    }

    return await RoleModel.update(id, data)
  }

  /* Delete role */
  static async deleteRole(id: string): Promise<boolean> {
    const role = await RoleModel.findById(id)
    if (!role) {
      throw new Error('Role not found')
    }

    return await RoleModel.delete(id)
  }
}

