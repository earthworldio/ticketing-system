/**
 * User Types
 */

export interface User {
  id: string;
  role_id?: string | null;
  title_name?: string | null;
  first_name: string;
  last_name: string;
  image_url?: string | null;
  email: string;
  password: string;
  phone?: string | null;
  created_date: Date;
  updated_date: Date;
  activate: boolean;
}

export interface CreateUserDTO {
  role_id: string;
  email: string;
  password: string;
  title_name?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
}

export interface UpdateUserDTO {
  role_id?: string;
  title_name?: string;
  first_name?: string;
  last_name?: string;
  image_url?: string;
  email?: string;
  password?: string;
  phone?: string;
  activate?: boolean;
}

export interface UserResponse {
  id: string;
  role_id?: string | null;
  title_name?: string | null;
  first_name: string;
  last_name: string;
  image_url?: string | null;
  email: string;
  phone?: string | null;
  created_date: Date;
  updated_date: Date;
  activate: boolean;
}

