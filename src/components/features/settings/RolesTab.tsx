'use client'

import { Role } from '@/types'
import LoadingSpinner from '@/components/common/LoadingSpinner'

interface RolesTabProps {
  roles: Role[]
  loading: boolean
  onCreateRole: () => void
  onEditRole: (role: Role) => void
  onDeleteRole: (role: Role) => void
}

export default function RolesTab({ roles, loading, onCreateRole, onEditRole, onDeleteRole }: RolesTabProps) {
  
  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Roles</h2>
        <button
          onClick={onCreateRole}
          className="px-4 py-2 text-white rounded-lg font-medium text-sm flex items-center space-x-2 transition-colors"
          style={{ backgroundColor: '#6366F1' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5558E3')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#6366F1')}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Create Role</span>
        </button>
      </div>

      {/* Roles Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  <LoadingSpinner size='md'/>
                </td>
              </tr>
            ) : roles.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                  Get started by creating a role.
                </td>
              </tr>
            ) : (
              roles.map((role) => (
                <tr key={role.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{role.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {role.description || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => onEditRole(role)}
                      className="text-[#6366F1] hover:text-[#5558E3] mr-4 transition-colors border border-[#6366F1] rounded-lg px-2 py-1"
                      style={{ cursor: 'pointer' }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => onDeleteRole(role)}
                      className="text-red-600 hover:text-red-800 transition-colors border border-red-600 rounded-lg px-2 py-1"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
