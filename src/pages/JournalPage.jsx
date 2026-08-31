import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Save, 
  Calendar, 
  CheckCircle2, 
  Trash2 
} from 'lucide-react';

const AVAILABLE_TAGS = [
  '#Coding', 
  '#DSA', 
  '#College', 
  '#VideoEditing', 
  '#Algorithms', 
  '#ProjectMilestone', 
  '#BugFixed', 
  '#ExamPrep', 
  '#ColorGrading', 
  '#SystemDesign'
];

export default function JournalPage({ data, setData, selectedDateStr }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterTag, setSelectedFilterTag] = useState('All');

  const dayEntry = data.days[selectedDateStr] || { 
    habits: {}, 
    reflection: '', 
    hours: { coding: 0, dsa: 0, college: 0, video: 0 }, 
    tags: [] 
  };

  const [reflectionText, setReflectionText] = useState(dayEntry.reflection || '');
  const [hours, setHours] = useState(dayEntry.hours || { coding: 0, dsa: 0, college: 0, video: 0 });
  const [selectedTags, setSelectedTags] = useState(dayEntry.tags || []);
  const [savedSuccess, setSavedSuccess] = useState(false);

  React.useEffect(() => {
    const entry = data.days[selectedDateStr] || { 
      habits: {}, 
      reflection: '', 
      hours: { coding: 0, dsa: 0, college: 0, video: 0 }, 
      tags: [] 
    };
    setReflectionText(entry.reflection || '');
    setHours(entry.hours || { coding: 0, dsa: 0, college: 0, video: 0 });
    setSelectedTags(entry.tags || []);
    setSavedSuccess(false);
  }, [selectedDateStr, data.days]);

  const handleSaveReflection = (e) => {
    e.preventDefault();
    const updatedEntry = {
      ...dayEntry,
      reflection: reflectionText.trim(),
      hours: {
        coding: Number(hours.coding) || 0,
        dsa: Number(hours.dsa) || 0,
        college: Number(hours.college) || 0,
        video: Number(hours.video) || 0
      },
      tags: selectedTags,
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
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleDeleteEntry = (dateKey) => {
    const updatedDays = { ...data.days };
    delete updatedDays[dateKey];
    setData({
      ...data,
      days: updatedDays
    });
  };

  const recordedDays = Object.entries(data.days)
    .filter(([_, val]) => (val.reflection && val.reflection.trim().length > 0) || Object.values(val.hours || {}).some(h => Number(h) > 0))
    .sort(([dateA], [dateB]) => dateB.localeCompare(dateA));

  const filteredHistory = recordedDays.filter(([dStr, val]) => {
    const tagMatch = selectedFilterTag === 'All' || (val.tags || []).includes(selectedFilterTag);
    const searchMatch = !searchQuery.trim() || 
      (val.reflection || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (val.tags || []).some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return tagMatch && searchMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="neo-box p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neo-purple/40 dark:bg-neo-darkCard">
        <div>
          <h2 className="text-xl md:text-3xl font-black text-neo-black dark:text-white uppercase tracking-tight flex items-center gap-2">
            <BookOpen className="w-7 h-7 stroke-[3]" />
            <span>DAILY LOGS & REFLECTIONS</span>
          </h2>
          <p className="text-xs md:text-sm font-bold text-neo-black/80 dark:text-sand-300 mt-1">
            Capture what you built, solved, and learned. Log focused hours across your craft.
          </p>
        </div>

        <div className="neo-badge bg-neo-yellow text-neo-black self-start md:self-auto">
          🗓️ {selectedDateStr}
        </div>
      </div>

      {/* Daily Reflection Form */}
      <form onSubmit={handleSaveReflection} className="neo-box p-6 space-y-5">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-black text-neo-black dark:text-white uppercase">
              📝 WHAT DID YOU ACCOMPLISH OR LEARN TODAY?
            </label>
            {savedSuccess && (
              <span className="neo-badge bg-neo-mint text-neo-black">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>SAVED!</span>
              </span>
            )}
          </div>
          <textarea
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            placeholder="e.g. Mastered Dijkstra's algorithm pattern in Python. Cut the YouTube tutorial intro sequence with dynamic text masks in Premiere Pro..."
            rows={4}
            className="w-full text-xs font-bold px-4 py-3 rounded-xl bg-white dark:bg-dusk-800 border-2 border-neo-black dark:border-white text-neo-black dark:text-white focus:outline-none shadow-neo-sm leading-relaxed"
          />
        </div>

        {/* Focused Hours Inputs */}
        <div>
          <label className="block text-xs font-black text-neo-black dark:text-white mb-2 uppercase">
            ⏱️ FOCUSED HOURS LOGGED
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-neo-orange/20 dark:bg-neo-orange/15 border-2 border-neo-black dark:border-white/50 shadow-neo-sm dark:shadow-none">
              <span className="text-[11px] font-black text-neo-black dark:text-white">💻 CODING</span>
              <input
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={hours.coding}
                onChange={(e) => setHours({ ...hours, coding: e.target.value })}
                className="w-full mt-1 text-base font-black bg-transparent text-neo-black dark:text-white focus:outline-none"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-neo-yellow/30 dark:bg-neo-yellow/15 border-2 border-neo-black dark:border-white/50 shadow-neo-sm dark:shadow-none">
              <span className="text-[11px] font-black text-neo-black dark:text-white">🧠 DSA</span>
              <input
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={hours.dsa}
                onChange={(e) => setHours({ ...hours, dsa: e.target.value })}
                className="w-full mt-1 text-base font-black bg-transparent text-neo-black dark:text-white focus:outline-none"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-neo-mint/30 dark:bg-neo-mint/15 border-2 border-neo-black dark:border-white/50 shadow-neo-sm dark:shadow-none">
              <span className="text-[11px] font-black text-neo-black dark:text-white">📚 COLLEGE</span>
              <input
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={hours.college}
                onChange={(e) => setHours({ ...hours, college: e.target.value })}
                className="w-full mt-1 text-base font-black bg-transparent text-neo-black dark:text-white focus:outline-none"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-neo-pink/30 dark:bg-neo-pink/15 border-2 border-neo-black dark:border-white/50 shadow-neo-sm dark:shadow-none">
              <span className="text-[11px] font-black text-neo-black dark:text-white">🎬 VIDEO EDITING</span>
              <input
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={hours.video}
                onChange={(e) => setHours({ ...hours, video: e.target.value })}
                className="w-full mt-1 text-base font-black bg-transparent text-neo-black dark:text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Category Tags */}
        <div>
          <label className="block text-xs font-black text-neo-black dark:text-white mb-2 uppercase">
            🏷️ TAGS FOR TODAY
          </label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_TAGS.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`text-xs font-black px-3 py-1.5 rounded-xl border-2 border-neo-black dark:border-white/60 transition-all ${
                    isSelected
                      ? 'bg-neo-yellow text-neo-black shadow-neo-sm translate-x-[-1px] translate-y-[-1px]'
                      : 'bg-white dark:bg-dusk-800 text-neo-black dark:text-sand-100 hover:bg-sand-100 dark:hover:bg-dusk-700'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="neo-btn-primary px-6 py-2.5 text-xs flex items-center gap-2"
          >
            <Save className="w-4 h-4 stroke-[3]" />
            <span>SAVE REFLECTION 💾</span>
          </button>
        </div>
      </form>

      {/* Historical Reflection Log & Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base font-black text-neo-black dark:text-white uppercase tracking-tight">
            📖 TIMELINE HISTORY ({filteredHistory.length})
          </h3>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neo-black dark:text-white absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search logs..."
                className="text-xs font-bold pl-8 pr-3 py-1.5 rounded-xl bg-white dark:bg-neo-darkCard border-2 border-neo-black dark:border-white text-neo-black dark:text-white focus:outline-none shadow-neo-sm"
              />
            </div>

            <select
              value={selectedFilterTag}
              onChange={(e) => setSelectedFilterTag(e.target.value)}
              className="text-xs font-black px-3 py-1.5 rounded-xl bg-white dark:bg-neo-darkCard border-2 border-neo-black dark:border-white text-neo-black dark:text-white focus:outline-none cursor-pointer shadow-neo-sm"
            >
              <option value="All">ALL TAGS</option>
              {AVAILABLE_TAGS.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredHistory.length > 0 ? (
          <div className="space-y-3">
            {filteredHistory.map(([dStr, entry]) => {
              const compCount = Object.values(entry.habits || {}).filter(Boolean).length;
              const hrs = entry.hours || {};
              const hrsSummary = Object.entries(hrs)
                .filter(([_, v]) => Number(v) > 0)
                .map(([k, v]) => `${k.toUpperCase()}: ${v}h`)
                .join(' • ');

              return (
                <div
                  key={dStr}
                  className="neo-box p-5 border-l-[8px] border-l-neo-orange space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-black text-neo-black dark:text-white">
                      <Calendar className="w-4 h-4 text-neo-orange stroke-[3]" />
                      <span>{dStr}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="neo-badge bg-neo-mint text-neo-black text-[10px]">
                        ✅ {compCount} HABITS DONE
                      </span>
                      <button
                        onClick={() => handleDeleteEntry(dStr)}
                        title="Delete Entry"
                        className="p-1 border border-neo-black dark:border-white/60 rounded bg-red-100 dark:bg-red-950/40 hover:bg-red-300 dark:hover:bg-red-900/60 text-neo-black dark:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {hrsSummary && (
                    <div className="text-[11px] font-black text-neo-terracotta dark:text-neo-orange">
                      ⏱️ {hrsSummary}
                    </div>
                  )}

                  <p className="text-xs font-medium text-neo-black dark:text-sand-100 leading-relaxed whitespace-pre-wrap">
                    {entry.reflection || 'No written reflection.'}
                  </p>

                  {(entry.tags || []).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {entry.tags.map(t => (
                        <span key={t} className="neo-badge bg-sand-100 dark:bg-dusk-800 text-neo-black dark:text-white text-[10px]">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="neo-box p-8 text-center text-xs font-bold text-clay-500 dark:text-sand-300">
            No reflection entries logged yet. Complete the form above to build your daily journal timeline!
          </div>
        )}
      </div>
    </div>
  );
}
