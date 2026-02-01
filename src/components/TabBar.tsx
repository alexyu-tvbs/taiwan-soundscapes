import type { Tab } from '../types'

interface TabBarProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'tonight', label: '今晚', icon: '🌙' },
  { id: 'explore', label: '探索', icon: '🗺️' },
  { id: 'journey', label: '我的', icon: '📊' },
]

export const TabBar = ({ activeTab, onTabChange }: TabBarProps) => {
  return (
    <nav
      data-testid="tab-bar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-slate-800/95 backdrop-blur border-t border-slate-700 flex justify-around"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 flex flex-col items-center py-2 text-sm transition-colors ${
              isActive
                ? 'text-amber-400 border-t-2 border-amber-400'
                : 'text-slate-400'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
