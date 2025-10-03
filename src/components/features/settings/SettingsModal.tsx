'use client'

import { useState, useEffect } from 'react'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  type: 'role' | 'permission' | 'assign'
  onSubmit?: (data: any) => Promise<void>
  initialData?: { 
    id?: string
    name?: string
    description?: string | null
    role_id?: string
    permission_id?: string
  }
  roles?: Array<{ id: string; name: string }>
  permissions?: Array<{ id: string; name: string }>
}

export default function SettingsModal({ 
  isOpen, 
  onClose, 
  title, 
  type, 
  onSubmit, 
  initialData,
  roles = [],
  permissions = []
}: SettingsModalProps) {
  const [formData, setFormData] = useState({ name: '', description: '', role_id: '', permission_id: '' })
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fetchingPermissions, setFetchingPermissions] = useState(false)

  useEffect(() => {
    if (isOpen && initialData) {
      if (type === 'assign') {
        setFormData({
          name: '',
          description: '',
          role_id: initialData.role_id || '',
          permission_id: initialData.permission_id || ''
        })
        setSelectedPermissions(initialData.permission_id ? [initialData.permission_id] : [])
      } else {
        setFormData({
          name: initialData.name || '',
          description: initialData.description || '',
          role_id: '',
          permission_id: ''
        })
        setSelectedPermissions([])
      }
    } else if (!isOpen) {
      setFormData({ name: '', description: '', role_id: '', permission_id: '' })
      setSelectedPermissions([])
      setError('')
    }
  }, [isOpen, initialData, type])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (onSubmit) {
        if (type === 'assign') {
          // ส่ง role_id และ permission_ids (array)
          await onSubmit({ 
            role_id: formData.role_id, 
            permission_ids: selectedPermissions 
          })
        } else {
          await onSubmit({ name: formData.name, description: formData.description })
        }
        setFormData({ name: '', description: '', role_id: '', permission_id: '' })
        setSelectedPermissions([])
        onClose()
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    onClose()
  }

  // Fetch existing permissions when role is selected
  const handleRoleChange = async (roleId: string) => {
    setFormData({ ...formData, role_id: roleId })
    
    if (!roleId) {
      setSelectedPermissions([])
      return
    }

    if (initialData?.id) {
      return
    }

    setFetchingPermissions(true)
    
    try {
      const response = await fetch(`/api/role-permissions/role/${roleId}`)
      const data = await response.json()
      
      if (data.success && data.data) {
        const existingPermissionIds = data.data.map((item: any) => item.permission_id)
        setSelectedPermissions(existingPermissionIds)
      }
    } catch (error) {
      console.error('Failed to fetch role permissions:', error)
    } finally {
      setFetchingPermissions(false)
    }
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
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
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
          {type === 'assign' ? (
            /* Assign Permission Form */
            <>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  id="role"
                  required
                  value={formData.role_id}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  disabled={!!initialData?.id}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select a role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permissions <span className="text-red-500">*</span>
                </label>
                {fetchingPermissions ? (
                  <div className="border border-gray-300 rounded-lg p-3 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#6366F1]"></div>
                    <span className="ml-2 text-sm text-gray-500">Loading existing permissions...</span>
                  </div>
                ) : (
                  <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto">
                    {permissions.length === 0 ? (
                      <p className="text-sm text-gray-500">No permissions available</p>
                    ) : (
                    permissions.map((permission) => (
                      <label
                        key={permission.id}
                        className="flex items-center space-x-2 py-2 hover:bg-gray-50 px-2 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(permission.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPermissions([...selectedPermissions, permission.id])
                            } else {
                              setSelectedPermissions(selectedPermissions.filter(id => id !== permission.id))
                            }
                          }}
                          className="w-4 h-4 text-[#6366F1] border-gray-300 rounded focus:ring-[#6366F1]"
                        />
                        <span className="text-sm text-gray-900">{permission.name}</span>
                      </label>
                      ))
                    )}
                  </div>
                )}
                {selectedPermissions.length > 0 && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected: {selectedPermissions.length} permission(s)
                  </p>
                )}
              </div>
            </>
          ) : (
            /* Role/Permission Form */
            <>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
                  placeholder={`Enter ${type} name`}
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
                  placeholder={`Enter ${type} description (optional)`}
                />
              </div>
            </>
          )}

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
              disabled={loading || (type === 'assign' ? (!formData.role_id || selectedPermissions.length === 0) : !formData.name)}
              className="flex-1 px-4 py-2.5 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#6366F1' }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#5558E3')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#6366F1')}
            >
              {loading 
                ? (type === 'assign' ? 'Assigning...' : (isEditMode ? 'Updating...' : 'Creating...')) 
                : (type === 'assign' ? `Assign (${selectedPermissions.length})` : (isEditMode ? 'Update' : 'Create'))
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

