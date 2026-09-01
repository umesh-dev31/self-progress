// Storage manager for Progress Pulse SaaS
const STORAGE_KEY = 'progress_pulse_data_v2';

export const DEFAULT_HABITS = [];

export const DEFAULT_KANBAN_TASKS = [
  {
    id: 'task_1',
    title: 'Solve 3 Tree Traversal LeetCode problems',
    category: 'DSA',
    priority: 'High',
    status: 'in_progress',
    notes: 'Focus on recursion and iterative DFS using stacks.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'task_2',
    title: 'Rough cut for 60s Tech Reel / Short',
    category: 'Video Editing',
    priority: 'Medium',
    status: 'todo',
    notes: 'Add keyframe zoom-ins and sound effect markers.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'task_3',
    title: 'Review Operating Systems Lecture Notes',
    category: 'College',
    priority: 'High',
    status: 'review',
    notes: 'Prepare summary for Virtual Memory & Page Replacement.',
    createdAt: new Date().toISOString()
  }
];

export function getInitialData() {
  return {
    days: {}, // Fresh empty history - 0 streak!
    customHabits: [],
    kanbanTasks: DEFAULT_KANBAN_TASKS,
    canvasData: {
      notes: "### 💡 Video Script & Algorithm Architecture\n\n- **Intro (0-5s)**: Hook the viewer with the core problem statement.\n- **Body (5-35s)**: Live code walk-through + visual diagram.\n- **Outro (35-45s)**: Takeaways & call to action.\n\n```mermaid\nflowchart LR\n   A[Input Array] --> B[Sliding Window]\n   B --> C[Max Substring Length]\n```",
      drawings: []
    },
    theme: 'light' // 'light' (Warm Sand/Terracotta) or 'dark' (Warm Dusk)
  };
}

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialData();
      saveData(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    return {
      days: parsed.days || {},
      customHabits: parsed.customHabits || [],
      kanbanTasks: Array.isArray(parsed.kanbanTasks) ? parsed.kanbanTasks : DEFAULT_KANBAN_TASKS,
      canvasData: parsed.canvasData || { notes: '', drawings: [] },
      theme: parsed.theme || 'light'
    };
  } catch (err) {
    console.error('Error reading localStorage:', err);
    return getInitialData();
  }
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Error saving to localStorage:', err);
  }
}

export function getFormattedDate(dateObj = new Date()) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function calculateMetrics(data, selectedDateStr = getFormattedDate()) {
  const days = data.days || {};
  const allHabits = [...DEFAULT_HABITS, ...(data.customHabits || [])];
  const totalHabitsCount = allHabits.length;
  const numHabits = Math.max(totalHabitsCount, 1);

  const activeDates = new Set();
  let totalCompletedHabits = 0;
  let totalPossibleHabits = 0;
  let totalHoursSpent = 0;

  // Category hours
  const categoryHours = {
    Coding: 0,
    DSA: 0,
    College: 0,
    'Video Editing': 0
  };

  Object.entries(days).forEach(([dStr, entry]) => {
    const habits = entry.habits || {};
    const completedCount = Object.values(habits).filter(Boolean).length;
    const reflection = (entry.reflection || '').trim();
    const hours = entry.hours || {};

    const dayHours = Object.values(hours).reduce((acc, h) => acc + (Number(h) || 0), 0);
    totalHoursSpent += dayHours;

    categoryHours.Coding += Number(hours.coding || 0);
    categoryHours.DSA += Number(hours.dsa || 0);
    categoryHours.College += Number(hours.college || 0);
    categoryHours['Video Editing'] += Number(hours.video || 0);

    if (completedCount > 0 || reflection.length > 0 || dayHours > 0) {
      activeDates.add(dStr);
    }

    if (completedCount > 0) {
      totalCompletedHabits += completedCount;
      totalPossibleHabits += numHabits;
    }
  });

  const totalActiveDays = activeDates.size;

  // Current Streak Calculation
  let currentStreak = 0;
  const today = new Date();
  const todayStr = getFormattedDate(today);

  let checkDate = new Date(today);

  if (activeDates.has(todayStr)) {
    // Today is active
    while (activeDates.has(getFormattedDate(checkDate))) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  } else {
    // Check from yesterday
    checkDate.setDate(checkDate.getDate() - 1);
    while (activeDates.has(getFormattedDate(checkDate))) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  }

  // Longest Streak
  let longestStreak = 0;
  if (activeDates.size > 0) {
    const sorted = Array.from(activeDates).sort();
    let temp = 1;
    longestStreak = 1;
    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(sorted[i - 1]);
      const curr = new Date(sorted[i]);
      const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        temp++;
        if (temp > longestStreak) longestStreak = temp;
      } else {
        temp = 1;
      }
    }
  }

  // Overall completion rate
  const overallCompletionRate = totalPossibleHabits > 0 
    ? Math.round((totalCompletedHabits / totalPossibleHabits) * 100) 
    : 0;

  // Selected date completion
  const selectedEntry = days[selectedDateStr] || {};
  const selectedHabits = selectedEntry.habits || {};
  const selectedCompletedCount = allHabits.filter(h => selectedHabits[h.id]).length;
  const selectedCompletionRate = totalHabitsCount > 0 ? Math.round((selectedCompletedCount / totalHabitsCount) * 100) : 0;

  return {
    currentStreak,
    longestStreak,
    totalActiveDays,
    totalHoursSpent: Number(totalHoursSpent.toFixed(1)),
    overallCompletionRate,
    selectedCompletedCount,
    selectedCompletionRate,
    totalHabitsCount,
    categoryHours,
    activeDates: Array.from(activeDates)
  };
}
