'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import DashboardLayout from '@/components/features/DashboardLayout'
import TicketModal from '@/components/features/TicketModal'
import ConfirmModal from '@/components/features/settings/ConfirmModal'
import Image from 'next/image'
import { TicketWithRelations, ProjectWithRelations, User } from '@/types'
import { usePermission } from '@/hooks/usePermission'

export default function ProjectDetailPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string
  const { hasPermission, loading: permissionLoading } = usePermission()

  const [loading, setLoading] = useState(true)
  const [project, setProject] = useState<ProjectWithRelations | null>(null)
  const [tickets, setTickets] = useState<TicketWithRelations[]>([])
  const [loadingTickets, setLoadingTickets] = useState(false)
  const [showTicketModal, setShowTicketModal] = useState(false)
  const [editingTicket, setEditingTicket] = useState<TicketWithRelations | null>(null)
  const [deletingTicketId, setDeletingTicketId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [selectedTicketForStatus, setSelectedTicketForStatus] = useState<TicketWithRelations | null>(null)
  const [newStatusId, setNewStatusId] = useState('')
  
  /* Master data for dropdowns */
  const [users, setUsers] = useState<User[]>([])
  const [statuses, setStatuses] = useState<any[]>([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/')
      return
    }

    /* Save current project_id to localStorage */
    localStorage.setItem('current_project_id', projectId)

    fetchProject()
    fetchTickets()
    fetchMasterData()
    setLoading(false)

    /* Cleanup: remove project_id when leaving this page */
    return () => {
      localStorage.removeItem('current_project_id')
    }
  }, [projectId, router])

  /* Fetch project details */
  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`)
      const data = await response.json()
      if (data.success) {
        setProject(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch project:', error)
    }
  }

  /* Fetch tickets */
  const fetchTickets = async () => {
    setLoadingTickets(true)
    try {
      const response = await fetch(`/api/tickets?project_id=${projectId}`)
      const data = await response.json()
      if (data.success) {
        setTickets(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch tickets:', error)
    } finally {
      setLoadingTickets(false)
    }
  }

  /* Fetch master data */
  const fetchMasterData = async () => {
    try {
      const usersRes = await fetch('/api/admin/users')
      const usersData = await usersRes.json()

      const statusesRes = await fetch('/api/statuses')
      const statusesData = await statusesRes.json()

      if (usersData.success) setUsers(usersData.data)
      if (statusesData.success) setStatuses(statusesData.data)
    } catch (error) {
      console.error('Failed to fetch master data:', error)
    }
  }

  /* Handle create/update ticket */
  const handleSaveTicket = async (ticketData: any) => {
    try {
      const token = localStorage.getItem('token')
      const url = editingTicket ? `/api/tickets/${editingTicket.id}` : '/api/tickets'
      const method = editingTicket ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...ticketData,
          project_id: projectId
        })
      })

      const data = await response.json()
      if (!data.success) {
        throw new Error(data.message || 'Failed to save ticket')
      }

      await fetchTickets()
      setShowTicketModal(false)
      setEditingTicket(null)
    } catch (error: any) {
      console.error('Failed to save ticket:', error)
      throw error
    }
  }

  /* Handle delete ticket */
  const handleDeleteTicket = async () => {
    if (!deletingTicketId) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/tickets/${deletingTicketId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      if (!data.success) {
        throw new Error(data.message || 'Failed to delete ticket')
      }

      await fetchTickets()
      setDeletingTicketId(null)
    } catch (error: any) {
      console.error('Failed to delete ticket:', error)
      alert(error.message)
    }
  }

  /* Handle open status modal */
  const handleOpenStatusModal = (ticket: TicketWithRelations) => {
    setSelectedTicketForStatus(ticket)
    setNewStatusId(ticket.status_id || '')
    setShowStatusModal(true)
  }

  /* Handle change ticket status */
  const handleChangeStatus = async () => {
    if (!selectedTicketForStatus || !newStatusId) return

    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      const response = await fetch(`/api/tickets/${selectedTicketForStatus.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status_id: newStatusId,
          updated_by: userData.id
        }),
      })

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to update status')
      }

      await fetchTickets()
      setShowStatusModal(false)
      setSelectedTicketForStatus(null)
      setNewStatusId('')

    } catch (error: any) {
      console.error('Failed to update status:', error)
      alert(error.message || 'Failed to update status')
    }
  }

  /* Format date */
  const formatDate = (dateString: Date | string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    })
  }

  /* Filter tickets based on search query and status */
  const filteredTickets = tickets.filter((ticket) => {
    // Status filter
    if (statusFilter !== 'all' && ticket.status_id !== statusFilter) return false

    // Search filter
    if (searchQuery.trim() === '') return true

    const query = searchQuery.toLowerCase()
    const matchesName = ticket.name?.toLowerCase().includes(query)
    const matchesDescription = ticket.description?.toLowerCase().includes(query)
    const matchesTicketNumber = ticket.ticket_number?.toLowerCase().includes(query)

    return matchesName || matchesDescription || matchesTicketNumber
  })

  if (loading || permissionLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6366F1]"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-2">
          <div>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-sm text-gray-500 hover:text-gray-700 mb-2 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Projects
            </button>
          
          </div>

          {/* New Ticket Button - Only show if user has ticket-create permission */}
          {hasPermission('ticket-create') && (
            <button
              onClick={() => {
                setEditingTicket(null)
                setShowTicketModal(true)
              }}
              className="px-4 py-2 text-white rounded-lg font-medium text-sm flex items-center space-x-2 transition-colors"
              style={{ backgroundColor: '#6366F1' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5558E3')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#6366F1')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>New Ticket</span>
            </button>
          )}
        </div>

        {/* Project Description */}
        {project?.description && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">           
            <div className='flex items-center gap-2'>
              <div className='bg-[#6366F1] border border-[#6366F1] w-25 h-6 rounded-sm flex items-center justify-center text-xs font-semibold'>
                  <span className="text-lg font-semibold" style={{ color: 'white' }}>
                    {project.customer_code}
                  </span>
              </div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {project?.name || ''}
              </h1> 
            </div>
          
            <h3 className="mt-4 text-md font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-sm text-gray-600">{project.description}</p>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mt-4">
              {/* Search */}
              <div className="relative w-full md:flex-1">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search for ticket"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-black w-1/2  md:w-full pl-10 pr-4 py-2.5 
                  border border-gray-300 rounded-lg text-sm text-gray-600 
                  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                />
              </div>

              {/* Status Filter */}
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full md:w-auto px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#6366F1] bg-white"
              >
                <option value="all">All Status</option>
                {statuses.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}


        {/* Tickets Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tickets</h2>     
          {!hasPermission('ticket-read') ? (
            /* No Permission Message */
            <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-200 rounded-lg">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="text-xl font-medium text-gray-700 mb-2">Access Denied</p>
                <p className="text-sm text-gray-500 mb-3">You don't have permission to view tickets.</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  <span className="text-sm font-mono text-gray-700">Required: <strong>ticket-read</strong></span>
                </div>
              </div>
            </div>
          ) : loadingTickets ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6366F1]"></div>
              <span className="ml-3 text-gray-600">Loading tickets...</span>
            </div>
          ) : filteredTickets.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-200 rounded-lg">
              {tickets.length === 0 ? (
                <>
                  <p className="text-black text-xl font-medium tracking-wide mb-8">
                    Get started by creating a ticket !
                  </p>
                    <div className="relative w-48 h-48">
                      <Image
                        src="/co-working.png"
                        alt="No tickets illustration"
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                </>
              ) : (
                <>
                  <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="text-xl font-medium text-gray-700 mb-2">No tickets found</p>
                  <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
                </>
              )}
            </div>
          ) : (
            /* Tickets List */
            <div className="space-y-4">
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Ticket Header */}

                      <div className="flex items-center justify-between">

                      <div className="flex items-center gap-2 mb-3">
                        <div className='bg-[#6366F1] border border-[#6366F1] w-45 h-6 rounded-sm flex items-center justify-center text-xs font-semibold'>
                          <span className="text-lg font-semibold" style={{ color: 'white' }}>
                            {ticket.ticket_number || `#${ticket.id.substring(0, 8)}`}
                          </span>
                        </div>

                        <span className="text-lg font-medium" style={{ color: 'black' }}>
                          {ticket.name}
                        </span>
                        
                        {/* Status Badge with Edit Button */}
                        <div className="flex items-center gap-2">
                          {ticket.status_name && (
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                              {ticket.status_name}
                            </span>
                          )}
                          
                        
                        </div>
                      </div>

                      {/* Edit Status Button */}
                      <div className="flex items-center gap-2">
                      <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleOpenStatusModal(ticket)
                            }}
                            className="border flex items-center gap-2 px-2 py-0.75 
                            text-[#6366F1] bg-[#6366F1]/10 rounded-lg transition-colors"
                            title="Change Status"
                          >
                            <span className="text-sm font-medium">
                              Change Status
                            </span>

                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg> 
                      </button>
                      </div>
                      

                      </div>
                      
                      

                      {/* Ticket Description */}
                      {ticket.description && (
                        <p className="text-sm text-gray-600 mt-4 mb-4">
                          {ticket.description}
                        </p>
                      )}

                      {ticket.owner_name && (
                        <p className="text-sm text-gray-600 mt-1 mb-2">
                          {ticket.owner_name}
                        </p>
                      )}

                 
                      <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
                        {/* Creator Info */}
                        {ticket.creator_first_name ? (
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                              style={{ backgroundColor: '#6366F1' }}
                            >
                              {ticket.creator_first_name.charAt(0)}
                              {ticket.creator_last_name?.charAt(0) || ''}
                            </div>
                            <span className="text-sm text-gray-700">
                              {ticket.creator_first_name} {ticket.creator_last_name}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                              style={{ backgroundColor: '#6366F1' }}
                            >
                              ?
                            </div>
                            <span className="text-sm text-gray-500">Unknown</span>
                          </div>
                        )}

                        {/* Open Ticket Button */}
                        <button 
                          onClick={() => router.push(`/dashboard/tickets/${ticket.id}`)}
                          className="text-sm font-medium transition-colors"
                          style={{ color: '#6366F1', cursor: 'pointer', textDecoration: 'underline' }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#5558E3')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = '#6366F1')}
                        >
                          Open Ticket
                        </button>
                      </div> 
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ticket Modal */}
      <TicketModal
        isOpen={showTicketModal}
        onClose={() => {
          setShowTicketModal(false)
          setEditingTicket(null)
        }}
        onSubmit={handleSaveTicket}
        initialData={editingTicket}
        users={users}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={!!deletingTicketId}
        onClose={() => setDeletingTicketId(null)}
        onConfirm={handleDeleteTicket}
        title="Delete Ticket"
        message="Are you sure you want to delete this ticket? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Change Status Modal */}
      {showStatusModal && selectedTicketForStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm" 
            onClick={() => {
              setShowStatusModal(false)
              setSelectedTicketForStatus(null)
              setNewStatusId('')
            }} 
          />
          <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Change Ticket Status</h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-3">
                Ticket: <span className="font-semibold text-gray-900">{selectedTicketForStatus.ticket_number}</span> - {selectedTicketForStatus.name}
              </p>
              
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Status
              </label>
              <select
                value={newStatusId}
                onChange={(e) => setNewStatusId(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
              >
                <option value="">Select status</option>
                {statuses.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowStatusModal(false)
                  setSelectedTicketForStatus(null)
                  setNewStatusId('')
                }}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleChangeStatus}
                disabled={!newStatusId}
                className="flex-1 px-4 py-2.5 bg-[#6366F1] text-white rounded-lg hover:bg-[#5558E3] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

