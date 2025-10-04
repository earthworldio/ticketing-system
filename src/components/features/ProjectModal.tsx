'use client'

import { useState, useEffect } from 'react'
import { Customer } from '@/types'

interface ProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => Promise<void>
}

interface SLAInput {
  id: string
  name: string
  value: string
  unit: 'minutes' | 'hours' | 'days' | 'months'
}

export default function ProjectModal({ isOpen, onClose, onSubmit }: ProjectModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    customer_id: '',
    start_date: '',
    end_date: ''
  })
  const [slaInputs, setSlaInputs] = useState<SLAInput[]>([
    { id: '1', name: '', value: '', unit: 'hours' }
  ])
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
        end_date: ''
      })
      setSlaInputs([{ id: '1', name: '', value: '', unit: 'hours' }])
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

  const addSLAInput = () => {
    setSlaInputs([
      ...slaInputs,
      { id: Date.now().toString(), name: '', value: '', unit: 'hours' }
    ])
  }

  const removeSLAInput = (id: string) => {
    if (slaInputs.length > 1) {
      setSlaInputs(slaInputs.filter(sla => sla.id !== id))
    }
  }

  const updateSLAInput = (id: string, field: keyof SLAInput, value: string) => {
    setSlaInputs(slaInputs.map(sla => 
      sla.id === id ? { ...sla, [field]: value } : sla
    ))
  }

  const convertToMinutes = (value: number, unit: string): number => {
    switch (unit) {
      case 'hours':
        return value * 60
      case 'days':
        return value * 1440
      case 'months':
        return value * 43200
      default:
        return value
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validate SLA inputs
      const validSLAs = slaInputs.filter(sla => sla.name.trim() && sla.value.trim())
      
      if (validSLAs.length === 0) {
        throw new Error('Please add at least one SLA')
      }

      // Step 1: Create all SLA records
      const slaIds: string[] = []
      
      for (const sla of validSLAs) {
        const minutes = convertToMinutes(parseFloat(sla.value), sla.unit)
        
        const slaResponse = await fetch('/api/sla', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: sla.name,
            resolve_time: minutes
          }),
        })

        const slaData = await slaResponse.json()

        if (!slaData.success) {
          throw new Error(slaData.message || 'Failed to create SLA')
        }

        slaIds.push(slaData.data.id)
      }

      // Step 2: Create project (without sla_id since we're using junction table)
      const token = localStorage.getItem('token')
      const projectResponse = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          code: formData.code || null,
          description: formData.description || null,
          customer_id: formData.customer_id,
          start_date: formData.start_date || null,
          end_date: formData.end_date || null
        }),
      })

      const projectData = await projectResponse.json()

      if (!projectData.success) {
        throw new Error(projectData.message || 'Failed to create project')
      }

      // Step 3: Assign SLAs to project via junction table
      const assignResponse = await fetch('/api/project-sla', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_id: projectData.data.id,
          sla_ids: slaIds
        }),
      })

      const assignData = await assignResponse.json()

      if (!assignData.success) {
        throw new Error(assignData.message || 'Failed to assign SLAs')
      }

      // Reset form
      setFormData({
        name: '',
        code: '',
        description: '',
        customer_id: '',
        start_date: '',
        end_date: ''
      })
      setSlaInputs([{ id: '1', name: '', value: '', unit: 'hours' }])
      onClose()
      
      // Refresh the page to show new project
      window.location.reload()
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
                  Contact Code
                </label>
                <input
                  type="text"
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
                  placeholder="Contact code"
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

            {/* SLA (Service Level Agreement) - Multiple */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  SLA - Resolve Time <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={addSLAInput}
                  className="border border-[#6366F1] text-[#6366F1] hover:text-[#5558E3] mr-4 transition-colors flex items-center gap-1 px-3 py-1 text-sm font-medium hover:bg-[#6366F1]/10 rounded-lg transition-colors"
                  style={{ cursor: 'pointer' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add SLA
                </button>
              </div>
              
              <div className="space-y-3">
                {slaInputs.map((sla, index) => (
                  <div key={sla.id} className="flex gap-2 items-start p-3 border border-gray-200 rounded-lg">
                    <div className="flex-1 space-y-2">
                      {/* SLA Name */}
                      <input
                        type="text"
                        required
                        value={sla.name}
                        onChange={(e) => updateSLAInput(sla.id, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent text-sm"
                        placeholder="SLA Name ( Critical Response )"
                      />
                      
                      {/* Value and Unit */}
                      <div className="flex gap-2">
                        <input
                          type="number"
                          required
                          min="1"
                          step="1"
                          value={sla.value}
                          onChange={(e) => updateSLAInput(sla.id, 'value', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent text-sm"
                          placeholder="Value"
                        />
                        <select
                          value={sla.unit}
                          onChange={(e) => updateSLAInput(sla.id, 'unit', e.target.value as any)}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent text-sm"
                        >
                          <option value="minutes">Minutes</option>
                          <option value="hours">Hours</option>
                          <option value="days">Days</option>
                          <option value="months">Months</option>
                        </select>
                      </div>
                      
                      {/* Show minutes conversion */}
                      {sla.value && (
                        <p className="text-xs text-gray-600">
                          = {convertToMinutes(parseFloat(sla.value), sla.unit)} minutes
                        </p>
                      )}
                    </div>
                    
                    {/* Remove button */}
                    {slaInputs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSLAInput(sla.id)}
                        className="mt-1 text-red-500 hover:text-red-700 transition-colors"
                        title="Remove SLA"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
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
                disabled={loading || !formData.name || !formData.customer_id || slaInputs.every(sla => !sla.name || !sla.value)}
                className="flex-1 px-4 py-2.5 text-white rounded-lg font-medium transition-colors disabled:opacity-80 disabled:cursor-not-allowed"
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
