import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Trash2, 
  Sparkles, 
  CheckCircle2 
} from 'lucide-react';
import { DEFAULT_HABITS } from '../utils/storage';

export default function HabitsPage({ data, setData, selectedDateStr, metrics, openAddFormTrigger, onFormClosed }) {
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitIcon, setNewHabitIcon] = useState('💻');
  const [newHabitDesc, setNewHabitDesc] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState('Coding');
  const [showAddForm, setShowAddForm] = useState(Boolean(openAddFormTrigger));

  React.useEffect(() => {
    if (openAddFormTrigger) {
      setShowAddForm(true);
      if (onFormClosed) onFormClosed();
    }
  }, [openAddFormTrigger, onFormClosed]);

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

  const handleAddCustomHabit = (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    const newId = `custom_${Date.now()}`;
    const newHabit = {
      id: newId,
      name: newHabitName.trim(),
      category: newHabitCategory,
      icon: newHabitIcon,
      description: newHabitDesc.trim() || 'Custom personal daily goal'
    };

    setData({
      ...data,
      customHabits: [...(data.customHabits || []), newHabit]
    });

    setNewHabitName('');
    setNewHabitDesc('');
    setShowAddForm(false);
  };

  const handleDeleteCustomHabit = (habitId, e) => {
    e.stopPropagation();
    setData({
      ...data,
      customHabits: (data.customHabits || []).filter(h => h.id !== habitId)
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="neo-box p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neo-mint/40 dark:bg-neo-darkCard">
        <div>
          <h2 className="text-xl md:text-3xl font-black text-neo-black dark:text-white uppercase tracking-tight flex items-center gap-2">
            <CheckSquare className="w-7 h-7 stroke-[3]" />
            <span>DAILY HABIT TRACKER</span>
          </h2>
          <p className="text-xs md:text-sm font-bold text-neo-black/80 dark:text-sand-300 mt-1">
            Check off your daily disciplines for coding, DSA, university coursework, and video editing.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="neo-btn-primary px-4 py-2.5 text-xs flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{showAddForm ? 'CLOSE FORM' : 'ADD CUSTOM GOAL'}</span>
        </button>
      </div>

      {/* Add Custom Goal Modal / Form */}
      {showAddForm && (
        <form onSubmit={handleAddCustomHabit} className="neo-box p-6 bg-neo-yellow/30 dark:bg-neo-darkCard space-y-4">
          <h3 className="text-sm font-black text-neo-black dark:text-white uppercase">
            ➕ CREATE A CUSTOM DAILY GOAL
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-black text-neo-black dark:text-sand-100 mb-1 uppercase">
                Goal Title *
              </label>
              <input
                type="text"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                placeholder="e.g. 30 Mins Coding / LeetCode"
                className="w-full text-xs font-bold px-3 py-2 rounded-xl bg-white dark:bg-dusk-800 border-2 border-neo-black dark:border-white text-neo-black dark:text-white focus:outline-none shadow-neo-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black text-neo-black dark:text-sand-100 mb-1 uppercase">
                Category
              </label>
              <select
                value={newHabitCategory}
                onChange={(e) => setNewHabitCategory(e.target.value)}
                className="w-full text-xs font-bold px-3 py-2 rounded-xl bg-white dark:bg-dusk-800 border-2 border-neo-black dark:border-white text-neo-black dark:text-white focus:outline-none shadow-neo-sm cursor-pointer"
              >
                <option value="Coding">💻 Coding</option>
                <option value="DSA">🧠 DSA</option>
                <option value="College">📚 College / Study</option>
                <option value="Video Editing">🎬 Video Editing</option>
                <option value="Fitness">🏃 Fitness / Health</option>
                <option value="Reading">📖 Reading</option>
                <option value="Mindfulness">🧘 Focus / Mindset</option>
                <option value="Personal">⚡ Personal / Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-neo-black dark:text-sand-100 mb-1 uppercase">
                Icon Emoji
              </label>
              <select
                value={newHabitIcon}
                onChange={(e) => setNewHabitIcon(e.target.value)}
                className="w-full text-xs font-bold px-3 py-2 rounded-xl bg-white dark:bg-dusk-800 border-2 border-neo-black dark:border-white text-neo-black dark:text-white focus:outline-none shadow-neo-sm cursor-pointer"
              >
                <option value="💻">💻 Laptop / Code</option>
                <option value="🧠">🧠 Brain / DSA</option>
                <option value="📚">📚 Book / Study</option>
                <option value="🎬">🎬 Clapper / Video</option>
                <option value="⚡">⚡ Lightning / Energy</option>
                <option value="🏃">🏃 Runner / Fitness</option>
                <option value="🎯">🎯 Target / Focus</option>
                <option value="🔥">🔥 Flame / Streak</option>
                <option value="📖">📖 Journal / Read</option>
                <option value="🧘">🧘 Meditate / Rest</option>
                <option value="🎨">🎨 Palette / Design</option>
                <option value="🚀">🚀 Rocket / Project</option>
                <option value="💡">💡 Bulb / Idea</option>
                <option value="🎧">🎧 Audio / Production</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-neo-black dark:text-sand-100 mb-1 uppercase">
                Short Description
              </label>
              <input
                type="text"
                value={newHabitDesc}
                onChange={(e) => setNewHabitDesc(e.target.value)}
                placeholder="e.g. Practice daily problems or cuts"
                className="w-full text-xs font-bold px-3 py-2 rounded-xl bg-white dark:bg-dusk-800 border-2 border-neo-black dark:border-white text-neo-black dark:text-white focus:outline-none shadow-neo-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="neo-btn-secondary px-4 py-2 text-xs"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="neo-btn-primary px-5 py-2 text-xs"
            >
              SAVE GOAL 💾
            </button>
          </div>
        </form>
      )}

      {/* Progress Metric Banner */}
      <div className="neo-box p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-black text-neo-black dark:text-white uppercase tracking-tight">
              STATUS FOR {selectedDateStr}
            </span>
            <span className="neo-badge bg-neo-yellow text-neo-black">
              {metrics.selectedCompletedCount} / {metrics.totalHabitsCount} DONE
            </span>
          </div>

          <span className="text-base font-black text-neo-terracotta dark:text-neo-orange">
            {metrics.selectedCompletionRate}%
          </span>
        </div>

        <div className="w-full h-4 rounded-xl border-2 border-neo-black dark:border-white bg-sand-200 dark:bg-dusk-800 p-0.5 overflow-hidden shadow-neo-sm">
          <div 
            className="h-full bg-gradient-to-r from-neo-orange to-neo-mint transition-all duration-200 rounded-lg border border-neo-black"
            style={{ width: `${metrics.selectedCompletionRate}%` }}
          />
        </div>

        {metrics.totalHabitsCount > 0 && metrics.selectedCompletionRate === 100 && (
          <div className="p-3.5 rounded-xl bg-neo-mint text-neo-black border-2 border-neo-black font-black text-xs flex items-center gap-2 shadow-neo-sm">
            <Sparkles className="w-5 h-5 fill-neo-black stroke-neo-black" />
            <span>🎉 OUTSTANDING! YOU CRUSHED 100% OF YOUR HABITS TODAY!</span>
          </div>
        )}
      </div>

      {/* Habit Cards Grid or Empty State */}
      {allHabits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allHabits.map((habit) => {
            const isChecked = !!dayHabits[habit.id];

            return (
              <div
                key={habit.id}
                onClick={() => toggleHabit(habit.id)}
                className={`p-5 rounded-2xl border-2 border-neo-black dark:border-white transition-all cursor-pointer flex flex-col justify-between gap-4 shadow-neo hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-neo-sm ${
                  isChecked
                    ? 'bg-neo-mint/30 dark:bg-neo-mint/20'
                    : 'bg-white dark:bg-neo-darkCard'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-neo-yellow border-2 border-neo-black flex items-center justify-center text-2xl flex-shrink-0 shadow-neo-sm">
                      {habit.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className={`text-sm font-black uppercase ${isChecked ? 'line-through text-neo-black/60 dark:text-white/60' : 'text-neo-black dark:text-white'}`}>
                          {habit.name}
                        </h4>
                        <span className="neo-badge bg-neo-cyan text-neo-black text-[10px]">
                          {habit.category}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-clay-600 dark:text-sand-200 mt-1 line-clamp-2">
                        {habit.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleDeleteCustomHabit(habit.id, e)}
                      title="Delete goal"
                      className="p-1.5 rounded-lg border-2 border-neo-black dark:border-white/60 bg-red-100 dark:bg-red-950/40 hover:bg-red-200 dark:hover:bg-red-900/60 text-neo-black dark:text-red-300 shadow-neo-sm transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className={`w-7 h-7 rounded-xl border-2 border-neo-black dark:border-white/80 flex items-center justify-center flex-shrink-0 shadow-neo-sm ${
                      isChecked
                        ? 'bg-neo-black text-white dark:bg-white dark:text-neo-black'
                        : 'bg-white dark:bg-dusk-800'
                    }`}>
                      {isChecked && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-black text-neo-black dark:text-sand-200 pt-2 border-t-2 border-neo-black/10 dark:border-white/10 uppercase">
                  <span>STATUS: <strong className={isChecked ? 'text-neo-mint' : 'text-neo-terracotta dark:text-neo-orange'}>{isChecked ? 'COMPLETED' : 'PENDING'}</strong></span>
                  <span className="text-[10px] opacity-70">CLICK TO TOGGLE</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="neo-box p-12 text-center space-y-4">
          <div className="text-5xl">✨</div>
          <h3 className="text-lg font-black text-neo-black dark:text-white uppercase tracking-tight">
            NO GOALS CREATED YET
          </h3>
          <p className="text-xs md:text-sm font-bold text-clay-600 dark:text-sand-300 max-w-md mx-auto">
            Your daily dashboard is fresh and clean. Click below to add your personalized coding, studying, fitness, or creative goals!
          </p>
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="neo-btn-primary px-6 py-2.5 text-xs inline-flex items-center gap-2 mt-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>ADD YOUR FIRST GOAL</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
