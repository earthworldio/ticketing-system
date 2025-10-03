/* Status Controller */

import { StatusService } from '@/services/statusService'
import { CreateStatusDTO, UpdateStatusDTO, ApiResponse } from '@/types'

export class StatusController {
  /* Create a new status */
  static async createStatus(data: CreateStatusDTO): Promise<ApiResponse> {
    try {
      if (!data.name) {
        return {
          success: false,
          message: 'Status name is required',
          error: 'Invalid input'
        }
      }

      const status = await StatusService.createStatus(data)
      return {
        success: true,
        message: 'Status created successfully',
        data: status
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Error creating status',
        error: error.message
      }
    }
  }

  /* Get status by ID */
  static async getStatusById(id: string): Promise<ApiResponse> {
    try {
      const status = await StatusService.getStatusById(id)
      if (!status) {
        return {
          success: false,
          message: 'Status not found',
          error: 'Status not found'
        }
      }
      return {
        success: true,
        message: 'Status fetched successfully',
        data: status
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Error fetching status',
        error: error.message
      }
    }
  }

  /* Get all statuses */
  static async getAllStatuses(): Promise<ApiResponse> {
    try {
      const statuses = await StatusService.getAllStatuses()
      return {
        success: true,
        message: 'Statuses fetched successfully',
        data: statuses
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Error fetching statuses',
        error: error.message
      }
    }
  }

  /* Update status */
  static async updateStatus(id: string, data: UpdateStatusDTO): Promise<ApiResponse> {
    try {
      const updatedStatus = await StatusService.updateStatus(id, data)
      if (!updatedStatus) {
        return {
          success: false,
          message: 'Status not found or could not be updated',
          error: 'Update failed'
        }
      }
      return {
        success: true,
        message: 'Status updated successfully',
        data: updatedStatus
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Error updating status',
        error: error.message
      }
    }
  }

  /* Delete status */
  static async deleteStatus(id: string): Promise<ApiResponse> {
    try {
      const deleted = await StatusService.deleteStatus(id)
      if (!deleted) {
        return {
          success: false,
          message: 'Status not found',
          error: 'Status not found'
        }
      }
      return {
        success: true,
        message: 'Status deleted successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Error deleting status',
        error: error.message
      }
    }
  }
}

