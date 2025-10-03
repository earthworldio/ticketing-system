/* SLA Controller */

import { SLAService } from '@/services/slaService'
import { CreateSLADTO, UpdateSLADTO, ApiResponse } from '@/types'

export class SLAController {
  /* Create a new SLA */
  static async createSLA(data: CreateSLADTO): Promise<ApiResponse> {
    try {
      if (data.resolve_time === undefined || data.resolve_time === null) {
        return {
          success: false,
          message: 'Resolve time is required',
          error: 'Missing required fields'
        }
      }

      const sla = await SLAService.createSLA(data)
      return {
        success: true,
        message: 'SLA created successfully',
        data: sla
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Error creating SLA',
        error: error.message
      }
    }
  }

  /* Get SLA by ID */
  static async getSLAById(id: string): Promise<ApiResponse> {
    try {
      const sla = await SLAService.getSLAById(id)
      if (!sla) {
        return {
          success: false,
          message: 'SLA not found',
          error: 'SLA not found'
        }
      }
      return {
        success: true,
        message: 'SLA fetched successfully',
        data: sla
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Error fetching SLA',
        error: error.message
      }
    }
  }

  /* Get all SLAs */
  static async getAllSLAs(): Promise<ApiResponse> {
    try {
      const slas = await SLAService.getAllSLAs()
      return {
        success: true,
        message: 'SLAs fetched successfully',
        data: slas
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Error fetching SLAs',
        error: error.message
      }
    }
  }

  /* Update SLA */
  static async updateSLA(id: string, data: UpdateSLADTO): Promise<ApiResponse> {
    try {
      if (data.resolve_time === undefined) {
        return {
          success: false,
          message: 'Resolve time is required for update',
          error: 'No fields to update'
        }
      }

      const updatedSLA = await SLAService.updateSLA(id, data)
      if (!updatedSLA) {
        return {
          success: false,
          message: 'SLA not found or could not be updated',
          error: 'Update failed'
        }
      }
      return {
        success: true,
        message: 'SLA updated successfully',
        data: updatedSLA
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Error updating SLA',
        error: error.message
      }
    }
  }

  /* Delete SLA */
  static async deleteSLA(id: string): Promise<ApiResponse> {
    try {
      const deleted = await SLAService.deleteSLA(id)
      if (!deleted) {
        return {
          success: false,
          message: 'SLA not found',
          error: 'SLA not found'
        }
      }
      return {
        success: true,
        message: 'SLA deleted successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Error deleting SLA',
        error: error.message
      }
    }
  }
}

