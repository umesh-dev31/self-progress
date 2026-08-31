import React, { useState } from 'react';
import { Settings as SettingsIcon, Trash2, Download, Upload, Moon, Sun, CheckCircle2 } from 'lucide-react';
import { getInitialData, saveData } from '../utils/storage';

export default function SettingsPage({ data, setData, theme, toggleTheme }) {
  const [resetConfirm, setResetConfirm] = useState(false);
  const [importedStatus, setImportedStatus] = useState('');

  const handleResetData = () => {
    const initial = getInitialData();
    setData(initial);
    saveData(initial);
    setResetConfirm(false);
    setImportedStatus('All data reset to fresh state!');
    setTimeout(() => setImportedStatus(''), 3000);
  };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `progress_pulse_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const handleImportJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.days) {
          setData(parsed);
          saveData(parsed);
          setImportedStatus('Backup imported successfully!');
        } else {
          setImportedStatus('Invalid backup file structure.');
        }
      } catch (err) {
        setImportedStatus('Failed to parse JSON file.');
      }
      setTimeout(() => setImportedStatus(''), 3000);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="neo-box p-6 bg-sand-200 dark:bg-neo-darkCard">
        <h2 className="text-xl md:text-3xl font-black text-neo-black dark:text-white uppercase tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-7 h-7 stroke-[3]" />
          <span>APP SETTINGS & DATA</span>
        </h2>
        <p className="text-xs md:text-sm font-bold text-neo-black/80 dark:text-sand-300 mt-1">
          Customize your brutal theme, manage local storage, and export backups.
        </p>
      </div>

      {importedStatus && (
        <div className="p-4 rounded-xl bg-neo-mint border-2 border-neo-black text-neo-black text-xs font-black flex items-center gap-2 shadow-neo-sm">
          <CheckCircle2 className="w-4 h-4 stroke-[3]" />
          <span>{importedStatus}</span>
        </div>
      )}

      {/* Theme Settings */}
      <div className="neo-box p-6 space-y-4">
        <h3 className="text-sm font-black text-neo-black dark:text-white uppercase">
          🎨 THEME VARIANT
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            onClick={() => theme === 'dark' && toggleTheme()}
            className={`p-4 rounded-xl border-2 border-neo-black dark:border-white/60 cursor-pointer transition-all flex items-center gap-3 shadow-neo-sm ${
              theme === 'light'
                ? 'bg-neo-yellow text-neo-black translate-x-[-2px] translate-y-[-2px] shadow-neo'
                : 'bg-white dark:bg-neo-darkCard hover:bg-sand-100 dark:hover:bg-dusk-800 text-neo-black dark:text-white'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-dusk-800 border-2 border-neo-black dark:border-white/60 text-neo-black dark:text-white flex items-center justify-center shadow-neo-sm">
              <Sun className="w-5 h-5 stroke-[3]" />
            </div>
            <div>
              <div className="text-xs font-black uppercase text-neo-black dark:text-white">
                LIGHT NEOBRUTAL
              </div>
              <div className="text-[11px] font-bold text-neo-black/80 dark:text-sand-300">
                Warm cream canvas & vibrant color blocks
              </div>
            </div>
          </div>

          <div
            onClick={() => theme === 'light' && toggleTheme()}
            className={`p-4 rounded-xl border-2 border-neo-black dark:border-white cursor-pointer transition-all flex items-center gap-3 shadow-neo-sm ${
              theme === 'dark'
                ? 'bg-neo-orange text-white translate-x-[-2px] translate-y-[-2px] shadow-neo'
                : 'bg-white dark:bg-neo-darkCard hover:bg-sand-100 text-neo-black dark:text-white'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-neo-black border-2 border-white text-neo-yellow flex items-center justify-center shadow-neo-sm">
              <Moon className="w-5 h-5 stroke-[3]" />
            </div>
            <div>
              <div className="text-xs font-black uppercase text-neo-black dark:text-white">
                DARK NEOBRUTAL
              </div>
              <div className="text-[11px] font-bold opacity-90 text-neo-black/80 dark:text-sand-200">
                Deep black with solid white edges & neon punch
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Backup & Import */}
      <div className="neo-box p-6 space-y-4">
        <h3 className="text-sm font-black text-neo-black dark:text-white uppercase">
          💾 DATA BACKUP & RESTORE
        </h3>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExportJSON}
            className="neo-btn bg-white dark:bg-dusk-800 px-4 py-2.5 text-xs flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-neo-terracotta stroke-[3]" />
            <span>EXPORT BACKUP (JSON)</span>
          </button>

          <label className="neo-btn bg-white dark:bg-dusk-800 px-4 py-2.5 text-xs flex items-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4 text-neo-terracotta stroke-[3]" />
            <span>RESTORE FROM JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Reset Danger Zone */}
      <div className="neo-box p-6 border-red-500 bg-red-50 dark:bg-red-950/30 space-y-3">
        <h3 className="text-sm font-black text-red-700 dark:text-red-400 flex items-center gap-2 uppercase">
          <Trash2 className="w-4 h-4 stroke-[3]" />
          <span>RESET ALL TRACKING DATA</span>
        </h3>
        <p className="text-xs font-bold text-red-600/90 dark:text-red-300/80">
          Clears all logged habits, streak records, reflection notes, and Kanban cards.
        </p>

        {!resetConfirm ? (
          <button
            onClick={() => setResetConfirm(true)}
            className="neo-btn bg-red-300 hover:bg-red-400 text-neo-black px-4 py-2 text-xs"
          >
            RESET WORKSPACE DATA
          </button>
        ) : (
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleResetData}
              className="neo-btn bg-red-600 text-white px-4 py-2 text-xs"
            >
              YES, CLEAR EVERYTHING
            </button>
            <button
              onClick={() => setResetConfirm(false)}
              className="neo-btn-secondary px-3 py-2 text-xs"
            >
              CANCEL
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
