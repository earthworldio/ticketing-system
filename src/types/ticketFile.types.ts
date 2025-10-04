/* Ticket File Type Definitions */

export interface TicketFile {
  id: string;
  ticket_id: string;
  file_name: string;
  file_path: string;
  file_size?: number | null;
  file_type?: string | null;
  uploaded_by?: string | null;
  created_date: Date;
}

export interface CreateTicketFileDTO {
  ticket_id: string;
  file_name: string;
  file_path: string;
  file_size?: number;
  file_type?: string;
  uploaded_by?: string;
}

export interface TicketFileWithUploader extends TicketFile {
  uploader_first_name?: string;
  uploader_last_name?: string;
  uploader_email?: string;
}

