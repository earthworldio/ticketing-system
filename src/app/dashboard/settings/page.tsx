'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/features/DashboardLayout'
import SettingsTabs from '@/components/features/settings/SettingsTabs'
import RolesTab from '@/components/features/settings/RolesTab'
import PermissionsTab from '@/components/features/settings/PermissionsTab'
import AssignmentsTab from '@/components/features/settings/AssignmentsTab'
import CustomersTab from '@/components/features/settings/CustomersTab'
import StatusTab from '@/components/features/settings/StatusTab'
import SettingsModal from '@/components/features/settings/SettingsModal'
import ConfirmModal from '@/components/features/settings/ConfirmModal'
import { Role, Permission, Customer, Status } from '@/types'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'roles' | 'permissions' | 'assignments' | 'customers' | 'statuses'>('roles')
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [showPermissionModal, setShowPermissionModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [showCustomerModal, setShowCustomerModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  
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
  const [editingAssignment, setEditingAssignment] = useState<any | null>(null)
  const [deletingAssignment, setDeletingAssignment] = useState<any | null>(null)
  const [deleteAssignmentLoading, setDeleteAssignmentLoading] = useState(false)

  /* Customers state */
  const [customers, setCustomers] = useState<Customer[]>([])
  const [customerLoading, setCustomerLoading] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null)
  const [deleteCustomerLoading, setDeleteCustomerLoading] = useState(false)

  /* Statuses state */
  const [statuses, setStatuses] = useState<Status[]>([])
  const [statusLoading, setStatusLoading] = useState(false)
  const [editingStatus, setEditingStatus] = useState<Status | null>(null)
  const [deletingStatus, setDeletingStatus] = useState<Status | null>(null)
  const [deleteStatusLoading, setDeleteStatusLoading] = useState(false)

  /* ========== ROLES HANDLERS ========== */
  
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

    await fetchRoles()
    setEditingRole(null)
  }

  const handleEditRole = (role: Role) => {
    setEditingRole(role)
    setShowRoleModal(true)
  }

  const handleDeleteClick = (role: Role) => {
    setDeletingRole(role)
  }

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

      await fetchRoles()
      setDeletingRole(null)
    } catch (error) {
      console.error('Failed to delete role:', error)
      alert('Failed to delete role')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleCloseRoleModal = () => {
    setShowRoleModal(false)
    setEditingRole(null)
  }

  /* ========== PERMISSIONS HANDLERS ========== */

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

    await fetchPermissions()
    setEditingPermission(null)
  }

  const handleEditPermission = (permission: Permission) => {
    setEditingPermission(permission)
    setShowPermissionModal(true)
  }

  const handleDeletePermissionClick = (permission: Permission) => {
    setDeletingPermission(permission)
  }

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

      await fetchPermissions()
      setDeletingPermission(null)
    } catch (error) {
      console.error('Failed to delete permission:', error)
      alert('Failed to delete permission')
    } finally {
      setDeletePermissionLoading(false)
    }
  }

  const handleClosePermissionModal = () => {
    setShowPermissionModal(false)
    setEditingPermission(null)
  }

  /* ========== ASSIGNMENTS HANDLERS ========== */

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

  const handleSaveAssignment = async (formData: { role_id: string; permission_ids?: string[]; permission_id?: string }) => {
    const isEdit = !!editingAssignment

    if (isEdit) {
      const url = `/api/role-permissions/${editingAssignment.id}`
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role_id: formData.role_id,
          permission_id: formData.permission_ids?.[0] || formData.permission_id
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || 'Failed to update assignment')
      }
    } else {
      const response = await fetch('/api/role-permissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role_id: formData.role_id,
          permission_ids: formData.permission_ids || []
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || 'Failed to assign permissions')
      }
    }

    await fetchAssignments()
    setEditingAssignment(null)
  }

  const handleEditAssignment = (assignment: any) => {
    setEditingAssignment(assignment)
    setShowAssignModal(true)
  }

  const handleDeleteAssignmentClick = (assignment: any) => {
    setDeletingAssignment(assignment)
  }

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

      await fetchAssignments()
      setDeletingAssignment(null)
    } catch (error) {
      console.error('Failed to delete assignment:', error)
      alert('Failed to delete assignment')
    } finally {
      setDeleteAssignmentLoading(false)
    }
  }

  const handleCloseAssignModal = () => {
    setShowAssignModal(false)
    setEditingAssignment(null)
  }

  /* ========== CUSTOMERS HANDLERS ========== */

  const fetchCustomers = async () => {
    setCustomerLoading(true)
    try {
      const response = await fetch('/api/customers')
      const data = await response.json()

      if (data.success) {
        setCustomers(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error)
    } finally {
      setCustomerLoading(false)
    }
  }

  const handleSaveCustomer = async (formData: { name: string; code: string }) => {
    const isEdit = !!editingCustomer
    const url = isEdit ? `/api/customers/${editingCustomer.id}` : '/api/customers'
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
      throw new Error(data.message || `Failed to ${isEdit ? 'update' : 'create'} customer`)
    }

    await fetchCustomers()
    setEditingCustomer(null)
  }

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer)
    setShowCustomerModal(true)
  }

  const handleDeleteCustomerClick = (customer: Customer) => {
    setDeletingCustomer(customer)
  }

  const handleConfirmDeleteCustomer = async () => {
    if (!deletingCustomer) return

    setDeleteCustomerLoading(true)
    try {
      const response = await fetch(`/api/customers/${deletingCustomer.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!data.success) {
        alert(data.message || 'Failed to delete customer')
        return
      }

      await fetchCustomers()
      setDeletingCustomer(null)
    } catch (error) {
      console.error('Failed to delete customer:', error)
      alert('Failed to delete customer')
    } finally {
      setDeleteCustomerLoading(false)
    }
  }

  const handleCloseCustomerModal = () => {
    setShowCustomerModal(false)
    setEditingCustomer(null)
  }

  /* ========== STATUSES HANDLERS ========== */

  const fetchStatuses = async () => {
    setStatusLoading(true)
    try {
      const response = await fetch('/api/statuses')
      const data = await response.json()
      
      if (data.success) {
        setStatuses(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch statuses:', error)
    } finally {
      setStatusLoading(false)
    }
  }

  const handleSaveStatus = async (formData: { name: string }) => {
    const isEdit = !!editingStatus
    const url = isEdit ? `/api/statuses/${editingStatus.id}` : '/api/statuses'
    const method = isEdit ? 'PUT' : 'POST'

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || 'Failed to save status')
      }

      fetchStatuses()
      handleCloseStatusModal()
    } catch (error: any) {
      alert(error.message)
    }
  }

  const handleEditStatus = (status: Status) => {
    setEditingStatus(status)
    setShowStatusModal(true)
  }

  const handleDeleteStatusClick = (id: string) => {
    const status = statuses.find(s => s.id === id)
    if (status) {
      setDeletingStatus(status)
    }
  }

  const handleConfirmDeleteStatus = async () => {
    if (!deletingStatus) return

    setDeleteStatusLoading(true)
    try {
      const response = await fetch(`/api/statuses/${deletingStatus.id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || 'Failed to delete status')
      }

      fetchStatuses()
      setDeletingStatus(null)
    } catch (error) {
      console.error('Failed to delete status:', error)
      alert('Failed to delete status')
    } finally {
      setDeleteStatusLoading(false)
    }
  }

  const handleCloseStatusModal = () => {
    setShowStatusModal(false)
    setEditingStatus(null)
  }

  /* ========== LOAD DATA ON TAB CHANGE ========== */

  useEffect(() => {
    if (activeTab === 'roles') {
      fetchRoles()
    } else if (activeTab === 'permissions') {
      fetchPermissions()
    } else if (activeTab === 'assignments') {
      fetchAssignments()
      fetchRoles()
      fetchPermissions()
    } else if (activeTab === 'customers') {
      fetchCustomers()
    } else if (activeTab === 'statuses') {
      fetchStatuses()
    }
  }, [activeTab])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
            <p className="text-sm text-gray-500 mt-1">Manage roles, permissions, access control and master data</p>
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
              onEditAssignment={handleEditAssignment}
              onDeleteAssignment={handleDeleteAssignmentClick}
            />
          )}
          {activeTab === 'customers' && (
            <CustomersTab
              customers={customers}
              loading={customerLoading}
              onCreateCustomer={() => setShowCustomerModal(true)}
              onEditCustomer={handleEditCustomer}
              onDeleteCustomer={handleDeleteCustomerClick}
            />
          )}
          {activeTab === 'statuses' && (
            <StatusTab
              statuses={statuses}
              loading={statusLoading}
              onCreateStatus={() => setShowStatusModal(true)}
              onEditStatus={handleEditStatus}
              onDeleteStatus={handleDeleteStatusClick}
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
          onClose={handleCloseAssignModal}
          title={editingAssignment ? 'Edit Assignment' : 'Assign Permission to Role'}
          type="assign"
          onSubmit={handleSaveAssignment}
          initialData={editingAssignment ? {
            id: editingAssignment.id,
            role_id: editingAssignment.role_id,
            permission_id: editingAssignment.permission_id
          } : undefined}
          roles={roles}
          permissions={permissions}
        />
        <SettingsModal
          isOpen={showCustomerModal}
          onClose={handleCloseCustomerModal}
          title={editingCustomer ? 'Edit Customer' : 'Create Customer'}
          type="customer"
          onSubmit={handleSaveCustomer}
          initialData={editingCustomer ? {
            id: editingCustomer.id,
            name: editingCustomer.name,
            code: editingCustomer.code
          } : undefined}
        />
        <SettingsModal
          isOpen={showStatusModal}
          onClose={handleCloseStatusModal}
          title={editingStatus ? 'Edit Status' : 'Create Status'}
          type="status"
          onSubmit={handleSaveStatus}
          initialData={editingStatus ? {
            id: editingStatus.id,
            name: editingStatus.name
          } : undefined}
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
        <ConfirmModal
          isOpen={!!deletingCustomer}
          onClose={() => setDeletingCustomer(null)}
          onConfirm={handleConfirmDeleteCustomer}
          title="Delete Customer"
          message={`Are you sure you want to delete "${deletingCustomer?.name}" (${deletingCustomer?.code})? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          isLoading={deleteCustomerLoading}
        />
        <ConfirmModal
          isOpen={!!deletingStatus}
          onClose={() => setDeletingStatus(null)}
          onConfirm={handleConfirmDeleteStatus}
          title="Delete Status"
          message={`Are you sure you want to delete "${deletingStatus?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          isLoading={deleteStatusLoading}
        />
      </div>
    </DashboardLayout>
  )
}
