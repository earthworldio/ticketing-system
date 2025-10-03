/* Priority Type Definitions */

export interface Priority {
  id: string;
  name: string;
}

export interface CreatePriorityDTO {
  name: string;
}

export interface UpdatePriorityDTO {
  name?: string;
}

