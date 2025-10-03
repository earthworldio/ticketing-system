'use client'

import { useState, useEffect } from 'react'
import { Customer } from '@/types'

interface ProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => Promise<void>
}

export default function ProjectModal({ isOpen, onClose, onSubmit }: ProjectModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    customer_id: '',
    start_date: '',
    end_date: '',
    sla_value: '',
    sla_unit: 'hours' as 'minutes' | 'hours' | 'days' | 'months'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  /* Master data */
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loadingMasterData, setLoadingMasterData] = useState(false)

  /* Fetch master data when modal opens */
  useEffect(() => {
    if (isOpen) {
      fetchMasterData()
    } else {
      // Reset form when modal closes
      setFormData({
        name: '',
        code: '',
        description: '',
        customer_id: '',
        start_date: '',
        end_date: '',
        sla_value: '',
        sla_unit: 'hours'
      })
      setError('')
    }
  }, [isOpen])

  const fetchMasterData = async () => {
    setLoadingMasterData(true)
    try {
      const response = await fetch('/api/customers')
      const customersData = await response.json()

      if (customersData.success) {
        setCustomers(customersData.data)
      }
    } catch (error) {
      console.error('Failed to fetch master data:', error)
    } finally {
      setLoadingMasterData(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Convert SLA to minutes
      const value = parseFloat(formData.sla_value)
      let minutes = value

      switch (formData.sla_unit) {
        case 'hours':
          minutes = value * 60
          break
        case 'days':
          minutes = value * 1440
          break
        case 'months':
          minutes = value * 43200
          break
      }

      // Step 1: Create SLA record first
      const slaResponse = await fetch('/api/sla', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resolve_time: minutes
        }),
      })

      const slaData = await slaResponse.json()

      if (!slaData.success) {
        throw new Error(slaData.message || 'Failed to create SLA')
      }

      // Step 2: Create project with sla_id
      await onSubmit({
        name: formData.name,
        code: formData.code || null,
        description: formData.description || null,
        customer_id: formData.customer_id,
        sla_id: slaData.data.id, // Use the created SLA's ID
        start_date: formData.start_date || null,
        end_date: formData.end_date || null
      })

      setFormData({
        name: '',
        code: '',
        description: '',
        customer_id: '',
        start_date: '',
        end_date: '',
        sla_value: '',
        sla_unit: 'hours'
      })
      onClose()
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Create New Project</h3>
          <button
            onClick={onClose}
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

        {/* Loading Master Data */}
        {loadingMasterData ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6366F1]"></div>
            <span className="ml-3 text-gray-600">Loading...</span>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Project Name & Code - Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Project Name */}
              <div className="md:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
                  placeholder="Enter project name"
                />
              </div>

              {/* Code */}
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                  Code
                </label>
                <input
                  type="text"
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent uppercase"
                  placeholder="CODE"
                  maxLength={10}
                />
              </div>
            </div>

            {/* Description */}
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
                placeholder="Enter project description (optional)"
              />
            </div>

            {/* Customer */}
            <div>
              <label htmlFor="customer" className="block text-sm font-medium text-gray-700 mb-2">
                Customer <span className="text-red-500">*</span>
              </label>
              <select
                id="customer"
                required
                value={formData.customer_id}
                onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
              >
                <option value="">Select customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} ({customer.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date & End Date - Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start Date */}
              <div>
                <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  id="start_date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
                />
              </div>

              {/* End Date */}
              <div>
                <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  id="end_date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  min={formData.start_date}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
                />
              </div>
            </div>

            {/* SLA (Service Level Agreement) */}
            <div>
              <label htmlFor="sla" className="block text-sm font-medium text-gray-700 mb-2">
                SLA - Resolve Time <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  id="sla"
                  required
                  min="1"
                  step="1"
                  value={formData.sla_value}
                  onChange={(e) => setFormData({ ...formData, sla_value: e.target.value })}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
                  placeholder="Enter value"
                />
                <select
                  value={formData.sla_unit}
                  onChange={(e) => setFormData({ ...formData, sla_unit: e.target.value as any })}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
                >
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                  <option value="months">Months</option>
                </select>
              </div>
              {formData.sla_value && (
                <p className="mt-2 text-sm text-gray-600">
                  = {
                    formData.sla_unit === 'hours' ? parseFloat(formData.sla_value) * 60 :
                    formData.sla_unit === 'days' ? parseFloat(formData.sla_value) * 1440 :
                    formData.sla_unit === 'months' ? parseFloat(formData.sla_value) * 43200 :
                    parseFloat(formData.sla_value)
                  } minutes
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.name || !formData.customer_id || !formData.sla_value}
                className="flex-1 px-4 py-2.5 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#6366F1' }}
                onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#5558E3')}
                onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#6366F1')}
              >
                {loading ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
