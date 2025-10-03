'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/features/DashboardLayout'
import ProjectModal from '@/components/features/ProjectModal'
import Image from 'next/image'
import { Project } from '@/types'

interface Ticket {
  id: string
  title: string
  description: string
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed'
  priority: 'Low' | 'Medium' | 'High'
  category: string
  date: string
}


const mockTickets: Ticket[] = [
  {
    id: 'TKT101',
    title: 'VPN connection keeps dropping every 5 minutes',
    description: 'VPN connection keeps dropping every 5 minutes',
    status: 'In Progress',
    priority: 'High',
    category: 'Network & VPN',
    date: '9/27/2025'
  },
  {
    id: 'TKT102',
    title: 'Need Microsoft Office 365 installed on new laptop',
    description: 'Need Microsoft Office 365 installed on new laptop',
    status: 'Open',
    priority: 'Medium',
    category: 'Software Installation',
    date: '9/28/2025'
  },
  {
    id: 'TKT103',
    title: 'Cannot access shared drive after password reset',
    description: 'Cannot access shared drive after password reset',
    status: 'Resolved',
    priority: 'High',
    category: 'Account & Access',
    date: '9/26/2025'
  },
  {
    id: 'TKT104',
    title: 'Keyboard keys not responding properly',
    description: 'Keyboard keys not responding properly',
    status: 'Open',
    priority: 'Low',
    category: 'Hardware Issues',
    date: '9/28/2025'
  }
]

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [loadingProjects, setLoadingProjects] = useState(false)
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets)
  const [projectCreators, setProjectCreators] = useState<Record<string, any>>({})

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.push('/')
      return
    }

    setLoading(false)
    fetchProjects()
  }, [router])

  /* Fetch projects */
  const fetchProjects = async () => {
    setLoadingProjects(true)
    try {
      const response = await fetch('/api/projects')
      const data = await response.json()

      if (data.success) {
        setProjects(data.data)
        
        // Fetch creator info for each project
        const creators: Record<string, any> = {}
        for (const project of data.data) {
          if (project.created_by && !creators[project.created_by]) {
            try {
              const userResponse = await fetch(`/api/users/${project.created_by}`)
              const userData = await userResponse.json()
              if (userData.success) {
                creators[project.created_by] = userData.data
              }
            } catch (error) {
              console.error(`Failed to fetch creator info for ${project.created_by}:`, error)
            }
          }
        }
        setProjectCreators(creators)
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setLoadingProjects(false)
    }
  }

  /* Handle create project */
  const handleCreateProject = async (projectData: any) => {
    try {
      // Get token for authentication
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Authentication required')
      }

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(projectData),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || 'Failed to create project')
      }

      // Refresh projects list
      await fetchProjects()
    } catch (error: any) {
      console.error('Failed to create project:', error)
      throw error
    }
  }

  /* Format date */
  const formatDate = (dateString: Date | string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    })
  }

  /* Format SLA */
  const formatSLA = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} Minutes`
    } else if (minutes < 1440) {
      const hours = Math.floor(minutes / 60)
      return `${hours} Hours`
    } else if (minutes < 43200) {
      const days = Math.floor(minutes / 1440)
      return `${days} Days`
    } else {
      const months = Math.floor(minutes / 43200)
      return `${months} Months`
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      {/* Content Area */}
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">Project</h1>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* New Project Button */}
            <button
              onClick={() => setShowProjectModal(true)}
              className="px-4 py-2 text-white rounded-lg font-medium text-sm flex items-center space-x-2 transition-colors"
              style={{ backgroundColor: '#6366F1' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5558E3')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#6366F1')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>New Project</span>
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 py-4 px-4 bg-white rounded-2xl border border-gray-300">
          {/* Search - Full width on mobile, left on desktop */}
          <div className="relative w-full md:flex-1 order-2 md:order-1">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search for project"
              className="text-black w-full md:w-1/2 pl-10 pr-4 py-2.5 
              border border-gray-300 rounded-lg text-sm text-gray-600 
              placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
            />
          </div>

          {/* Filters - 50/50 on mobile, auto on desktop */}
          <div className="flex gap-3 w-full md:w-auto order-1 md:order-2">
            {/* Select Priority Dropdown */}
            <select className="flex-1 md:flex-none px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#6366F1] bg-white">
              <option>Select Priority</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>

            {/* This Week Dropdown */}
            <select className="flex-1 md:flex-none px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#6366F1] bg-white">
              <option>This Week</option>
              <option>Today</option>
              <option>This Month</option>
              <option>All Time</option>
            </select>
          </div>
        </div>

        {/* All Projects Tab */}
        <div className="border-b border-gray-200">
          <button
            className="pb-3 text-sm font-medium flex items-center space-x-2"
            style={{ color: '#6366F1', borderBottom: '2px solid #6366F1' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>All Projects</span>
          </button>
        </div>

        {/* Projects List or Empty State */}
        {loadingProjects ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6366F1]"></div>
            <span className="ml-3 text-gray-600">Loading projects...</span>
          </div>
        ) : projects.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-black text-2xl font-medium tracking-wide mb-8">
              Assign project to get started !
            </p>
            
            {/* Coworking Icon */}
            <div className="relative w-64 h-64">
              <Image
                src="/coworking.png"
                alt="Coworking illustration"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        ) : (
          /* Projects List */
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Project Header */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg font-semibold" style={{ color: '#6366F1' }}>
                        {project.customer_code}
                      </span>
                      <span className="text-lg font-medium" style={{ color: 'black' }}>
                        {project.name}
                      </span>
                      {project.start_date && (
                        <>
                          <span className='text-sm font-medium text-gray-500'>Start: {formatDate(project.start_date)}</span>
                        </>
                      )}
                       <span className='text-sm font-medium text-gray-500'>-</span>
                      {project.end_date && (
                        <>
                          <span className='text-sm font-medium text-gray-500'>End: {formatDate(project.end_date)}</span>
                        </>
                      )}
                      <button className="flex items-center gap-2 px-6 text-[#2600FF]  rounded-sm bg-[#EFEDFF]">
                      {project.sla_resolve_time && (
                        <>
                          <span>SLA: {formatSLA(Number(project.sla_resolve_time))}</span>
                        </>
                      )}
                      </button>
                    </div>

                    

                    {/* Project Description */}
                    <span className="text-sm font-medium " style={{ color: 'black' }}>
                        description 
                    </span>
                    {project.description && (
                      <p className="text-sm text-gray-600 mt-1 mb-2">
                        {project.description}
                      </p>
                    )}

                  
                   <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
                      {/* Creator Info */}
                      {project.created_by && projectCreators[project.created_by] ? (
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                            style={{ backgroundColor: '#6366F1' }}
                          >
                            {projectCreators[project.created_by].first_name?.charAt(0) || ''}
                            {projectCreators[project.created_by].last_name?.charAt(0) || ''}
                          </div>
                          <span className="text-sm text-gray-700">
                            {projectCreators[project.created_by].first_name} {projectCreators[project.created_by].last_name}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                            style={{ backgroundColor: '#6366F1' }}
                          >
                            ?
                          </div>
                          <span className="text-sm text-gray-500">Unknown</span>
                        </div>
                      )}

                      {/* Open Project Button */}
                      <button 
                        className="text-sm font-medium transition-colors"
                        style={{ color: '#6366F1' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#5558E3')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#6366F1')}
                      >
                        Open Project
                      </button>
                    </div> 
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Project Modal */}
      <ProjectModal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        onSubmit={handleCreateProject}
      />
    </DashboardLayout>
  )
}
