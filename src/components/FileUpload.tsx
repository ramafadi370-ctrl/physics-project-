import React, { useRef } from 'react';
import {
  Paperclip,
  X,
  Image as ImageIcon,
  FileText,
  File
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';

interface FileUploadProps {
  onFileSelect: (
    file: File,
    data: string,
    type: 'image' | 'pdf' | 'text'
  ) => void;

  selectedFile: { name: string; type: string } | null;
  onClear: () => void;
}

/**
 * 🔥 helper: detect file type properly
 */
const detectFileType = (file: File): 'image' | 'pdf' | 'text' => {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type === 'application/pdf') return 'pdf';
  return 'text';
};

export default function FileUpload({
  onFileSelect,
  selectedFile,
  onClear
}: FileUploadProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * 📂 Handle file upload
   */
  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const type = detectFileType(file);

    // 🟢 IMAGE → base64
    if (type === 'image') {
      const reader = new FileReader();

      reader.onload = (event) => {
        const data = event.target?.result as string;
        onFileSelect(file, data, 'image');
      };

      reader.readAsDataURL(file);
      return;
    }

    // 🟡 PDF → keep raw for now (processing will happen later in chat/useChat)
    if (type === 'pdf') {
      const reader = new FileReader();

      reader.onload = (event) => {
        const data = event.target?.result as string;

        /**
         * ⚠️ مهم:
         * هنا لا نحول النص مباشرة
         * بل نمرره للـ AI layer لاحقاً (pdfToText)
         */
        onFileSelect(file, data, 'pdf');
      };

      reader.readAsDataURL(file);
      return;
    }

    // 🟢 TEXT FILE
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = event.target?.result as string;
      onFileSelect(file, data, 'text');
    };

    reader.readAsText(file);
  };

  /**
   * 🎨 file icon
   */
  const getFileIcon = () => {
    if (selectedFile?.type.startsWith('image/'))
      return <ImageIcon size={14} />;

    if (selectedFile?.type === 'application/pdf')
      return <FileText size={14} />;

    return <File size={14} />;
  };

  return (
    <div className="flex items-center gap-2">

      {/* 📎 selected file chip */}
      <AnimatePresence>
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex items-center gap-2 px-2 py-1 bg-indigo-600/20 border border-indigo-500/30 rounded-lg text-xs font-medium text-indigo-300"
          >
            {getFileIcon()}

            <span className="max-w-[100px] truncate">
              {selectedFile.name}
            </span>

            <button
              onClick={onClear}
              className="hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 📤 upload button */}
      <button
        onClick={() => fileInputRef.current?.click()}
        className="p-2 text-gray-500 hover:text-gray-300 transition-colors"
        title={t('file.upload')}
      >
        <Paperclip size={18} />
      </button>

      {/* 📁 hidden input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,.pdf,.txt"
      />
    </div>
  );
}