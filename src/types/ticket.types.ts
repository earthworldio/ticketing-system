/* Ticket Type Definitions */

export interface Ticket {
  id: string;
  project_id: string;
  number?: number | null;
  status_id?: string | null;
  sla_id?: string | null;
  owner?: string | null;
  name: string;
  description?: string | null;
  created_by?: string | null;
  created_date: Date;
  updated_by?: string | null;
  updated_date: Date;

  status_name?: string;
  sla_name?: string;
  owner_name?: string;
  creator_name?: string;
}

export interface CreateTicketDTO {
  project_id: string;
  status_id?: string;
  sla_id?: string;
  owner?: string;
  name: string;
  description?: string;
  created_by?: string;
}

export interface UpdateTicketDTO {
  status_id?: string;
  sla_id?: string;
  owner?: string;
  name?: string;
  description?: string;
  updated_by?: string;
}

export interface TicketWithRelations extends Ticket {
  status_name?: string;
  sla_name?: string;
  owner_first_name?: string;
  owner_last_name?: string;
  creator_first_name?: string;
  creator_last_name?: string;
  customer_code?: string; 
  ticket_number?: string; 
}

