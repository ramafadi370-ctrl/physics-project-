/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from './store/useStore';
import Dashboard from './pages/Dashboard';

export default function App() {
  const { i18n } = useTranslation();
  const { settings } = useStore();

  useEffect(() => {
    i18n.changeLanguage(settings.language);
    document.documentElement.dir = settings.rtl ? 'rtl' : 'ltr';
    document.documentElement.lang = settings.language;
    
    // Core dark mode by default
    document.documentElement.classList.add('dark');
  }, [settings.language, settings.rtl, i18n]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 selection:bg-blue-500/30 font-sans">
      <Dashboard />
    </div>
  );
}
