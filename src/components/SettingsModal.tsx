import { useTranslation } from "react-i18next";
import { useStore } from "../store/useStore";
import { X, Globe, MoveHorizontal, RefreshCcw, Save } from "lucide-react";
import { motion } from "motion/react";

interface SettingsModalProps {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const { t } = useTranslation();
  const { settings, updateSettings, resetSettings } = useStore();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-lg bg-[#121212] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="text-xl font-bold text-gray-100">
            {t("settings.title") || "Settings"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 transition-colors rounded-full hover:bg-white/5 text-gray-500 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Language Setting */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
              <Globe size={16} />
              <span>{t("settings.language") || "Language"}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 bg-black/20 p-1 rounded-xl">
              <button
                onClick={() => updateSettings({ language: "en" })}
                className={`py-3 rounded-lg text-sm font-semibold transition-all ${
                  settings.language === "en"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                English
              </button>
              <button
                onClick={() => updateSettings({ language: "ar" })}
                className={`py-3 rounded-lg text-sm font-semibold transition-all ${
                  settings.language === "ar"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                العربية
              </button>
            </div>
          </div>

          {/* RTL Setting */}
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
            <div className="flex items-center gap-3">
              <MoveHorizontal size={20} className="text-blue-400" />
              <span className="font-medium text-gray-200">
                {t("settings.rtl") || "RTL Layout"}
              </span>
            </div>
            <button
              onClick={() => updateSettings({ rtl: !settings.rtl })}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.rtl ? "bg-blue-600" : "bg-gray-700"
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.rtl ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>

          {/* Info Banner */}
          <div className="p-4 bg-blue-600/10 border border-blue-500/20 rounded-xl">
            <p className="text-xs text-blue-400 leading-relaxed">
              API keys are configured via environment variables. Edit{" "}
              <code className="font-mono bg-black/40 px-1 rounded">.env</code>{" "}
              in your project root to update API configurations.
            </p>
          </div>
        </div>

        <div className="px-6 py-4 bg-black/40 border-t border-white/5 flex items-center justify-between">
          <button
            onClick={resetSettings}
            className="flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors"
          >
            <RefreshCcw size={14} />
            {t("settings.reset") || "Reset"}
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all active:scale-[0.98] shadow-lg shadow-blue-500/20"
          >
            <Save size={18} />
            {t("settings.save") || "Close"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
