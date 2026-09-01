import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Kanban, 
  BookOpen, 
  PenTool, 
  BarChart3, 
  Settings, 
  Flame, 
  Sun, 
  Moon, 
  Zap,
  X,
  LogOut,
  Cloud,
  RefreshCw,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ 
  activePage, 
  setActivePage, 
  theme, 
  toggleTheme, 
  metrics,
  mobileOpen,
  onCloseMobile
}) {
  const { user, loginWithGoogle, logout, syncStatus } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'bg-neo-yellow' },
    { id: 'habits', label: 'Daily Habits', icon: CheckSquare, badge: metrics.totalHabitsCount > 0 ? `${metrics.selectedCompletedCount}/${metrics.totalHabitsCount}` : null, color: 'bg-neo-mint' },
    { id: 'kanban', label: 'Kanban Board', icon: Kanban, color: 'bg-neo-cyan' },
    { id: 'journal', label: 'Journal & Logs', icon: BookOpen, color: 'bg-neo-purple' },
    { id: 'canvas', label: 'Idea Canvas', icon: PenTool, color: 'bg-neo-pink' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'bg-neo-lime' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'bg-sand-200' },
  ];

  const handleNavClick = (id) => {
    setActivePage(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      {/* Sidebar Container: Fixed drawer on mobile, sticky sidebar on desktop */}
      <aside 
        className={`
          w-72 md:w-64 flex-shrink-0 bg-neo-bg dark:bg-neo-darkBg border-r-2 border-neo-black dark:border-white/80 
          flex flex-col justify-between p-4 h-screen transition-all duration-200 z-50 overflow-y-auto
          fixed md:sticky top-0 left-0
          ${mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div>
          {/* Neobrutalism App Brand Header */}
          <div className="flex items-center justify-between gap-3 p-3 mb-4 bg-neo-yellow text-neo-black border-2 border-neo-black rounded-2xl shadow-neo">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-neo-terracotta border-2 border-neo-black flex items-center justify-center text-white shadow-neo-sm">
                <Zap className="w-5 h-5 fill-white" />
              </div>
              <div>
                <h1 className="font-black text-lg tracking-tight leading-none">
                  PROGRESS
                </h1>
                <span className="text-[11px] font-black tracking-widest text-neo-terracotta uppercase">
                  PULSE • PRO
                </span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg border-2 border-neo-black bg-white hover:bg-sand-100 text-neo-black transition-colors"
              title="Close Menu"
            >
              <X className="w-4 h-4 stroke-[3]" />
            </button>
          </div>

          {/* User Profile / Cloud Sync Box */}
          <div className="mb-4">
            {user ? (
              <div className="bg-white dark:bg-neo-darkCard border-2 border-neo-black dark:border-white/80 rounded-2xl p-2.5 shadow-neo-sm flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || 'User'} 
                      className="w-8 h-8 rounded-full border-2 border-neo-black shrink-0 object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-neo-cyan border-2 border-neo-black flex items-center justify-center font-black text-xs shrink-0">
                      {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-xs font-black truncate text-neo-black dark:text-white">
                      {user.displayName || 'User'}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold">
                      {syncStatus === 'syncing' ? (
                        <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          <RefreshCw className="w-2.5 h-2.5 animate-spin" /> Saving...
                        </span>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Cloud Synced
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-1.5 hover:bg-rose-100 dark:hover:bg-rose-950/40 text-rose-600 border border-transparent hover:border-rose-500 rounded-lg transition-colors shrink-0"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="w-full bg-white dark:bg-neo-darkCard border-2 border-neo-black dark:border-white/80 hover:bg-sand-100 dark:hover:bg-dusk-800 text-neo-black dark:text-white p-2.5 rounded-2xl shadow-neo-sm flex items-center justify-center gap-2 text-xs font-black transition-all hover:translate-x-[-1px] hover:translate-y-[-1px]"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>SIGN IN WITH GOOGLE</span>
              </button>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-black text-xs transition-all duration-100 border-2 border-neo-black dark:border-white/80 ${
                    isActive
                      ? `${item.color} text-neo-black shadow-neo translate-x-[-2px] translate-y-[-2px]`
                      : 'bg-white dark:bg-neo-darkCard text-neo-black dark:text-sand-100 hover:bg-sand-100 dark:hover:bg-dusk-800 shadow-neo-sm hover:translate-x-[-1px] hover:translate-y-[-1px]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md font-black bg-neo-black text-white dark:bg-white dark:text-neo-black border border-neo-black">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile / Quick Info Card */}
        <div className="space-y-3 pt-3 border-t-2 border-neo-black dark:border-white/20">
          {/* Streak Mini Box */}
          <div className="bg-neo-orange/15 dark:bg-neo-orange/30 border-2 border-neo-black dark:border-white/80 rounded-2xl p-3 flex items-center justify-between shadow-neo-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-neo-orange border-2 border-neo-black text-white flex items-center justify-center shadow-neo-sm">
                <Flame className="w-4 h-4 fill-white" />
              </div>
              <div>
                <div className="text-xs font-black text-neo-black dark:text-white">
                  {metrics.currentStreak} DAY STREAK
                </div>
                <div className="text-[10px] font-bold text-neo-terracotta dark:text-neo-orange">
                  {metrics.currentStreak > 0 ? 'KEEP GRINDING!' : 'CHECK IN TODAY!'}
                </div>
              </div>
            </div>
            <span className="text-xs font-black px-2 py-1 bg-neo-black text-white dark:bg-white dark:text-neo-black rounded-lg">
              {metrics.overallCompletionRate}%
            </span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="w-full neo-btn bg-white dark:bg-neo-darkCard px-3 py-2 text-xs flex items-center justify-between"
          >
            <span className="flex items-center gap-2 font-bold">
              {theme === 'dark' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
              <span>{theme === 'dark' ? 'DARK BRUTAL' : 'LIGHT BRUTAL'}</span>
            </span>
            <span className="text-[10px] uppercase font-black px-1.5 py-0.5 bg-neo-yellow text-neo-black border border-neo-black rounded">
              {theme}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
