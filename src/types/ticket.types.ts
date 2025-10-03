/* Ticket Type Definitions */

export interface Ticket {
  id: string;
  project_id: string;
  priority_id?: string | null;
  status_id?: string | null;
  owner?: string | null;
  name: string;
  created_by?: string | null;
  created_date: Date;
  updated_by?: string | null;
  updated_date: Date;
  
  // Relations (for display)
  priority_name?: string;
  status_name?: string;
  owner_name?: string;
  creator_name?: string;
}

export interface CreateTicketDTO {
  project_id: string;
  priority_id?: string;
  status_id?: string;
  owner?: string;
  name: string;
  created_by?: string;
}

export interface UpdateTicketDTO {
  priority_id?: string;
  status_id?: string;
  owner?: string;
  name?: string;
  updated_by?: string;
}

export interface TicketWithRelations extends Ticket {
  priority_name?: string;
  status_name?: string;
  owner_first_name?: string;
  owner_last_name?: string;
  creator_first_name?: string;
  creator_last_name?: string;
  customer_code?: string; // From project's customer
  ticket_number?: string; // Generated ticket number (e.g., DTN-001)
}

