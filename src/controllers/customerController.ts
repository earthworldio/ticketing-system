/* Customer Controller */

import { CustomerService } from '@/services/customerService'
import { CreateCustomerDTO, UpdateCustomerDTO, ApiResponse } from '@/types'

export class CustomerController {
  /* Create a new customer */
  static async createCustomer(data: CreateCustomerDTO): Promise<ApiResponse> {
    try {
      if (!data.name || !data.code) {
        return {
          success: false,
          message: 'Customer name and code are required',
          error: 'Missing required fields'
        }
      }

      const customer = await CustomerService.createCustomer(data)
      return {
        success: true,
        message: 'Customer created successfully',
        data: customer
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Error creating customer',
        error: error.message
      }
    }
  }

  /* Get customer by ID */
  static async getCustomerById(id: string): Promise<ApiResponse> {
    try {
      const customer = await CustomerService.getCustomerById(id)
      if (!customer) {
        return {
          success: false,
          message: 'Customer not found',
          error: 'Customer not found'
        }
      }
      return {
        success: true,
        message: 'Customer fetched successfully',
        data: customer
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Error fetching customer',
        error: error.message
      }
    }
  }

  /* Get all customers */
  static async getAllCustomers(): Promise<ApiResponse> {
    try {
      const customers = await CustomerService.getAllCustomers()
      return {
        success: true,
        message: 'Customers fetched successfully',
        data: customers
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Error fetching customers',
        error: error.message
      }
    }
  }

  /* Update customer */
  static async updateCustomer(id: string, data: UpdateCustomerDTO): Promise<ApiResponse> {
    try {
      if (!data.name && !data.code) {
        return {
          success: false,
          message: 'At least one field (name or code) is required for update',
          error: 'No fields to update'
        }
      }

      const updatedCustomer = await CustomerService.updateCustomer(id, data)
      if (!updatedCustomer) {
        return {
          success: false,
          message: 'Customer not found or could not be updated',
          error: 'Update failed'
        }
      }
      return {
        success: true,
        message: 'Customer updated successfully',
        data: updatedCustomer
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Error updating customer',
        error: error.message
      }
    }
  }

  /* Delete customer */
  static async deleteCustomer(id: string): Promise<ApiResponse> {
    try {
      const deleted = await CustomerService.deleteCustomer(id)
      if (!deleted) {
        return {
          success: false,
          message: 'Customer not found',
          error: 'Customer not found'
        }
      }
      return {
        success: true,
        message: 'Customer deleted successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Error deleting customer',
        error: error.message
      }
    }
  }
}

