/* Status Service - Business logic */

import { StatusModel } from '@/models/Status'
import { CreateStatusDTO, UpdateStatusDTO, Status } from '@/types'

export class StatusService {
  /* Find status by ID */
  static async getStatusById(id: string): Promise<Status | null> {
    return await StatusModel.findById(id)
  }

  /* Find all statuses */
  static async getAllStatuses(): Promise<Status[]> {
    return await StatusModel.findAll()
  }

  /* Create a new status */
  static async createStatus(data: CreateStatusDTO): Promise<Status> {
    if (!data.name) {
      throw new Error('Status name is required')
    }

    return await StatusModel.create(data)
  }

  /* Update status */
  static async updateStatus(id: string, data: UpdateStatusDTO): Promise<Status | null> {
    const status = await StatusModel.findById(id)
    if (!status) {
      throw new Error('Status not found')
    }

    return await StatusModel.update(id, data)
  }

  /* Delete status */
  static async deleteStatus(id: string): Promise<boolean> {
    const deleted = await StatusModel.delete(id)
    if (!deleted) {
      throw new Error('Status not found or could not be deleted')
    }
    return deleted
  }
}

