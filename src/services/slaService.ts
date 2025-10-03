/* SLA Service - Business logic */

import { SLAModel } from '@/models/SLA'
import { CreateSLADTO, UpdateSLADTO, SLA } from '@/types'

export class SLAService {
  /* Find SLA by ID */
  static async getSLAById(id: string): Promise<SLA | null> {
    return await SLAModel.findById(id)
  }

  /* Find all SLAs */
  static async getAllSLAs(): Promise<SLA[]> {
    return await SLAModel.findAll()
  }

  /* Create a new SLA */
  static async createSLA(data: CreateSLADTO): Promise<SLA> {
    /* Validate resolve_time is positive */
    if (data.resolve_time <= 0) {
      throw new Error('Resolve time must be greater than 0')
    }

    return await SLAModel.create(data)
  }

  /* Update SLA */
  static async updateSLA(id: string, data: UpdateSLADTO): Promise<SLA | null> {
    const sla = await SLAModel.findById(id)
    if (!sla) {
      throw new Error('SLA not found')
    }

    /* Validate resolve_time if updating */
    if (data.resolve_time !== undefined && data.resolve_time <= 0) {
      throw new Error('Resolve time must be greater than 0')
    }

    return await SLAModel.update(id, data)
  }

  /* Delete SLA */
  static async deleteSLA(id: string): Promise<boolean> {
    const deleted = await SLAModel.delete(id)
    if (!deleted) {
      throw new Error('SLA not found or could not be deleted')
    }
    return deleted
  }
}

