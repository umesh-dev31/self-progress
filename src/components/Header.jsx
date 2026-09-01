import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, Flame, Plus, Menu } from 'lucide-react';
import { getFormattedDate } from '../utils/storage';

export default function Header({ 
  selectedDateStr, 
  setSelectedDateStr, 
  metrics, 
  onQuickAction,
  onOpenMobileMenu
}) {
  const selectedDate = new Date(selectedDateStr + 'T00:00:00');
  const todayStr = getFormattedDate(new Date());
  const isToday = selectedDateStr === todayStr;

  const handlePrevDay = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    setSelectedDateStr(getFormattedDate(prev));
  };

  const handleNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    setSelectedDateStr(getFormattedDate(next));
  };

  const formattedDateString = selectedDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <header className="h-16 px-4 md:px-6 border-b-2 border-neo-black dark:border-white/80 bg-neo-bg/90 dark:bg-neo-darkBg/90 sticky top-0 z-20 flex items-center justify-between transition-colors">
      {/* Left: Mobile Menu Toggle + Date Navigation */}
      <div className="flex items-center gap-2 sm:gap-3">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 bg-white dark:bg-neo-darkCard border-2 border-neo-black dark:border-white/80 rounded-xl shadow-neo-sm text-neo-black dark:text-white hover:bg-sand-100 dark:hover:bg-dusk-800 transition-colors"
            title="Open Menu"
          >
            <Menu className="w-4 h-4 stroke-[3]" />
          </button>
        )}

        <div className="flex items-center bg-white dark:bg-neo-darkCard border-2 border-neo-black dark:border-white/80 rounded-xl p-0.5 sm:p-1 shadow-neo-sm">
          <button
            onClick={handlePrevDay}
            title="Previous Day"
            className="p-1 sm:p-1.5 rounded-lg hover:bg-sand-100 dark:hover:bg-dusk-800 text-neo-black dark:text-white transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
          </button>
          
          <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 text-[11px] sm:text-xs font-black tracking-tight text-neo-black dark:text-white whitespace-nowrap">
            <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-neo-terracotta shrink-0" />
            <span>{formattedDateString}</span>
          </div>

          <button
            onClick={handleNextDay}
            title="Next Day"
            className="p-1 sm:p-1.5 rounded-lg hover:bg-sand-100 dark:hover:bg-dusk-800 text-neo-black dark:text-white transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
          </button>
        </div>

        {!isToday && (
          <button
            onClick={() => setSelectedDateStr(todayStr)}
            className="neo-btn bg-neo-yellow px-2 sm:px-3 py-1 text-[10px] sm:text-xs text-neo-black shrink-0"
          >
            TODAY 🎯
          </button>
        )}
      </div>

      {/* Right Stats & Quick Action */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Streak Sticker */}
        <div className="neo-badge bg-neo-orange text-white text-[11px] sm:text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 flex items-center gap-1.5 shrink-0">
          <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white shrink-0" />
          <span className="hidden sm:inline">{metrics.currentStreak} DAY STREAK</span>
          <span className="sm:hidden">{metrics.currentStreak}D</span>
        </div>

        {/* Action Button */}
        {onQuickAction && (
          <button
            onClick={onQuickAction}
            className="neo-btn-primary px-2.5 sm:px-3.5 py-1.5 text-[11px] sm:text-xs flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span className="hidden sm:inline">ADD GOAL</span>
            <span className="sm:hidden">GOAL</span>
          </button>
        )}
      </div>
    </header>
  );
}
