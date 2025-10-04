/* ProjectSLA Type Definitions - Junction Table */

export interface ProjectSLA {
  id: string;
  project_id: string;
  sla_id: string;
  created_date: Date;
  updated_date: Date;
}

export interface CreateProjectSLADTO {
  project_id: string;
  sla_id: string;
}

export interface ProjectSLAWithDetails extends ProjectSLA {
  sla_name?: string;
  sla_resolve_time?: number;
}

