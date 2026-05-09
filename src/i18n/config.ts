import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      sidebar: {
        newChat: 'New Chat',
        recent: 'Recent Conversations',
        empty: 'No conversations yet',
      },
      chat: {
        placeholder_explain: 'Ask me to explain something...',
        placeholder_summarize: 'Ask me to summarize a text or file...',
        placeholder_solve: 'Ask me to solve a problem...',
        send: 'Send',
        welcome: 'How can I help you today?',
        modes: {
          explain: 'Explain',
          summarize: 'Summarize',
          solve: 'Solve',
        }
      },
      settings: {
        title: 'Settings',
        language: 'Language',
        rtl: 'RTL Layout',
        apiKey: 'API Key',
        save: 'Save Changes',
        reset: 'Reset',
      },
      file: {
        upload: 'Upload File',
        image: 'Image',
        pdf: 'PDF',
        text: 'Text',
      }
    }
  },
  ar: {
    translation: {
      sidebar: {
        newChat: 'محادثة جديدة',
        recent: 'المحادثات الأخيرة',
        empty: 'لا توجد محادثات بعد',
      },
      chat: {
        placeholder_explain: 'اطلب مني شرح شيء ما...',
        placeholder_summarize: 'اطلب مني تلخيص نص أو ملف...',
        placeholder_solve: 'اطلب مني حل مشكلة...',
        send: 'إرسال',
        welcome: 'كيف يمكنني مساعدتك اليوم؟',
        modes: {
          explain: 'شرح',
          summarize: 'تلخيص',
          solve: 'حل',
        }
      },
      settings: {
        title: 'الإعدادات',
        language: 'اللغة',
        rtl: 'تنسيق من اليمين لليسار',
        apiKey: 'مفتاح API',
        save: 'حفظ التغييرات',
        reset: 'إعادة ضبط',
      },
      file: {
        upload: 'رفع ملف',
        image: 'صورة',
        pdf: 'PDF',
        text: 'نص',
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
