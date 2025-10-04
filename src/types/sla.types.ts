/* SLA Type Definitions */

export interface SLA {
  id: string;
  name?: string;
  resolve_time: number; /* in minutes */
  created_date?: Date;
  updated_date?: Date;
}

export interface CreateSLADTO {
  name: string;
  resolve_time: number; /* in minutes */
}

export interface UpdateSLADTO {
  name?: string;
  resolve_time?: number; /* in minutes */
}

