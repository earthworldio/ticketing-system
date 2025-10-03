/* Customer Service - Business logic */

import { CustomerModel } from '@/models/Customer'
import { CreateCustomerDTO, UpdateCustomerDTO, Customer } from '@/types'

export class CustomerService {
    
  /* Find customer by ID */
  static async getCustomerById(id: string): Promise<Customer | null> {
    return await CustomerModel.findById(id)
  }

  /* Find all customers */
  static async getAllCustomers(): Promise<Customer[]> {
    return await CustomerModel.findAll()
  }

  /* Create a new customer */
  static async createCustomer(data: CreateCustomerDTO): Promise<Customer> {
    /* Validate code length */
    if (data.code.length > 4) {
      throw new Error('Code must not exceed 4 characters')
    }

    /* Check if code already exists */
    const existingCustomer = await CustomerModel.findByCode(data.code)
    if (existingCustomer) {
      throw new Error('Customer code already exists')
    }

    return await CustomerModel.create(data)
  }

  /* Update customer */
  static async updateCustomer(id: string, data: UpdateCustomerDTO): Promise<Customer | null> {
    const customer = await CustomerModel.findById(id)
   
    if (!customer) {
      throw new Error('Customer not found')
    }

    /* Validate code length if updating */
    if (data.code && data.code.length > 4) {
      throw new Error('Code must not exceed 4 characters')
    }

    /* Check if new code already exists */
    if (data.code && data.code !== customer.code) {
      const existingCustomer = await CustomerModel.findByCode(data.code)
      if (existingCustomer) {
        throw new Error('Customer code already exists')
      }
    }

    return await CustomerModel.update(id, data)
  }

  /* Delete customer */
  static async deleteCustomer(id: string): Promise<boolean> {
    const deleted = await CustomerModel.delete(id)
    if (!deleted) {
      throw new Error('Customer not found or could not be deleted')
    }
    return deleted
  }
}

