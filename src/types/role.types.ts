/* Role & Permission Types */

export interface Role {
  id: string
  name: string
  description?: string | null
  created_date: Date
  updated_date: Date
}

export interface Permission {
  id: string
  name: string
  description?: string | null
  created_date: Date
  updated_date: Date
}

export interface RolePermission {
  id: string
  role_id: string
  permission_id: string
  is_active: boolean
  created_date: Date
  updated_date: Date
}

export interface CreateRoleDTO {
  name: string
  description?: string
}

export interface CreatePermissionDTO {
  name: string
  description?: string
}

export interface UpdatePermissionDTO {
  name?: string
  description?: string
}

export interface AssignPermissionDTO {
  role_id: string
  permission_id: string
}

export interface RoleWithPermissions extends Role {
  permissions: Permission[]
}
