/* SLA Type Definitions */

export interface SLA {
  id: string;
  resolve_time: number; /* in minutes */
}

export interface CreateSLADTO {
  resolve_time: number; /* in minutes */
}

export interface UpdateSLADTO {
  resolve_time?: number; /* in minutes */
}

