import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Share } from 'lucide-react';

export default function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already running in standalone mode (installed)
    const isApp = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    setIsStandalone(isApp);
    if (isApp) return;

    // Check iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Listen for beforeinstallprompt (Android / Chrome)
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Check if user dismissed banner recently
      const dismissed = localStorage.getItem('pwa_banner_dismissed');
      if (!dismissed) {
        setShowBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // If on iOS and not dismissed, show banner
    if (isIosDevice && !localStorage.getItem('pwa_banner_dismissed')) {
      setShowBanner(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowBanner(false);
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      setShowIOSInstructions(true);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('pwa_banner_dismissed', 'true');
  };

  if (isStandalone || !showBanner) return null;

  return (
    <>
      {/* Floating Neobrutalist Install Toast / Banner */}
      <div className="fixed top-20 right-4 left-4 md:left-auto md:w-96 z-50 animate-bounce-in">
        <div className="bg-neo-yellow border-2 border-neo-black text-neo-black p-3.5 rounded-2xl shadow-neo flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neo-black text-neo-yellow flex items-center justify-center shrink-0 border border-neo-black">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wide">
                Get Mobile App
              </div>
              <div className="text-[11px] font-bold text-clay-800 leading-tight">
                Install Progress Pulse on your phone home screen!
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-3 py-1.5 bg-neo-black text-white hover:bg-clay-800 border-2 border-neo-black rounded-xl text-xs font-black shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>INSTALL</span>
            </button>
            <button
              onClick={handleDismiss}
              className="p-1 hover:bg-black/10 rounded-lg text-neo-black transition-colors"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* iOS Instructions Modal */}
      {showIOSInstructions && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-white dark:bg-neo-darkCard border-3 border-neo-black dark:border-white/80 rounded-2xl p-6 max-w-sm w-full shadow-neo text-neo-black dark:text-white relative">
            <button
              onClick={() => setShowIOSInstructions(false)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-sand-200 dark:hover:bg-dusk-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-neo-cyan border-2 border-neo-black flex items-center justify-center text-neo-black">
                <Share className="w-4 h-4" />
              </div>
              <h3 className="font-black text-base">Install on iPhone / iPad</h3>
            </div>

            <ol className="space-y-3 text-xs font-bold text-clay-700 dark:text-sand-200 list-decimal list-inside my-4">
              <li>Tap the <span className="underline font-black text-neo-terracotta">Share button</span> at the bottom of Safari.</li>
              <li>Scroll down and tap <span className="underline font-black text-neo-terracotta">"Add to Home Screen"</span>.</li>
              <li>Tap <span className="underline font-black text-neo-terracotta">"Add"</span> in the top-right corner.</li>
            </ol>

            <button
              onClick={() => setShowIOSInstructions(false)}
              className="w-full neo-btn bg-neo-yellow text-neo-black py-2.5 font-black text-xs"
            >
              GOT IT! 👍
            </button>
          </div>
        </div>
      )}
    </>
  );
}
