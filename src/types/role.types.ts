/**
 * Role Types
 */

export interface Role {
  id: string;
  name: string;
  description?: string | null;
  created_date: Date;
  updated_date: Date;
}

export interface CreateRoleDTO {
  name: string;
  description?: string;
}

export interface UpdateRoleDTO {
  name?: string;
  description?: string;
}

