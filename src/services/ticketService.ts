/* Ticket Service - Business logic */

import { TicketModel } from '@/models/Ticket'
import { CreateTicketDTO, UpdateTicketDTO, TicketWithRelations } from '@/types'

export class TicketService {
  /* Find ticket by ID */
  static async getTicketById(id: string): Promise<TicketWithRelations | null> {
    return await TicketModel.findById(id)
  }

  /* Find all tickets by project */
  static async getTicketsByProject(project_id: string): Promise<TicketWithRelations[]> {
    return await TicketModel.findByProjectId(project_id)
  }

  /* Find all tickets */
  static async getAllTickets(): Promise<TicketWithRelations[]> {
    return await TicketModel.findAll()
  }

  /* Create a new ticket */
  static async createTicket(data: CreateTicketDTO): Promise<TicketWithRelations> {
    if (!data.name || !data.project_id) {
      throw new Error('Ticket name and project are required')
    }

    const ticket = await TicketModel.create(data)
    
    // Fetch the created ticket with relations for a complete response
    return (await this.getTicketById(ticket.id)) as TicketWithRelations
  }

  /* Update ticket */
  static async updateTicket(id: string, data: UpdateTicketDTO): Promise<TicketWithRelations | null> {
    const ticket = await TicketModel.findById(id)
    if (!ticket) {
      throw new Error('Ticket not found')
    }

    const updatedTicket = await TicketModel.update(id, data)
    if (!updatedTicket) {
      return null
    }
    
    return (await this.getTicketById(updatedTicket.id)) as TicketWithRelations
  }

  /* Delete ticket */
  static async deleteTicket(id: string): Promise<boolean> {
    const deleted = await TicketModel.delete(id)
    if (!deleted) {
      throw new Error('Ticket not found or could not be deleted')
    }
    return deleted
  }
}

