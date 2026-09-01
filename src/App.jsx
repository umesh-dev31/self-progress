import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MobileBottomNav from './components/MobileBottomNav';
import PwaInstallBanner from './components/PwaInstallBanner';
import DashboardPage from './pages/DashboardPage';
import HabitsPage from './pages/HabitsPage';
import KanbanPage from './pages/KanbanPage';
import JournalPage from './pages/JournalPage';
import CanvasPage from './pages/CanvasPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import { loadData, saveData, calculateMetrics, getFormattedDate } from './utils/storage';

export default function App() {
  const [data, setData] = useState(() => loadData());
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedDateStr, setSelectedDateStr] = useState(() => getFormattedDate(new Date()));
  const [theme, setTheme] = useState(data.theme || 'light');
  const [openHabitForm, setOpenHabitForm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auto-save data when updated
  useEffect(() => {
    saveData(data);
  }, [data]);

  // Apply dark theme class to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    setData(prev => ({ ...prev, theme: nextTheme }));
  };

  const metrics = calculateMetrics(data, selectedDateStr);

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <DashboardPage
            data={data}
            setData={setData}
            selectedDateStr={selectedDateStr}
            metrics={metrics}
            setActivePage={setActivePage}
          />
        );
      case 'habits':
        return (
          <HabitsPage
            data={data}
            setData={setData}
            selectedDateStr={selectedDateStr}
            metrics={metrics}
            openAddFormTrigger={openHabitForm}
            onFormClosed={() => setOpenHabitForm(false)}
          />
        );
      case 'kanban':
        return (
          <KanbanPage
            data={data}
            setData={setData}
          />
        );
      case 'journal':
        return (
          <JournalPage
            data={data}
            setData={setData}
            selectedDateStr={selectedDateStr}
          />
        );
      case 'canvas':
        return (
          <CanvasPage
            data={data}
            setData={setData}
          />
        );
      case 'analytics':
        return (
          <AnalyticsPage
            data={data}
            metrics={metrics}
          />
        );
      case 'settings':
        return (
          <SettingsPage
            data={data}
            setData={setData}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        );
      default:
        return (
          <DashboardPage
            data={data}
            setData={setData}
            selectedDateStr={selectedDateStr}
            metrics={metrics}
            setActivePage={setActivePage}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex bg-sand-50 dark:bg-dusk-950 text-clay-900 dark:text-sand-100 font-sans transition-colors duration-200">
      {/* PWA 1-Tap Install Prompt Banner */}
      <PwaInstallBanner />

      {/* SaaS Left Sidebar (Responsive Drawer on Mobile, Sticky on Desktop) */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        theme={theme}
        toggleTheme={toggleTheme}
        metrics={metrics}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Page Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          selectedDateStr={selectedDateStr}
          setSelectedDateStr={setSelectedDateStr}
          metrics={metrics}
          onQuickAction={() => {
            setActivePage('habits');
            setOpenHabitForm(true);
          }}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-6xl w-full mx-auto pb-24 md:pb-8">
          {renderActivePage()}
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <MobileBottomNav
          activePage={activePage}
          setActivePage={setActivePage}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          metrics={metrics}
        />
      </div>
    </div>
  );
}
