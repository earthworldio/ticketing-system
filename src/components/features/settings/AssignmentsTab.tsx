'use client'

import React from 'react'
import LoadingSpinner from '@/components/common/LoadingSpinner'

interface Assignment {
  id: string
  role_id: string
  permission_id: string
  role_name: string
  permission_name: string
  is_active: boolean
  created_date: Date
}

interface AssignmentsTabProps {
  assignments: Assignment[]
  loading: boolean
  onAssignPermission: () => void
  onEditAssignment: (assignment: Assignment) => void
  onDeleteAssignment: (assignment: Assignment) => void
}

export default function AssignmentsTab({ 
  assignments, 
  loading, 
  onAssignPermission,
  onEditAssignment, 
  onDeleteAssignment 
}: AssignmentsTabProps) {
  
  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // จัดกลุ่มตาม role
  const groupedAssignments = assignments.reduce((groups: any, assignment) => {
    const roleName = assignment.role_name
    if (!groups[roleName]) {
      groups[roleName] = []
    }
    groups[roleName].push(assignment)
    return groups
  }, {})

  // เรียงลำดับ role names
  const sortedRoleNames = Object.keys(groupedAssignments).sort()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Role-Permission Assignments</h2>
        <button
          onClick={onAssignPermission}
          className="px-4 py-2 text-white rounded-lg font-medium text-sm flex items-center space-x-2 transition-colors"
          style={{ backgroundColor: '#6366F1' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5558E3')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#6366F1')}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <span>Assign Permission to Role</span>
        </button>
      </div>

      {/* Assignments Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Permission
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  <LoadingSpinner size='md'/>
                </td>
              </tr>
            ) : assignments.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                  Get started by assigning a permission to a role.
                </td>
              </tr>
            ) : (
              sortedRoleNames.map((roleName) => (
                <React.Fragment key={roleName}>
                  {/* Role Header */}
                  <tr className='border-b border-gray-200'>
                    <td colSpan={4} className="px-6 py-3">
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-sm font-semibold text-gray-900">{roleName}</span>
                        <span className="text-xs text-gray-500">
                          ({groupedAssignments[roleName].length} permission{groupedAssignments[roleName].length > 1 ? 's' : ''})
                        </span>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Permissions for this Role */}
                  {groupedAssignments[roleName].map((assignment: Assignment, idx: number) => (
                    <tr 
                      key={assignment.id} 
                      className={`${idx === groupedAssignments[roleName].length - 1 ? 'border-b border-gray-200' : ''}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap pl-12">
                        <div className="text-sm text-gray-500">└</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{assignment.permission_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          assignment.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {assignment.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => onEditAssignment(assignment)}
                          className="text-[#6366F1] hover:text-[#5558E3] mr-4 transition-colors border border-[#6366F1] rounded-lg px-2 py-1"
                          style={{ cursor: 'pointer' }}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => onDeleteAssignment(assignment)}
                          className="text-red-600 hover:text-red-800 transition-colors border border-red-600 rounded-lg px-2 py-1"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
