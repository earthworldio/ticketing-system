'use client'

import { useState, useEffect } from 'react'
import { User, TicketWithRelations } from '@/types'

interface TicketModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => Promise<void>
  initialData?: TicketWithRelations | null
  users: User[]
}

export default function TicketModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  users
}: TicketModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status_id: '',
    sla_id: '',
    owner: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [statuses, setStatuses] = useState<any[]>([])
  const [slas, setSlas] = useState<any[]>([])
  const [openStatusId, setOpenStatusId] = useState<string>('')

  useEffect(() => {
    if (isOpen) {
      fetchStatuses()
      fetchProjectSLAs()
      
      if (initialData) {
        setFormData({
          name: initialData.name || '',
          description: initialData.description || '',
          status_id: initialData.status_id || '',
          sla_id: initialData.sla_id || '',
          owner: initialData.owner || ''
        })
      } else {
        // For new ticket, set status to "Open" automatically
        if (openStatusId) {
          setFormData(prev => ({ ...prev, status_id: openStatusId }))
        }
      }
    } else {
      setFormData({
        name: '',
        description: '',
        status_id: '',
        sla_id: '',
        owner: ''
      })
      setError('')
    }
  }, [isOpen, initialData, openStatusId])

  const fetchStatuses = async () => {
    try {
      const response = await fetch('/api/statuses')
      const data = await response.json()
      if (data.success) {
        setStatuses(data.data)
        // Find "Open" status
        const openStatus = data.data.find((s: any) => s.name.toLowerCase() === 'open')
        if (openStatus) {
          setOpenStatusId(openStatus.id)
        }
      }
    } catch (error) {
      console.error('Failed to fetch statuses:', error)
    }
  }

  const fetchProjectSLAs = async () => {
    try {
      // Get project_id from localStorage
      const projectId = localStorage.getItem('current_project_id')
      if (!projectId) return

      const response = await fetch(`/api/project-sla?project_id=${projectId}`)
      const data = await response.json()
      if (data.success) {
        setSlas(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch project SLAs:', error)
    }
  }

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!formData.name) {
        setError('Ticket name is required.')
        return
      }

      await onSubmit(formData)
      onClose()
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    onClose()
  }

  const isEditMode = !!(initialData && initialData.id)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            {isEditMode ? 'Edit Ticket' : 'New Ticket'}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Ticket Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
              placeholder="Enter ticket name"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent resize-none"
              placeholder="Enter ticket description (optional)"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                value={formData.status_id}
                onChange={(e) => setFormData({ ...formData, status_id: e.target.value })}
                disabled={!initialData}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select status</option>
                {statuses.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="sla" className="block text-sm font-medium text-gray-700 mb-2">
                SLA
              </label>
              <select
                id="sla"
                value={formData.sla_id}
                onChange={(e) => setFormData({ ...formData, sla_id: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
              >
                <option value="">Select SLA</option>
                {slas.map((sla) => (
                  <option key={sla.sla_id} value={sla.sla_id}>
                    {sla.sla_name} ({sla.sla_resolve_time} mins)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="owner" className="block text-sm font-medium text-gray-700 mb-2">
              Owner (Assigned To)
            </label>
            <select
              id="owner"
              value={formData.owner}
              onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
            >
              <option value="">Select owner</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.name}
              className="flex-1 px-4 py-2.5 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#6366F1' }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#5558E3')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#6366F1')}
            >
              {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

