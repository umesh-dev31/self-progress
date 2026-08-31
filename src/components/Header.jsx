import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, Flame, Plus } from 'lucide-react';
import { getFormattedDate } from '../utils/storage';

export default function Header({ selectedDateStr, setSelectedDateStr, metrics, onQuickAction }) {
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
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="h-16 px-6 border-b-2 border-neo-black dark:border-white/80 bg-neo-bg/90 dark:bg-neo-darkBg/90 sticky top-0 z-20 flex items-center justify-between transition-colors">
      {/* Date Navigation in Neobrutalist Frame */}
      <div className="flex items-center gap-3">
        <div className="flex items-center bg-white dark:bg-neo-darkCard border-2 border-neo-black dark:border-white/80 rounded-xl p-1 shadow-neo-sm">
          <button
            onClick={handlePrevDay}
            title="Previous Day"
            className="p-1.5 rounded-lg hover:bg-sand-100 dark:hover:bg-dusk-800 text-neo-black dark:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4 stroke-[3]" />
          </button>
          
          <div className="flex items-center gap-2 px-3 text-xs font-black tracking-tight text-neo-black dark:text-white">
            <Calendar className="w-3.5 h-3.5 text-neo-terracotta" />
            <span>{formattedDateString}</span>
          </div>

          <button
            onClick={handleNextDay}
            title="Next Day"
            className="p-1.5 rounded-lg hover:bg-sand-100 dark:hover:bg-dusk-800 text-neo-black dark:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {!isToday && (
          <button
            onClick={() => setSelectedDateStr(todayStr)}
            className="neo-btn bg-neo-yellow px-3 py-1 text-xs text-neo-black"
          >
            TODAY 🎯
          </button>
        )}
      </div>

      {/* Right Stats & Quick Action */}
      <div className="flex items-center gap-4">
        {/* Streak Sticker */}
        <div className="neo-badge bg-neo-orange text-white">
          <Flame className="w-4 h-4 fill-white" />
          <span>{metrics.currentStreak} DAY STREAK</span>
        </div>

        {/* Action Button */}
        {onQuickAction && (
          <button
            onClick={onQuickAction}
            className="neo-btn-primary px-3.5 py-1.5 text-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>ADD GOAL</span>
          </button>
        )}
      </div>
    </header>
  );
}
