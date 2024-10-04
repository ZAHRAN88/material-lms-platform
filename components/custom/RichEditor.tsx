"use client"

import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import { useMemo } from "react";

interface RichEditorProps {
  placeholder: string;
  onChange: (value: string) => void;
  value?: string;
  className?: string;
  toolbarClassName?: string;
  editorClassName?: string;
  language: 'ar' | 'en';
}

const RichEditor = ({ 
  placeholder, 
  onChange, 
  value, 
  className, 
  toolbarClassName, 
  editorClassName,
  language
}: RichEditorProps) => {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );

  const isRTL = language === 'ar';

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      [{ 'direction': 'rtl' }],
      ['clean'],
    ],
  };

  return (
    <div className={`rich-editor-wrapper ${className} ${isRTL ? 'rtl' : 'ltr'}`}>
      <ReactQuill
        theme="snow"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        modules={modules}
        className={`bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${toolbarClassName}`}
      />
      <style jsx global>{`
        .rich-editor-wrapper .ql-toolbar {
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
          border-color: #e5e7eb;
          background-color: #f9fafb;
          ${toolbarClassName ? '' : 'background-color: #f9fafb;'}
        }
        .dark .rich-editor-wrapper .ql-toolbar {
          border-color: #4b5563;
          background-color: #374151;
          ${toolbarClassName ? '' : 'background-color: #374151;'}
        }
        .rich-editor-wrapper .ql-container {
          border-bottom-left-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
          border-color: #e5e7eb;
          min-height: 200px;
          ${editorClassName ? '' : 'min-height: 200px;'}
        }
        .dark .rich-editor-wrapper .ql-container {
          border-color: #4b5563;
        }
        .rich-editor-wrapper .ql-editor {
          font-size: 0.875rem;
          line-height: 1.25rem;
          ${editorClassName || ''}
        }
        .dark .rich-editor-wrapper .ql-editor {
          color: #e5e7eb;
        }
        .rich-editor-wrapper .ql-editor.ql-blank::before {
          color: #9ca3af;
        }
        .dark .rich-editor-wrapper .ql-editor.ql-blank::before {
          color: #6b7280;
        }
        .rich-editor-wrapper .ql-snow.ql-toolbar button,
        .rich-editor-wrapper .ql-snow .ql-toolbar button {
          color: #4b5563;
        }
        .dark .rich-editor-wrapper .ql-snow.ql-toolbar button,
        .dark .rich-editor-wrapper .ql-snow .ql-toolbar button {
          color: #e5e7eb;
        }
        .rich-editor-wrapper .ql-snow.ql-toolbar button:hover,
        .rich-editor-wrapper .ql-snow .ql-toolbar button:hover,
        .rich-editor-wrapper .ql-snow.ql-toolbar button.ql-active,
        .rich-editor-wrapper .ql-snow .ql-toolbar button.ql-active {
          color: #2563eb;
        }
        .dark .rich-editor-wrapper .ql-snow.ql-toolbar button:hover,
        .dark .rich-editor-wrapper .ql-snow .ql-toolbar button:hover,
        .dark .rich-editor-wrapper .ql-snow.ql-toolbar button.ql-active,
        .dark .rich-editor-wrapper .ql-snow.ql-toolbar button.ql-active {
          color: #3b82f6;
        }
        .rich-editor-wrapper.rtl .ql-editor {
          direction: rtl;
          text-align: right;
        }
        .rich-editor-wrapper.rtl .ql-align-center {
          text-align: center;
        }
        .rich-editor-wrapper.rtl .ql-align-right {
          text-align: left;
        }
        .rich-editor-wrapper.rtl .ql-align-left {
          text-align: right;
        }
      `}</style>
    </div>
  );
};

export default RichEditor;