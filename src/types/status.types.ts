/* Status Type Definitions */

export interface Status {
  id: string;
  name: string;
  created_date: Date;
  updated_date: Date;
}

export interface CreateStatusDTO {
  name: string;
}

export interface UpdateStatusDTO {
  name?: string;
}

