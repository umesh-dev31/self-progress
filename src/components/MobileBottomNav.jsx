import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Kanban, 
  BookOpen, 
  Menu
} from 'lucide-react';

export default function MobileBottomNav({ activePage, setActivePage, onOpenMobileMenu, metrics }) {
  const primaryTabs = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard, color: 'bg-neo-yellow' },
    { 
      id: 'habits', 
      label: 'Habits', 
      icon: CheckSquare, 
      color: 'bg-neo-mint',
      badge: metrics.totalHabitsCount > 0 ? `${metrics.selectedCompletedCount}/${metrics.totalHabitsCount}` : null
    },
    { id: 'kanban', label: 'Kanban', icon: Kanban, color: 'bg-neo-cyan' },
    { id: 'journal', label: 'Journal', icon: BookOpen, color: 'bg-neo-purple' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-neo-darkBg/95 backdrop-blur border-t-2 border-neo-black dark:border-white/80 px-2 py-1.5 flex items-center justify-around shadow-neo transition-colors">
      {primaryTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activePage === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActivePage(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl border-2 transition-all duration-150 relative ${
              isActive
                ? `${tab.color} text-neo-black border-neo-black shadow-neo-sm translate-y-[-2px]`
                : 'border-transparent text-clay-600 dark:text-sand-300 hover:text-neo-black dark:hover:text-white'
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {tab.badge && (
                <span className="absolute -top-1.5 -right-3 text-[9px] font-black px-1 rounded-full bg-neo-black text-white dark:bg-white dark:text-neo-black border border-neo-black">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] font-black tracking-tight mt-0.5">
              {tab.label}
            </span>
          </button>
        );
      })}

      {/* More / Menu Drawer trigger */}
      <button
        onClick={onOpenMobileMenu}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl border-2 transition-all duration-150 ${
          ['canvas', 'analytics', 'settings'].includes(activePage)
            ? 'bg-neo-pink text-neo-black border-neo-black shadow-neo-sm translate-y-[-2px]'
            : 'border-transparent text-clay-600 dark:text-sand-300 hover:text-neo-black dark:hover:text-white'
        }`}
      >
        <Menu className="w-5 h-5" />
        <span className="text-[10px] font-black tracking-tight mt-0.5">
          More
        </span>
      </button>
    </nav>
  );
}
