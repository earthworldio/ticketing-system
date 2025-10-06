/* Status Type Definitions */

export interface Status {
  id: string;
  name: string;
}

export interface CreateStatusDTO {
  name: string;
}

export interface UpdateStatusDTO {
  name?: string;
}

