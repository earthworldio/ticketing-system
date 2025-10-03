'use client'

interface SettingsTabsProps {
  activeTab: 'roles' | 'permissions' | 'assignments' | 'customers' | 'priorities' | 'statuses'
  onTabChange: (tab: 'roles' | 'permissions' | 'assignments' | 'customers' | 'priorities' | 'statuses') => void
}

export default function SettingsTabs({ activeTab, onTabChange }: SettingsTabsProps) {
  const tabs = [
    { id: 'roles', label: 'Roles' },
    { id: 'permissions', label: 'Permissions' },
    { id: 'assignments', label: 'Role-Permission Assignments' },
    { id: 'customers', label: 'Customers' },
    { id: 'priorities', label: 'Priorities' },
    { id: 'statuses', label: 'Status' },
  ] as const

  return (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-[#6366F1] text-[#6366F1]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  )
}
