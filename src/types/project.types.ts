/* Project Type Definitions */

export interface Project {
  id: string;
  name: string;
  code?: string | null;
  description?: string | null;
  customer_id: string;
  start_date?: Date | string | null;
  end_date?: Date | string | null;
  is_closed?: boolean | null;
  created_date: Date;
  updated_date: Date;
  created_by?: string | null;
  updated_by?: string | null;
  deleted_date?: Date | null;
}

export interface ProjectWithRelations extends Project {
  customer_name?: string;
  customer_code?: string;
}

export interface CreateProjectDTO {
  name: string;
  code?: string;
  description?: string;
  customer_id: string;
  start_date?: string;
  end_date?: string;
  created_by?: string; /* User ID who created the project */
}

export interface UpdateProjectDTO {
  name?: string;
  code?: string;
  description?: string;
  customer_id?: string;
  start_date?: string;
  end_date?: string;
  updated_by?: string; /* User ID who updated the project */
}

/* Helper type for UI */
export interface ProjectFormData {
  name: string;
  code: string;
  description: string;
  customer_id: string;
  start_date: string;
  end_date: string;
  sla_value: string;
  sla_unit: 'minutes' | 'hours' | 'days' | 'months';
}
