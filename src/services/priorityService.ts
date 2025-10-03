/* Priority Service - Business logic */

import { PriorityModel } from '@/models/Priority'
import { CreatePriorityDTO, UpdatePriorityDTO, Priority } from '@/types'

export class PriorityService {
  /* Find priority by ID */
  static async getPriorityById(id: string): Promise<Priority | null> {
    return await PriorityModel.findById(id)
  }

  /* Find all priorities */
  static async getAllPriorities(): Promise<Priority[]> {
    return await PriorityModel.findAll()
  }

  /* Create a new priority */
  static async createPriority(data: CreatePriorityDTO): Promise<Priority> {
    /* Check if name already exists */
    const existingPriority = await PriorityModel.findByName(data.name)
    if (existingPriority) {
      throw new Error('Priority name already exists')
    }

    return await PriorityModel.create(data)
  }

  /* Update priority */
  static async updatePriority(id: string, data: UpdatePriorityDTO): Promise<Priority | null> {
    const priority = await PriorityModel.findById(id)
    if (!priority) {
      throw new Error('Priority not found')
    }

    /* Check if new name already exists */
    if (data.name && data.name !== priority.name) {
      const existingPriority = await PriorityModel.findByName(data.name)
      if (existingPriority) {
        throw new Error('Priority name already exists')
      }
    }

    return await PriorityModel.update(id, data)
  }

  /* Delete priority */
  static async deletePriority(id: string): Promise<boolean> {
    const deleted = await PriorityModel.delete(id)
    if (!deleted) {
      throw new Error('Priority not found or could not be deleted')
    }
    return deleted
  }
}

