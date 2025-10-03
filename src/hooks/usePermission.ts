/* Custom Hook for Permission Checking */

import { useEffect, useState } from 'react'

export function usePermission() {
  const [permissions, setPermissions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserPermissions = async () => {
      try {
        const token = localStorage.getItem('token')
        const userData = localStorage.getItem('user')
        
        if (!token || !userData) {
          setPermissions([])
          setLoading(false)
          return
        }

        const user = JSON.parse(userData)
        
        if (user.role_id) {
          const response = await fetch(`/api/role-permissions/role/${user.role_id}`, {
            headers: {
              'Cache-Control': 'no-cache',
            }
          })
          const data = await response.json()
          
          
          if (data.success && data.data) {
            const permissionNames = data.data
              .filter((item: any) => item.is_active !== false)
              .map((item: any) => item.name || item.permission_name)
            setPermissions(permissionNames)
          }
        }
      } catch (error) {
        console.error('Failed to fetch permissions:', error)
        setPermissions([])
      } finally {
        setLoading(false)
      }
    }

    fetchUserPermissions()
  }, [])

  /**
   * Check if user has a specific permission
   * @param permission - Permission name (e.g., 'project-create', 'ticket-read')
   * @returns true if user has the permission
   */
  const hasPermission = (permission: string): boolean => {
    return permissions.includes(permission)
  }

  /**
   * Check if user has any of the specified permissions
   * @param permissionList - Array of permission names
   * @returns true if user has at least one permission
   */
  const hasAnyPermission = (permissionList: string[]): boolean => {
    return permissionList.some(permission => permissions.includes(permission))
  }

  /**
   * Check if user has all of the specified permissions
   * @param permissionList - Array of permission names
   * @returns true if user has all permissions
   */
  const hasAllPermissions = (permissionList: string[]): boolean => {
    return permissionList.every(permission => permissions.includes(permission))
  }

  return {
    permissions,
    loading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions
  }
}

