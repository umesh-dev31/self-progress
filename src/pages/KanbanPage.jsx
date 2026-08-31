import React, { useState } from 'react';
import { 
  Kanban as KanbanIcon, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  ArrowRight, 
  Filter 
} from 'lucide-react';

const COLUMNS = [
  { id: 'todo', label: 'BACKLOG', icon: '📌', headerColor: 'bg-neo-cyan text-neo-black' },
  { id: 'in_progress', label: 'IN PROGRESS', icon: '⚡', headerColor: 'bg-neo-yellow text-neo-black' },
  { id: 'review', label: 'IN REVIEW', icon: '🔍', headerColor: 'bg-neo-purple text-neo-black' },
  { id: 'done', label: 'DONE', icon: '✅', headerColor: 'bg-neo-mint text-neo-black' }
];

export default function KanbanPage({ data, setData }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');
  
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState('Coding');
  const [taskPriority, setTaskPriority] = useState('High');
  const [taskStatus, setTaskStatus] = useState('todo');
  const [taskNotes, setTaskNotes] = useState('');

  const tasks = data.kanbanTasks || [];

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const newTask = {
      id: `task_${Date.now()}`,
      title: taskTitle.trim(),
      category: taskCategory,
      priority: taskPriority,
      status: taskStatus,
      notes: taskNotes.trim(),
      createdAt: new Date().toISOString()
    };

    setData({
      ...data,
      kanbanTasks: [...tasks, newTask]
    });

    setTaskTitle('');
    setTaskNotes('');
    setShowAddModal(false);
  };

  const handleMoveTask = (taskId, direction) => {
    const colOrder = ['todo', 'in_progress', 'review', 'done'];
    const updated = tasks.map(t => {
      if (t.id !== taskId) return t;
      const currIdx = colOrder.indexOf(t.status);
      const nextIdx = direction === 'right' ? Math.min(currIdx + 1, 3) : Math.max(currIdx - 1, 0);
      return { ...t, status: colOrder[nextIdx] };
    });

    setData({
      ...data,
      kanbanTasks: updated
    });
  };

  const handleDeleteTask = (taskId) => {
    setData({
      ...data,
      kanbanTasks: tasks.filter(t => t.id !== taskId)
    });
  };

  const filteredTasks = tasks.filter(t => 
    filterCategory === 'All' || t.category === filterCategory
  );

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="neo-box p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neo-cyan/40 dark:bg-neo-darkCard">
        <div>
          <h2 className="text-xl md:text-3xl font-black text-neo-black dark:text-white uppercase tracking-tight flex items-center gap-2">
            <KanbanIcon className="w-7 h-7 stroke-[3]" />
            <span>VISUAL KANBAN BOARD</span>
          </h2>
          <p className="text-xs md:text-sm font-bold text-neo-black/80 dark:text-sand-300 mt-1">
            Organize DSA problem backlogs, YouTube post-production cuts, and app features.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="neo-box bg-white dark:bg-neo-darkCard px-3 py-1.5 flex items-center gap-2 text-xs font-black">
            <Filter className="w-3.5 h-3.5 text-neo-black dark:text-white" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-transparent text-neo-black dark:text-white focus:outline-none cursor-pointer font-black"
            >
              <option value="All">ALL DOMAINS</option>
              <option value="Coding">💻 CODING</option>
              <option value="DSA">🧠 DSA</option>
              <option value="College">📚 COLLEGE</option>
              <option value="Video Editing">🎬 VIDEO EDITING</option>
              <option value="General">💡 GENERAL</option>
            </select>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="neo-btn-primary px-4 py-2 text-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>NEW CARD</span>
          </button>
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleAddTask} className="neo-box bg-white dark:bg-neo-darkCard p-6 max-w-lg w-full shadow-neo-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-neo-black dark:border-white">
              <h3 className="text-base font-black text-neo-black dark:text-white uppercase">
                ➕ CREATE KANBAN CARD
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="neo-btn bg-red-400 text-white px-2 py-0.5 text-xs"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-black text-neo-black dark:text-white mb-1 uppercase">
                Task Title *
              </label>
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="e.g. Solve LeetCode 146 (LRU Cache) / Rough cut intro"
                className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl bg-sand-50 dark:bg-dusk-800 border-2 border-neo-black dark:border-white text-neo-black dark:text-white focus:outline-none shadow-neo-sm"
                required
                autoFocus
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-black text-neo-black dark:text-white mb-1 uppercase">
                  Domain
                </label>
                <select
                  value={taskCategory}
                  onChange={(e) => setTaskCategory(e.target.value)}
                  className="w-full text-xs font-bold px-3 py-2 rounded-xl bg-sand-50 dark:bg-dusk-800 border-2 border-neo-black dark:border-white text-neo-black dark:text-white focus:outline-none shadow-neo-sm"
                >
                  <option value="Coding">Coding</option>
                  <option value="DSA">DSA</option>
                  <option value="College">College</option>
                  <option value="Video Editing">Video Editing</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-neo-black dark:text-white mb-1 uppercase">
                  Priority
                </label>
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value)}
                  className="w-full text-xs font-bold px-3 py-2 rounded-xl bg-sand-50 dark:bg-dusk-800 border-2 border-neo-black dark:border-white text-neo-black dark:text-white focus:outline-none shadow-neo-sm"
                >
                  <option value="High">🔥 High</option>
                  <option value="Medium">⚡ Medium</option>
                  <option value="Low">🟢 Low</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-neo-black dark:text-white mb-1 uppercase">
                  Column
                </label>
                <select
                  value={taskStatus}
                  onChange={(e) => setTaskStatus(e.target.value)}
                  className="w-full text-xs font-bold px-3 py-2 rounded-xl bg-sand-50 dark:bg-dusk-800 border-2 border-neo-black dark:border-white text-neo-black dark:text-white focus:outline-none shadow-neo-sm"
                >
                  <option value="todo">Backlog</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-neo-black dark:text-white mb-1 uppercase">
                Notes & Checklist
              </label>
              <textarea
                value={taskNotes}
                onChange={(e) => setTaskNotes(e.target.value)}
                placeholder="Details, keyframes, timecodes, or intuition notes..."
                rows={3}
                className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl bg-sand-50 dark:bg-dusk-800 border-2 border-neo-black dark:border-white text-neo-black dark:text-white focus:outline-none shadow-neo-sm"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="neo-btn-secondary px-4 py-2 text-xs"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="neo-btn-primary px-5 py-2 text-xs"
              >
                ADD TO BOARD 📌
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4 Chunky Neobrutalist Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map((col, colIdx) => {
          const colTasks = filteredTasks.filter(t => t.status === col.id);

          return (
            <div
              key={col.id}
              className="neo-box bg-sand-50 dark:bg-neo-darkCard p-3 flex flex-col min-h-[520px]"
            >
              {/* Column Header Ribbon */}
              <div className={`flex items-center justify-between p-3 mb-3 border-2 border-neo-black rounded-xl shadow-neo-sm ${col.headerColor}`}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{col.icon}</span>
                  <span className="text-xs font-black tracking-wider">
                    {col.label}
                  </span>
                </div>
                <span className="text-xs font-black px-2 py-0.5 bg-neo-black text-white rounded-md">
                  {colTasks.length}
                </span>
              </div>

              {/* Task Cards */}
              <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 rounded-xl border-2 border-neo-black dark:border-white/70 bg-white dark:bg-dusk-850 shadow-neo-sm dark:shadow-none hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-neo space-y-3 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border border-neo-black ${
                        task.priority === 'High' ? 'bg-red-300 text-neo-black' : task.priority === 'Medium' ? 'bg-neo-yellow text-neo-black' : 'bg-neo-mint text-neo-black'
                      }`}>
                        {task.priority === 'High' ? '🔥 HIGH' : task.priority === 'Medium' ? '⚡ MED' : '🟢 LOW'}
                      </span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md border border-neo-black bg-neo-cyan text-neo-black">
                        {task.category}
                      </span>
                    </div>

                    <h4 className="text-xs font-black text-neo-black dark:text-white leading-snug">
                      {task.title}
                    </h4>

                    {task.notes && (
                      <p className="text-[11px] font-medium text-clay-700 dark:text-sand-200 bg-sand-100 dark:bg-dusk-800 p-2 rounded-lg border border-neo-black/20 dark:border-white/20">
                        {task.notes}
                      </p>
                    )}

                    {/* Arcade Card Action Buttons */}
                    <div className="flex items-center justify-between pt-2 border-t border-neo-black/20 dark:border-white/20 text-neo-black dark:text-white">
                      <button
                        onClick={() => handleMoveTask(task.id, 'left')}
                        disabled={colIdx === 0}
                        title="Move Left"
                        className={`p-1.5 rounded-lg border border-neo-black dark:border-white/60 bg-white dark:bg-dusk-800 text-neo-black dark:text-white shadow-neo-sm ${
                          colIdx === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-neo-yellow hover:text-neo-black'
                        }`}
                      >
                        <ArrowLeft className="w-3.5 h-3.5 stroke-[3]" />
                      </button>

                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        title="Delete Task"
                        className="p-1.5 rounded-lg border border-neo-black dark:border-white/60 bg-red-100 dark:bg-red-950/40 hover:bg-red-300 dark:hover:bg-red-900/60 text-neo-black dark:text-red-300 shadow-neo-sm transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleMoveTask(task.id, 'right')}
                        disabled={colIdx === 3}
                        title="Move Right"
                        className={`p-1.5 rounded-lg border border-neo-black dark:border-white/60 bg-white dark:bg-dusk-800 text-neo-black dark:text-white shadow-neo-sm ${
                          colIdx === 3 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-neo-yellow hover:text-neo-black'
                        }`}
                      >
                        <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                    </div>
                  </div>
                ))}

                {colTasks.length === 0 && (
                  <div className="h-32 border-2 border-dashed border-neo-black/40 dark:border-white/30 rounded-xl flex items-center justify-center text-clay-400 dark:text-sand-400 font-bold text-xs">
                    EMPTY COLUMN
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
