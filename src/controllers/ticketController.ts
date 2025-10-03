/* Ticket Controller */

import { TicketService } from '@/services/ticketService'
import { CreateTicketDTO, UpdateTicketDTO, ApiResponse } from '@/types'

export class TicketController {
  /* Create a new ticket */
  static async createTicket(data: CreateTicketDTO): Promise<ApiResponse> {
    try {
      if (!data.name) {
        return {
          success: false,
          message: 'Ticket name is required',
          error: 'Invalid input'
        }
      }

      if (!data.project_id) {
        return {
          success: false,
          message: 'Project ID is required',
          error: 'Invalid input'
        }
      }

      const ticket = await TicketService.createTicket(data)
      return {
        success: true,
        message: 'Ticket created successfully',
        data: ticket
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Error creating ticket',
        error: error.message
      }
    }
  }

  /* Get ticket by ID */
  static async getTicketById(id: string): Promise<ApiResponse> {
    try {
      const ticket = await TicketService.getTicketById(id)
      if (!ticket) {
        return {
          success: false,
          message: 'Ticket not found',
          error: 'Ticket not found'
        }
      }
      return {
        success: true,
        message: 'Ticket fetched successfully',
        data: ticket
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Error fetching ticket',
        error: error.message
      }
    }
  }

  /* Get all tickets by project */
  static async getTicketsByProject(project_id: string): Promise<ApiResponse> {
    try {
      const tickets = await TicketService.getTicketsByProject(project_id)
      return {
        success: true,
        message: 'Tickets fetched successfully',
        data: tickets
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Error fetching tickets',
        error: error.message
      }
    }
  }

  /* Get all tickets */
  static async getAllTickets(): Promise<ApiResponse> {
    try {
      const tickets = await TicketService.getAllTickets()
      return {
        success: true,
        message: 'Tickets fetched successfully',
        data: tickets
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Error fetching tickets',
        error: error.message
      }
    }
  }

  /* Update ticket */
  static async updateTicket(id: string, data: UpdateTicketDTO): Promise<ApiResponse> {
    try {
      const updatedTicket = await TicketService.updateTicket(id, data)
      if (!updatedTicket) {
        return {
          success: false,
          message: 'Ticket not found or could not be updated',
          error: 'Update failed'
        }
      }
      return {
        success: true,
        message: 'Ticket updated successfully',
        data: updatedTicket
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Error updating ticket',
        error: error.message
      }
    }
  }

  /* Delete ticket */
  static async deleteTicket(id: string): Promise<ApiResponse> {
    try {
      const deleted = await TicketService.deleteTicket(id)
      if (!deleted) {
        return {
          success: false,
          message: 'Ticket not found',
          error: 'Ticket not found'
        }
      }
      return {
        success: true,
        message: 'Ticket deleted successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Error deleting ticket',
        error: error.message
      }
    }
  }
}

