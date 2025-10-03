'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/features/DashboardLayout'
import SettingsTabs from '@/components/features/settings/SettingsTabs'
import RolesTab from '@/components/features/settings/RolesTab'
import PermissionsTab from '@/components/features/settings/PermissionsTab'
import AssignmentsTab from '@/components/features/settings/AssignmentsTab'
import SettingsModal from '@/components/features/settings/SettingsModal'
import ConfirmModal from '@/components/features/settings/ConfirmModal'
import { Role, Permission } from '@/types'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'roles' | 'permissions' | 'assignments'>('roles')
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [showPermissionModal, setShowPermissionModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  
  /* Roles state */
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [deletingRole, setDeletingRole] = useState<Role | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  /* Permissions state */
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [permissionLoading, setPermissionLoading] = useState(false)
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null)
  const [deletingPermission, setDeletingPermission] = useState<Permission | null>(null)
  const [deletePermissionLoading, setDeletePermissionLoading] = useState(false)

  /* Assignments state */
  const [assignments, setAssignments] = useState<any[]>([])
  const [assignmentLoading, setAssignmentLoading] = useState(false)
  const [deletingAssignment, setDeletingAssignment] = useState<any | null>(null)
  const [deleteAssignmentLoading, setDeleteAssignmentLoading] = useState(false)

  /* Fetch roles */
  const fetchRoles = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/roles')
      const data = await response.json()
      
      if (data.success) {
        setRoles(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch roles:', error)
    } finally {
      setLoading(false)
    }
  }

  /* Create or Update role */
  const handleSaveRole = async (formData: { name: string; description: string }) => {
    const isEdit = !!editingRole
    const url = isEdit ? `/api/roles/${editingRole.id}` : '/api/roles'
    const method = isEdit ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.message || `Failed to ${isEdit ? 'update' : 'create'} role`)
    }

    // Refresh roles list
    await fetchRoles()
    setEditingRole(null)
  }

  /* Handle edit click */
  const handleEditRole = (role: Role) => {
    setEditingRole(role)
    setShowRoleModal(true)
  }

  /* Handle delete click */
  const handleDeleteClick = (role: Role) => {
    setDeletingRole(role)
  }

  /* Confirm delete */
  const handleConfirmDelete = async () => {
    if (!deletingRole) return

    setDeleteLoading(true)
    try {
      const response = await fetch(`/api/roles/${deletingRole.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!data.success) {
        alert(data.message || 'Failed to delete role')
        return
      }

      // Refresh roles list
      await fetchRoles()
      setDeletingRole(null)
    } catch (error) {
      console.error('Failed to delete role:', error)
      alert('Failed to delete role')
    } finally {
      setDeleteLoading(false)
    }
  }

  /* Close modal and reset editing state */
  const handleCloseRoleModal = () => {
    setShowRoleModal(false)
    setEditingRole(null)
  }

  /* Permission handlers */

  const fetchPermissions = async () => {
    setPermissionLoading(true)
    try {
      const response = await fetch('/api/permissions')
      const data = await response.json()
      
      if (data.success) {
        setPermissions(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch permissions:', error)
    } finally {
      setPermissionLoading(false)
    }
  }

  /* Create or Update permission */
  const handleSavePermission = async (formData: { name: string; description: string }) => {
    const isEdit = !!editingPermission
    const url = isEdit ? `/api/permissions/${editingPermission.id}` : '/api/permissions'
    const method = isEdit ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.message || `Failed to ${isEdit ? 'update' : 'create'} permission`)
    }

    // Refresh permissions list
    await fetchPermissions()
    setEditingPermission(null)
  }

  /* Handle edit click */
  const handleEditPermission = (permission: Permission) => {
    setEditingPermission(permission)
    setShowPermissionModal(true)
  }

  /* Handle delete click */
  const handleDeletePermissionClick = (permission: Permission) => {
    setDeletingPermission(permission)
  }

  /* Confirm delete */
  const handleConfirmDeletePermission = async () => {
    if (!deletingPermission) return

    setDeletePermissionLoading(true)
    try {
      const response = await fetch(`/api/permissions/${deletingPermission.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!data.success) {
        alert(data.message || 'Failed to delete permission')
        return
      }

      // Refresh permissions list
      await fetchPermissions()
      setDeletingPermission(null)
    } catch (error) {
      console.error('Failed to delete permission:', error)
      alert('Failed to delete permission')
    } finally {
      setDeletePermissionLoading(false)
    }
  }

  /* Close modal and reset editing state */
  const handleClosePermissionModal = () => {
    setShowPermissionModal(false)
    setEditingPermission(null)
  }

  /* === ASSIGNMENT HANDLERS === */

  /* Fetch assignments */
  const fetchAssignments = async () => {
    setAssignmentLoading(true)
    try {
      const response = await fetch('/api/role-permissions')
      const data = await response.json()
      
      if (data.success) {
        setAssignments(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch assignments:', error)
    } finally {
      setAssignmentLoading(false)
    }
  }

  /* Assign permission to role */
  const handleAssignPermission = async (formData: { role_id: string; permission_id: string }) => {
    const response = await fetch('/api/role-permissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.message || 'Failed to assign permission')
    }

    /* Refresh assignments list */
    await fetchAssignments()
  }

  /* Handle delete assignment click */
  const handleDeleteAssignmentClick = (assignment: any) => {
    setDeletingAssignment(assignment)
  }

  /* Confirm delete assignment */
  const handleConfirmDeleteAssignment = async () => {
    if (!deletingAssignment) return

    setDeleteAssignmentLoading(true)
    try {
      const response = await fetch(`/api/role-permissions/${deletingAssignment.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!data.success) {
        alert(data.message || 'Failed to delete assignment')
        return
      }

      /* Refresh assignments list */
      await fetchAssignments()
      setDeletingAssignment(null)
    } catch (error) {
      console.error('Failed to delete assignment:', error)
      alert('Failed to delete assignment')
    } finally {
      setDeleteAssignmentLoading(false)
    }
  }

  /* Load data on mount and when tab changes */
  useEffect(() => {
    if (activeTab === 'roles') {
      fetchRoles()
    } else if (activeTab === 'permissions') {
      fetchPermissions()
    } else if (activeTab === 'assignments') {
      fetchAssignments()
      /* Also load roles and permissions for dropdowns */
      fetchRoles()
      fetchPermissions()
    }
  }, [activeTab])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
            <p className="text-sm text-gray-500 mt-4">Manage roles, permissions and access control</p>
          </div>
        </div>

        {/* Tabs */}
        <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {activeTab === 'roles' && (
            <RolesTab 
              roles={roles}
              loading={loading}
              onCreateRole={() => setShowRoleModal(true)}
              onEditRole={handleEditRole}
              onDeleteRole={handleDeleteClick}
            />
          )}
          {activeTab === 'permissions' && (
            <PermissionsTab 
              permissions={permissions}
              loading={permissionLoading}
              onCreatePermission={() => setShowPermissionModal(true)}
              onEditPermission={handleEditPermission}
              onDeletePermission={handleDeletePermissionClick}
            />
          )}
          {activeTab === 'assignments' && (
            <AssignmentsTab 
              assignments={assignments}
              loading={assignmentLoading}
              onAssignPermission={() => setShowAssignModal(true)}
              onDeleteAssignment={handleDeleteAssignmentClick}
            />
          )}
        </div>

        {/* Modals */}
        <SettingsModal
          isOpen={showRoleModal}
          onClose={handleCloseRoleModal}
          title={editingRole ? 'Edit Role' : 'Create Role'}
          type="role"
          onSubmit={handleSaveRole}
          initialData={editingRole ? {
            id: editingRole.id,
            name: editingRole.name,
            description: editingRole.description || undefined
          } : undefined}
        />
        <SettingsModal
          isOpen={showPermissionModal}
          onClose={handleClosePermissionModal}
          title={editingPermission ? 'Edit Permission' : 'Create Permission'}
          type="permission"
          onSubmit={handleSavePermission}
          initialData={editingPermission ? {
            id: editingPermission.id,
            name: editingPermission.name,
            description: editingPermission.description || undefined
          } : undefined}
        />
        <SettingsModal
          isOpen={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          title="Assign Permission to Role"
          type="assign"
          onSubmit={handleAssignPermission}
          roles={roles}
          permissions={permissions}
        />

        {/* Delete Confirmation Modals */}
        <ConfirmModal
          isOpen={!!deletingRole}
          onClose={() => setDeletingRole(null)}
          onConfirm={handleConfirmDelete}
          title="Delete Role"
          message={`Are you sure you want to delete "${deletingRole?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          isLoading={deleteLoading}
        />

        <ConfirmModal
          isOpen={!!deletingPermission}
          onClose={() => setDeletingPermission(null)}
          onConfirm={handleConfirmDeletePermission}
          title="Delete Permission"
          message={`Are you sure you want to delete "${deletingPermission?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          isLoading={deletePermissionLoading}
        />

        <ConfirmModal
          isOpen={!!deletingAssignment}
          onClose={() => setDeletingAssignment(null)}
          onConfirm={handleConfirmDeleteAssignment}
          title="Remove Assignment"
          message={`Are you sure you want to remove "${deletingAssignment?.permission_name}" from "${deletingAssignment?.role_name}"?`}
          confirmText="Remove"
          cancelText="Cancel"
          isLoading={deleteAssignmentLoading}
        />
      </div>
    </DashboardLayout>
  )
}


