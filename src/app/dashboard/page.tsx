'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/features/DashboardLayout'
import Image from 'next/image'

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
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.push('/')
      return
    }

    setLoading(false)
  }, [router])

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

        {/* All Tickets Tab */}
        <div className="border-b border-gray-200">
          <button
            className="pb-3 text-sm font-medium flex items-center space-x-2"
            style={{ color: '#6366F1', borderBottom: '2px solid #6366F1' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>All Tickets</span>
          </button>
        </div>

        {/* Tickets List or Empty State */}
        {tickets.length === 0 ? (
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
          /* Tickets List */
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Ticket Header */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-lg font-semibold text-gray-900">#{ticket.id}</span>
                      
                      {/* Status Badge */}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          ticket.status === 'In Progress'
                            ? 'bg-orange-100 text-orange-700'
                            : ticket.status === 'Open'
                            ? 'bg-blue-100 text-blue-700'
                            : ticket.status === 'Resolved'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {ticket.status}
                      </span>

                      {/* Priority Badge */}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          ticket.priority === 'High'
                            ? 'bg-red-100 text-red-700'
                            : ticket.priority === 'Medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {ticket.priority}
                      </span>
                    </div>

                    {/* Ticket Title */}
                    <h3 className="text-base text-gray-800 mb-3 font-normal">
                      {ticket.description}
                    </h3>

                    {/* Ticket Meta */}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{ticket.category}</span>
                      <span>•</span>
                      <span>{ticket.date}</span>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
