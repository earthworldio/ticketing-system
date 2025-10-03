'use client'

import LoadingSpinner from '@/components/common/LoadingSpinner'
import { Status } from '@/types'

interface StatusTabProps {
  statuses: Status[]
  loading: boolean
  onCreateStatus: () => void
  onEditStatus: (status: Status) => void
  onDeleteStatus: (id: string) => void
}

export default function StatusTab({
  statuses,
  loading,
  onCreateStatus,
  onEditStatus,
  onDeleteStatus
}: StatusTabProps) {
  return (
    <div className="space-y-4">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Status Management</h3>
        <button
          onClick={onCreateStatus}
          className="px-4 py-2 text-white rounded-lg font-medium text-sm flex items-center space-x-2 transition-colors"
          style={{ backgroundColor: '#6366F1' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5558E3')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#6366F1')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Create Status</span>
        </button>
      </div>

      {/* Statuses Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={3} className="px-6 py-8">
                  <LoadingSpinner size="md" />
                </td>
              </tr>
            ) : statuses.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                  No statuses found. Create your first status to get started.
                </td>
              </tr>
            ) : (
              statuses.map((status) => (
                <tr key={status.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{status.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(status.created_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    <button
                      onClick={() => onEditStatus(status)}
                      className="text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: '#6366F1' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteStatus(status.id)}
                      className="text-white bg-red-600 px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors"
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

