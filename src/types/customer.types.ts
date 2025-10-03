/* Customer Type Definitions */

export interface Customer {
  id: string;
  name: string;
  code: string;
}

export interface CreateCustomerDTO {
  name: string;
  code: string;
}

export interface UpdateCustomerDTO {
  name?: string;
  code?: string;
}

