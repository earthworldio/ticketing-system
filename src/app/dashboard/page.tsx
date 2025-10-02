'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/features/DashboardLayout'
import Image from 'next/image'

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

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

        {/* Empty State */}
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
      </div>
    </DashboardLayout>
  )
}
