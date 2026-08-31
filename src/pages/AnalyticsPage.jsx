import React from 'react';
import { 
  BarChart3, 
  Flame, 
  Trophy, 
  CalendarDays, 
  Target, 
  Award 
} from 'lucide-react';
import { getFormattedDate, DEFAULT_HABITS } from '../utils/storage';

export default function AnalyticsPage({ data, metrics }) {
  const today = new Date();
  const allHabits = [...DEFAULT_HABITS, ...(data.customHabits || [])];
  const numHabits = Math.max(allHabits.length, 1);

  const past14Days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (13 - i));
    const dStr = getFormattedDate(d);
    const entry = data.days[dStr] || {};
    const habits = entry.habits || {};
    const completedCount = Object.values(habits).filter(Boolean).length;
    const hours = entry.hours || {};
    const totalHours = Object.values(hours).reduce((acc, h) => acc + (Number(h) || 0), 0);

    return {
      dateStr: dStr,
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      completedCount,
      totalPossible: numHabits,
      pct: Math.round((completedCount / numHabits) * 100),
      totalHours
    };
  });

  const catHours = metrics.categoryHours || { Coding: 0, DSA: 0, College: 0, 'Video Editing': 0 };
  const totalCatHours = Object.values(catHours).reduce((a, b) => a + b, 0) || 1;

  const milestones = [
    { title: 'FIRST STEP', desc: 'Completed your first active day', req: 1, unlocked: metrics.totalActiveDays >= 1, color: 'bg-neo-yellow' },
    { title: '3-DAY IGNITION', desc: '3 consecutive active days', req: 3, unlocked: metrics.longestStreak >= 3, color: 'bg-neo-orange' },
    { title: '7-DAY HABIT PRO', desc: '1 full week of consistency', req: 7, unlocked: metrics.longestStreak >= 7, color: 'bg-neo-mint' },
    { title: '14-DAY DISCIPLINE', desc: 'Two solid weeks of daily focus', req: 14, unlocked: metrics.longestStreak >= 14, color: 'bg-neo-cyan' },
    { title: '30-DAY CRAFT MASTER', desc: 'One month of relentless progress', req: 30, unlocked: metrics.longestStreak >= 30, color: 'bg-neo-purple' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="neo-box p-6 bg-neo-lime/40 dark:bg-neo-darkCard">
        <h2 className="text-xl md:text-3xl font-black text-neo-black dark:text-white uppercase tracking-tight flex items-center gap-2">
          <BarChart3 className="w-7 h-7 stroke-[3]" />
          <span>ANALYTICS & DISCIPLINE METRICS</span>
        </h2>
        <p className="text-xs md:text-sm font-bold text-neo-black/80 dark:text-sand-300 mt-1">
          Deep-dive trends for daily habit completions, focused domain hours, and streak milestones.
        </p>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="neo-box bg-white dark:bg-neo-darkCard text-neo-black dark:text-white p-5">
          <span className="text-[11px] font-black uppercase text-neo-black/80 dark:text-sand-200">CURRENT STREAK</span>
          <div className="text-3xl font-black mt-1 text-neo-black dark:text-white">
            🔥 {metrics.currentStreak} <span className="text-sm font-bold text-neo-black/80 dark:text-neo-yellow">DAYS</span>
          </div>
          <p className="text-[10px] font-extrabold mt-1 text-neo-black/70 dark:text-sand-300">Active consecutive days</p>
        </div>

        <div className="neo-box bg-white dark:bg-neo-darkCard text-neo-black dark:text-white p-5">
          <span className="text-[11px] font-black uppercase text-neo-black/80 dark:text-sand-200">ALL-TIME BEST</span>
          <div className="text-3xl font-black mt-1 text-neo-black dark:text-white">
            🏆 {metrics.longestStreak} <span className="text-sm font-bold text-neo-black/80 dark:text-neo-orange">DAYS</span>
          </div>
          <p className="text-[10px] font-extrabold mt-1 text-neo-black/70 dark:text-sand-300">Personal streak record</p>
        </div>

        <div className="neo-box bg-white dark:bg-neo-darkCard text-neo-black dark:text-white p-5">
          <span className="text-[11px] font-black uppercase text-neo-black/80 dark:text-sand-200">ACTIVE DAYS</span>
          <div className="text-3xl font-black mt-1 text-neo-black dark:text-white">
            📅 {metrics.totalActiveDays}
          </div>
          <p className="text-[10px] font-extrabold mt-1 text-neo-black/70 dark:text-sand-300">Lifetime check-ins</p>
        </div>

        <div className="neo-box bg-white dark:bg-neo-darkCard text-neo-black dark:text-white p-5">
          <span className="text-[11px] font-black uppercase text-neo-black/80 dark:text-sand-200">HOURS INVESTED</span>
          <div className="text-3xl font-black mt-1 text-neo-black dark:text-white">
            ⏱️ {metrics.totalHoursSpent} <span className="text-sm font-bold text-neo-black/80 dark:text-neo-cyan">HRS</span>
          </div>
          <p className="text-[10px] font-extrabold mt-1 text-neo-black/70 dark:text-sand-300">Across all 4 domains</p>
        </div>
      </div>

      {/* 14-Day Visual Trend & Hours Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: 14-Day Visual Bar Trend */}
        <div className="lg:col-span-7 neo-box p-6 space-y-4">
          <h3 className="text-sm font-black text-neo-black dark:text-white uppercase tracking-tight">
            📈 14-DAY COMPLETION FREQUENCY
          </h3>

          <div className="h-44 flex items-end justify-between gap-1.5 pt-6">
            {past14Days.map((d) => {
              const heightPct = Math.max(d.pct, 8);
              const isToday = d.dateStr === getFormattedDate(today);

              return (
                <div key={d.dateStr} className="flex-1 flex flex-col items-center gap-1 group h-full justify-end">
                  <span className="text-[9px] font-black text-neo-black dark:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.completedCount}/{d.totalPossible}
                  </span>
                  <div className="w-full bg-sand-200 dark:bg-dusk-800 rounded-t-lg h-32 flex items-end overflow-hidden border-2 border-neo-black dark:border-white/40">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full rounded-t transition-all duration-200 ${
                        isToday 
                          ? 'bg-neo-yellow' 
                          : d.completedCount > 0 
                            ? 'bg-neo-terracotta' 
                            : 'bg-transparent'
                      }`}
                    />
                  </div>
                  <span className={`text-[10px] font-black uppercase truncate ${isToday ? 'text-neo-terracotta dark:text-neo-orange font-black underline' : 'text-clay-600 dark:text-sand-200'}`}>
                    {d.label.split(' ')[1]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 5 Cols: Domain Hours Breakdown */}
        <div className="lg:col-span-5 neo-box p-6 space-y-4">
          <h3 className="text-sm font-black text-neo-black dark:text-white uppercase tracking-tight">
            ⏱️ TOTAL HOURS BY DOMAIN
          </h3>

          <div className="space-y-3 pt-2">
            {Object.entries(catHours).map(([cat, val]) => {
              const pct = Math.round((val / totalCatHours) * 100);
              const colorMap = {
                Coding: 'bg-neo-orange',
                DSA: 'bg-neo-yellow',
                College: 'bg-neo-mint',
                'Video Editing': 'bg-neo-pink'
              };

              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs font-black text-neo-black dark:text-white uppercase">
                    <span>{cat}</span>
                    <span>{val} HRS ({pct}%)</span>
                  </div>
                  <div className="w-full h-3.5 rounded-lg border-2 border-neo-black dark:border-white/40 bg-sand-200 dark:bg-dusk-800 overflow-hidden shadow-neo-sm">
                    <div
                      style={{ width: `${pct}%` }}
                      className={`h-full border-r-2 border-neo-black dark:border-white/40 ${colorMap[cat] || 'bg-neo-terracotta'}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Streak Milestones & Achievements */}
      <div className="neo-box p-6 space-y-4">
        <h3 className="text-sm font-black text-neo-black dark:text-white uppercase flex items-center gap-2">
          <Award className="w-5 h-5 text-neo-terracotta stroke-[3]" />
          <span>MILESTONE BADGES</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {milestones.map((m) => (
            <div
              key={m.title}
              className={`p-4 rounded-xl border-2 transition-all flex flex-col justify-between text-center ${
                m.unlocked
                  ? `${m.color} text-neo-black border-neo-black shadow-neo translate-x-[-1px] translate-y-[-1px]`
                  : 'bg-white dark:bg-neo-darkCard border-neo-black dark:border-white/50 text-neo-black dark:text-white opacity-70 shadow-neo-sm'
              }`}
            >
              <div className="text-3xl mb-2">
                {m.unlocked ? '🏆' : '🔒'}
              </div>
              <div>
                <h4 className="text-xs font-black uppercase text-neo-black dark:text-white">
                  {m.title}
                </h4>
                <p className="text-[10px] font-bold mt-1 text-neo-black/80 dark:text-sand-300">
                  {m.desc}
                </p>
              </div>
              <span className={`text-[10px] font-black mt-3 px-2 py-0.5 rounded-md border ${
                m.unlocked
                  ? 'border-neo-black bg-neo-black text-white'
                  : 'border-neo-black dark:border-white/40 bg-neo-black dark:bg-dusk-800 text-white dark:text-sand-200'
              }`}>
                {m.unlocked ? 'UNLOCKED' : `${m.req} DAYS REQ`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
