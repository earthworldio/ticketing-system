'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/features/DashboardLayout'
import DeleteTicketModal from '@/components/features/DeleteTicketModal'
import DeleteFileModal from '@/components/features/DeleteFileModal'
import { TicketWithRelations, TicketFileWithUploader, User } from '@/types'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function TicketDetailPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [ticket, setTicket] = useState<TicketWithRelations | null>(null)
  const [files, setFiles] = useState<TicketFileWithUploader[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [showFileModal, setShowFileModal] = useState(false)
  const [showDescriptionModal, setShowDescriptionModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDeleteFileModal, setShowDeleteFileModal] = useState(false)
  const [assignLoading, setAssignLoading] = useState(false)
  const [selectedOwner, setSelectedOwner] = useState('')
  const [editedDescription, setEditedDescription] = useState('')
  const [deletingFile, setDeletingFile] = useState<TicketFileWithUploader | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/')
      return
    }

    setMounted(true)
    fetchTicketDetail()
    fetchTicketFiles()
    fetchUsers()
  }, [resolvedParams.id])

  const fetchTicketDetail = async () => {
    try {
      const response = await fetch(`/api/tickets/${resolvedParams.id}`)
      const data = await response.json()
      
      if (data.success) {
        setTicket(data.data)
        setSelectedOwner(data.data.owner || '')
        setEditedDescription(data.data.description || '')
      }
    } catch (error) {
      console.error('Failed to fetch ticket:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTicketFiles = async () => {
    try {
      const response = await fetch(`/api/ticket-files?ticket_id=${resolvedParams.id}`)
      const data = await response.json()
      
      if (data.success) {
        setFiles(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch files:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      const data = await response.json()
      if (data.success) {
        setUsers(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }

  const handleAssignTicket = async () => {
    if (!selectedOwner) return

    setAssignLoading(true)
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      const response = await fetch(`/api/tickets/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          owner: selectedOwner,
          updated_by: userData.id
        }),
      })

      const data = await response.json()
      if (data.success) {
        setShowAssignModal(false)
        fetchTicketDetail()
      }
    } catch (error) {
      console.error('Failed to assign ticket:', error)
    } finally {
      setAssignLoading(false)
    }
  }

  const handleUpdateDescription = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      const response = await fetch(`/api/tickets/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: editedDescription,
          updated_by: userData.id
        }),
      })

      const data = await response.json()
      if (data.success) {
        setShowDescriptionModal(false)
        fetchTicketDetail()
      }
    } catch (error) {
      console.error('Failed to update description:', error)
    }
  }

  const handleFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const file = formData.get('file') as File

    if (!file) return

    try {
      // Step 1: Upload file to server
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      const uploadData = await uploadResponse.json()
      
      if (!uploadData.success) {
        throw new Error(uploadData.message || 'Failed to upload file')
      }

      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      const response = await fetch('/api/ticket-files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ticket_id: resolvedParams.id,
          file_name: uploadData.data.filename,
          file_path: uploadData.data.filepath,
          file_size: uploadData.data.size,
          file_type: uploadData.data.type,
          uploaded_by: userData.id
        }),
      })

      const data = await response.json()
      if (data.success) {
        form.reset()
        setShowFileModal(false)
        fetchTicketFiles()
      }
    } catch (error: any) {
      console.error('Failed to upload file:', error)
      alert(error.message || 'Failed to upload file')
    }
  }

  const formatFileSize = (bytes?: number | null) => {
    if (!bytes) return 'Unknown'
    const kb = bytes / 1024
    if (kb < 1024) return `${kb.toFixed(1)} KB`
    return `${(kb / 1024).toFixed(1)} MB`
  }

  const formatDate = (date: Date | string) => {
    const d = new Date(date)
    return d.toLocaleDateString('th-TH', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleDeleteTicket = async () => {
    try {
      const response = await fetch(`/api/tickets/${resolvedParams.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to delete ticket')
      }

      // Redirect back to project detail page
      const projectId = localStorage.getItem('project_id')
      if (projectId) {
        router.push(`/dashboard/projects/${projectId}`)
      } else {
        router.push('/dashboard')
      }
    } catch (error: any) {
      console.error('Failed to delete ticket:', error)
      alert(error.message || 'Failed to delete ticket')
    }
  }

  const handleDeleteFileClick = (file: TicketFileWithUploader) => {
    setDeletingFile(file)
    setShowDeleteFileModal(true)
  }

  const handleConfirmDeleteFile = async () => {
    if (!deletingFile) return

    try {
      const response = await fetch(`/api/ticket-files/${deletingFile.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to delete file')
      }

      // Refresh files list
      await fetchTicketFiles()
      setDeletingFile(null)
    } catch (error: any) {
      console.error('Failed to delete file:', error)
      alert(error.message || 'Failed to delete file')
    }
  }

  if (!mounted || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6366F1]"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!ticket) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-500">Ticket not found</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Ticket</h1>
        </div>

        {/* Ticket Header Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className='flex items-center gap-2'>
                <div className='bg-[#6366F1] border border-[#6366F1] w-45 h-6 rounded-sm flex items-center justify-center text-xs font-semibold'>
                  <span className="text-lg font-semibold" style={{ color: 'white' }}>
                    {ticket.ticket_number || `#${ticket.id.substring(0, 8)}`} 
                  </span>


                </div>        
                <span className="text-md text-black font-medium">{ticket.name}</span>
              </div>
            </div>
            
            <div className="flex gap-2 items-center">
              <span className="px-4 py-2 bg-[#6366F1] text-white text-xs font-medium rounded-lg">
                {ticket.status_name || ''}
              </span>
              
              {/* Delete Button */}
              <button
                onClick={() => setShowDeleteModal(true)}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete Ticket"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500  mb-3" >This ticket was created at : {formatDate(ticket.created_date)}</p>
           <div>
           
           <div className='flex items-end justify-between mb-3'>
             <h3 className="mt-5 text-base font-semibold text-gray-900">Ticket description</h3>
             <button
               onClick={() => {
                 setEditedDescription(ticket.description || '')
                 setShowDescriptionModal(true)
               }}
               className="border border-[#6366F1] 
               px-4 py-1.25 bg-white text-[#6366F1] rounded-lg hover:bg-[#5558E3] hover:text-white transition-colors font-medium text-sm"
              >
               Edit Description
             </button>
           </div>

           <p className="text-sm text-gray-600 leading-relaxed mb-4">
             {ticket.description || 'Please add a description for this ticket'}
           </p>
           
           <div className='flex items-end justify-between mb-3'>
             <h3 className="mt-6 text-base font-semibold text-gray-900">Assign to</h3>
             <button
               onClick={() => setShowAssignModal(true)}
               className="border border-[#6366F1] px-4 py-1.25  
               text-[#6366F1] rounded-lg hover:bg-[#5558E3] hover:text-white transition-colors font-medium text-sm"
             >
               Assign ticket
             </button>
           </div>
          {ticket.owner ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#6366F1] flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {ticket.owner_first_name?.charAt(0)}{ticket.owner_last_name?.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {ticket.owner_first_name} {ticket.owner_last_name}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Please assign this ticket to a user</p>
          )}
          </div>
           <div className='mt-6 flex items-end justify-between mb-3'>
             <h3 className="mt-5 text-base font-semibold text-gray-900">Files</h3>
             <button
               onClick={() => setShowFileModal(true)}
               
               className="border border-[#6366F1] px-4 py-1.25  text-[#6366F1] rounded-lg 
               hover:bg-[#5558E3] hover:text-white transition-colors font-medium text-sm"
             >
               Add File
             </button>
           </div>
           
           {files.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="relative flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      handleDeleteFileClick(file)
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                    title="Delete file"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  {/* File Link */}
                  <a
                    href={file.file_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center w-full cursor-pointer"
                  >
                    <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs font-medium text-gray-900 text-center truncate w-full" title={file.file_name}>
                      {file.file_name}
                    </p>
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 text-xs">No files uploaded yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Description Modal */}
      {showDescriptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowDescriptionModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Edit Description</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                rows={6}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent resize-none"
                placeholder="Enter ticket description..."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDescriptionModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateDescription}
                className="flex-1 px-4 py-2.5 bg-[#6366F1] text-white rounded-lg hover:bg-[#5558E3] transition-colors font-medium"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowAssignModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Assign Ticket</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Owner</label>
              <select
                value={selectedOwner}
                onChange={(e) => setSelectedOwner(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
              >
                <option value="">Select user</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.first_name} {user.last_name} ({user.email})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAssignModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignTicket}
                disabled={!selectedOwner || assignLoading}
                className="flex-1 px-4 py-2.5 bg-[#6366F1] text-white rounded-lg hover:bg-[#5558E3] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {assignLoading ? 'Assigning...' : 'Assign'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File Upload Modal */}
      {showFileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowFileModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Add File</h3>
            <form onSubmit={handleFileUpload}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select File</label>
                <input
                  type="file"
                  name="file"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#6366F1] file:text-white hover:file:bg-[#5558E3] file:cursor-pointer"
                />
                <p className="mt-2 text-xs text-gray-500">Maximum file size: 10MB</p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowFileModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-[#6366F1] text-white rounded-lg hover:bg-[#5558E3] transition-colors font-medium"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Ticket Modal */}
      <DeleteTicketModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteTicket}
        ticketName={ticket?.name || ''}
        ticketNumber={ticket?.ticket_number}
      />

      {/* Delete File Modal */}
      <DeleteFileModal
        isOpen={showDeleteFileModal}
        onClose={() => {
          setShowDeleteFileModal(false)
          setDeletingFile(null)
        }}
        onConfirm={handleConfirmDeleteFile}
        fileName={deletingFile?.file_name || ''}
      />
    </DashboardLayout>
  )
}

