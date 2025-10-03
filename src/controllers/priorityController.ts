/* Priority Controller */

import { PriorityService } from '@/services/priorityService'
import { CreatePriorityDTO, UpdatePriorityDTO, ApiResponse } from '@/types'

export class PriorityController {
  /* Create a new priority */
  static async createPriority(data: CreatePriorityDTO): Promise<ApiResponse> {
    try {
      if (!data.name) {
        return {
          success: false,
          message: 'Priority name is required',
          error: 'Missing required fields'
        }
      }

      const priority = await PriorityService.createPriority(data)
      return {
        success: true,
        message: 'Priority created successfully',
        data: priority
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Error creating priority',
        error: error.message
      }
    }
  }

  /* Get priority by ID */
  static async getPriorityById(id: string): Promise<ApiResponse> {
    try {
      const priority = await PriorityService.getPriorityById(id)
      if (!priority) {
        return {
          success: false,
          message: 'Priority not found',
          error: 'Priority not found'
        }
      }
      return {
        success: true,
        message: 'Priority fetched successfully',
        data: priority
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Error fetching priority',
        error: error.message
      }
    }
  }

  /* Get all priorities */
  static async getAllPriorities(): Promise<ApiResponse> {
    try {
      const priorities = await PriorityService.getAllPriorities()
      return {
        success: true,
        message: 'Priorities fetched successfully',
        data: priorities
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Error fetching priorities',
        error: error.message
      }
    }
  }

  /* Update priority */
  static async updatePriority(id: string, data: UpdatePriorityDTO): Promise<ApiResponse> {
    try {
      if (!data.name) {
        return {
          success: false,
          message: 'Priority name is required for update',
          error: 'No fields to update'
        }
      }

      const updatedPriority = await PriorityService.updatePriority(id, data)
      if (!updatedPriority) {
        return {
          success: false,
          message: 'Priority not found or could not be updated',
          error: 'Update failed'
        }
      }
      return {
        success: true,
        message: 'Priority updated successfully',
        data: updatedPriority
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Error updating priority',
        error: error.message
      }
    }
  }

  /* Delete priority */
  static async deletePriority(id: string): Promise<ApiResponse> {
    try {
      const deleted = await PriorityService.deletePriority(id)
      if (!deleted) {
        return {
          success: false,
          message: 'Priority not found',
          error: 'Priority not found'
        }
      }
      return {
        success: true,
        message: 'Priority deleted successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Error deleting priority',
        error: error.message
      }
    }
  }
}

