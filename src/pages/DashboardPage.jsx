import React from 'react';
import { 
  Flame, 
  Trophy, 
  CalendarDays, 
  Target, 
  CheckSquare2, 
  Square, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2,
  Plus 
} from 'lucide-react';
import { DEFAULT_HABITS, getFormattedDate } from '../utils/storage';

export default function DashboardPage({ 
  data, 
  setData, 
  selectedDateStr, 
  metrics, 
  setActivePage 
}) {
  const allHabits = [...DEFAULT_HABITS, ...(data.customHabits || [])];
  const dayEntry = data.days[selectedDateStr] || { habits: {}, reflection: '', hours: {}, tags: [] };
  const dayHabits = dayEntry.habits || {};

  const toggleHabit = (habitId) => {
    const isCompleted = !dayHabits[habitId];
    const updatedEntry = {
      ...dayEntry,
      habits: {
        ...dayHabits,
        [habitId]: isCompleted
      },
      updatedAt: new Date().toISOString()
    };

    const updatedData = {
      ...data,
      days: {
        ...data.days,
        [selectedDateStr]: updatedEntry
      }
    };

    setData(updatedData);
  };

  const today = new Date();
  const dayOfWeek = (today.getDay() + 6) % 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - dayOfWeek);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dStr = getFormattedDate(d);
    const entry = data.days[dStr] || {};
    const compCount = Object.values(entry.habits || {}).filter(Boolean).length;
    const isSelected = dStr === selectedDateStr;

    return {
      dateObj: d,
      dateStr: dStr,
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: d.getDate(),
      completed: compCount,
      total: allHabits.length,
      isSelected
    };
  });

  const inProgressKanban = (data.kanbanTasks || []).filter(t => t.status === 'in_progress');

  return (
    <div className="space-y-6">
      {/* Neobrutalist Hero Welcome Banner */}
      <div className="neo-box bg-neo-yellow dark:bg-neo-darkCard p-6 md:p-8 text-neo-black dark:text-white relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="neo-badge bg-neo-terracotta text-white mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DISCIPLINE OVER MOTIVATION</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-black tracking-tight uppercase">
              CONQUER YOUR GOALS DAILY.
            </h2>
            <p className="text-xs md:text-sm font-bold text-neo-black/80 dark:text-sand-300 mt-1 max-w-xl">
              Track Coding sessions, DSA patterns, College assignments, and Video Editing post-production.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setActivePage('habits')}
              className="neo-btn-primary px-4 py-2.5 text-xs flex items-center gap-2"
            >
              <span>CHECKLIST</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
            <button
              onClick={() => setActivePage('kanban')}
              className="neo-btn-secondary px-4 py-2.5 text-xs"
            >
              KANBAN 📋
            </button>
          </div>
        </div>
      </div>

      {/* 4 Chunky Neobrutalist Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Current Streak */}
        <div className="neo-box-hover bg-neo-yellow dark:bg-neo-darkCard text-neo-black dark:text-white p-5 text-center">
          <div className="w-11 h-11 mx-auto mb-2 rounded-xl bg-neo-black dark:bg-neo-yellow/15 text-neo-yellow border-2 border-neo-black dark:border-neo-yellow/60 flex items-center justify-center shadow-neo-sm dark:shadow-none">
            <Flame className="w-6 h-6 fill-neo-yellow" />
          </div>
          <div className="text-3xl font-black leading-none text-neo-black dark:text-white">
            {metrics.currentStreak} <span className="text-sm font-extrabold text-neo-black/80 dark:text-neo-yellow">DAYS</span>
          </div>
          <div className="text-[11px] font-black uppercase tracking-wider mt-1.5 opacity-90 text-neo-black dark:text-sand-200">
            CURRENT STREAK
          </div>
          <div className="text-[10px] font-extrabold mt-1.5 px-2 py-0.5 bg-neo-black dark:bg-neo-yellow/20 text-white dark:text-neo-yellow border border-transparent dark:border-neo-yellow/50 rounded-md inline-block">
            {metrics.currentStreak > 0 ? '🔥 ON FIRE' : 'START TODAY'}
          </div>
        </div>

        {/* Best Streak */}
        <div className="neo-box-hover bg-neo-orange dark:bg-neo-darkCard text-white p-5 text-center">
          <div className="w-11 h-11 mx-auto mb-2 rounded-xl bg-white dark:bg-neo-orange/15 text-neo-orange border-2 border-neo-black dark:border-neo-orange/60 flex items-center justify-center shadow-neo-sm dark:shadow-none">
            <Trophy className="w-6 h-6 stroke-[3]" />
          </div>
          <div className="text-3xl font-black leading-none text-white">
            {metrics.longestStreak} <span className="text-sm font-extrabold text-white/90 dark:text-neo-orange">DAYS</span>
          </div>
          <div className="text-[11px] font-black uppercase tracking-wider mt-1.5 opacity-90 text-white dark:text-sand-200">
            ALL-TIME BEST
          </div>
          <div className="text-[10px] font-extrabold mt-1.5 px-2 py-0.5 bg-neo-black dark:bg-neo-orange/20 text-white dark:text-neo-orange border border-transparent dark:border-neo-orange/50 rounded-md inline-block">
            RECORD STREAK
          </div>
        </div>

        {/* Active Days */}
        <div className="neo-box-hover bg-neo-mint dark:bg-neo-darkCard text-neo-black dark:text-white p-5 text-center">
          <div className="w-11 h-11 mx-auto mb-2 rounded-xl bg-neo-black dark:bg-neo-mint/15 text-neo-mint border-2 border-neo-black dark:border-neo-mint/60 flex items-center justify-center shadow-neo-sm dark:shadow-none">
            <CalendarDays className="w-6 h-6 stroke-[3]" />
          </div>
          <div className="text-3xl font-black leading-none text-neo-black dark:text-white">
            {metrics.totalActiveDays}
          </div>
          <div className="text-[11px] font-black uppercase tracking-wider mt-1.5 opacity-90 text-neo-black dark:text-sand-200">
            ACTIVE DAYS
          </div>
          <div className="text-[10px] font-extrabold mt-1.5 px-2 py-0.5 bg-neo-black dark:bg-neo-mint/20 text-white dark:text-neo-mint border border-transparent dark:border-neo-mint/50 rounded-md inline-block">
            {metrics.totalHoursSpent} HRS LOGGED
          </div>
        </div>

        {/* Completion Rate */}
        <div className="neo-box-hover bg-neo-cyan dark:bg-neo-darkCard text-neo-black dark:text-white p-5 text-center">
          <div className="w-11 h-11 mx-auto mb-2 rounded-xl bg-neo-black dark:bg-neo-cyan/15 text-neo-cyan border-2 border-neo-black dark:border-neo-cyan/60 flex items-center justify-center shadow-neo-sm dark:shadow-none">
            <Target className="w-6 h-6 stroke-[3]" />
          </div>
          <div className="text-3xl font-black leading-none text-neo-black dark:text-white">
            {metrics.overallCompletionRate}%
          </div>
          <div className="text-[11px] font-black uppercase tracking-wider mt-1.5 opacity-90 text-neo-black dark:text-sand-200">
            COMPLETION
          </div>
          <div className="text-[10px] font-extrabold mt-1.5 px-2 py-0.5 bg-neo-black dark:bg-neo-cyan/20 text-white dark:text-neo-cyan border border-transparent dark:border-neo-cyan/50 rounded-md inline-block">
            ACROSS HABITS
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Checklist & Weekly Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Habits */}
        <div className="lg:col-span-2 neo-box p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b-2 border-neo-black dark:border-white/20">
            <div>
              <h3 className="text-base font-black text-neo-black dark:text-white uppercase tracking-tight">
                ⚡ TODAY'S CORE DISCIPLINES
              </h3>
              <p className="text-xs font-bold text-clay-600 dark:text-sand-200">
                {metrics.totalHabitsCount > 0
                  ? `${metrics.selectedCompletedCount} of ${metrics.totalHabitsCount} completed for this date`
                  : 'No goals set up yet. Add your personal disciplines to start tracking!'}
              </p>
            </div>
            
            <div className="neo-badge bg-neo-mint text-neo-black">
              {metrics.selectedCompletionRate}% DONE
            </div>
          </div>

          {/* Neobrutalist Progress Bar with Solid Border */}
          <div className="w-full h-4 rounded-xl border-2 border-neo-black dark:border-white/80 bg-sand-200 dark:bg-dusk-800 p-0.5 overflow-hidden shadow-neo-sm">
            <div 
              className="h-full bg-neo-terracotta transition-all duration-200 rounded-lg border border-neo-black"
              style={{ width: `${metrics.selectedCompletionRate}%` }}
            />
          </div>

          {/* Habit Checkboxes Grid or Empty State */}
          {allHabits.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {allHabits.map((habit) => {
                const isChecked = !!dayHabits[habit.id];
                return (
                  <div
                    key={habit.id}
                    onClick={() => toggleHabit(habit.id)}
                    className={`p-4 rounded-2xl border-2 border-neo-black dark:border-white/80 transition-all cursor-pointer flex items-start justify-between gap-3 shadow-neo-sm hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-neo active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
                      isChecked
                        ? 'bg-neo-mint/30 dark:bg-neo-mint/20'
                        : 'bg-white dark:bg-neo-darkCard'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl mt-0.5">{habit.icon}</span>
                      <div>
                        <div className={`text-xs font-black uppercase ${isChecked ? 'line-through text-neo-black/60 dark:text-white/60' : 'text-neo-black dark:text-white'}`}>
                          {habit.name}
                        </div>
                        <div className="text-[11px] font-medium text-clay-600 dark:text-sand-200 mt-0.5 line-clamp-1">
                          {habit.description}
                        </div>
                      </div>
                    </div>

                    <div className={`w-6 h-6 rounded-lg border-2 border-neo-black dark:border-white flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isChecked ? 'bg-neo-black text-white dark:bg-white dark:text-neo-black' : 'bg-white dark:bg-dusk-800'
                    }`}>
                      {isChecked && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 rounded-2xl border-2 border-dashed border-neo-black/30 dark:border-white/30 text-center space-y-3 bg-sand-50/50 dark:bg-dusk-900/30">
              <div className="text-3xl">🎯</div>
              <div className="text-sm font-black text-neo-black dark:text-white uppercase">
                NO GOALS ADDED YET
              </div>
              <p className="text-xs font-bold text-clay-600 dark:text-sand-300 max-w-sm mx-auto">
                Ready to track your own routines? Create your personal daily goals to get started.
              </p>
              <button
                onClick={() => setActivePage('habits')}
                className="neo-btn-primary px-4 py-2 text-xs inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>ADD YOUR FIRST GOAL</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Col: Weekly Strip & Kanban Focus */}
        <div className="space-y-6">
          {/* 7-Day Consistency Week */}
          <div className="neo-box p-5 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-neo-black dark:text-white">
              📅 THIS WEEK'S ACTIVITY
            </h3>
            
            <div className="grid grid-cols-7 gap-1.5 text-center">
              {weekDays.map((wd) => {
                const isFull = wd.completed === wd.total && wd.total > 0;
                const isPartial = wd.completed > 0 && !isFull;

                return (
                  <div
                    key={wd.dateStr}
                    className={`py-2 px-1 rounded-xl border-2 border-neo-black dark:border-white/80 flex flex-col items-center justify-between transition-all ${
                      wd.isSelected 
                        ? 'bg-neo-yellow shadow-neo-sm translate-y-[-2px]' 
                        : isFull 
                          ? 'bg-neo-mint/30 dark:bg-neo-mint/20' 
                          : 'bg-white dark:bg-neo-darkCard'
                    }`}
                  >
                    <span className={`text-[10px] uppercase font-black ${
                      wd.isSelected ? 'text-neo-black' : 'text-neo-black dark:text-sand-200'
                    }`}>
                      {wd.dayName}
                    </span>
                    <span className={`text-xs font-black my-1 ${
                      wd.isSelected ? 'text-neo-black' : 'text-neo-black dark:text-white'
                    }`}>
                      {wd.dayNum}
                    </span>
                    <span className="text-[10px]">
                      {isFull ? '🟢' : isPartial ? '🟡' : '⚪'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Kanban Focus */}
          <div className="neo-box p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-neo-black dark:text-white">
                ⚡ IN PROGRESS ({inProgressKanban.length})
              </h3>
              <button
                onClick={() => setActivePage('kanban')}
                className="text-xs font-black text-neo-terracotta hover:underline"
              >
                BOARD ➔
              </button>
            </div>

            {inProgressKanban.length > 0 ? (
              <div className="space-y-2">
                {inProgressKanban.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-xl bg-white dark:bg-neo-darkCard border-2 border-neo-black dark:border-white/80 flex items-center justify-between text-xs shadow-neo-sm"
                  >
                    <div className="font-extrabold text-neo-black dark:text-white truncate pr-2">
                      {task.title}
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-neo-yellow border border-neo-black text-neo-black flex-shrink-0">
                      {task.category}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs font-bold text-clay-500 dark:text-sand-300 py-3 text-center">
                No active tasks. Move items to 'In Progress' on Kanban!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
