// FileUploadModal.tsx
"use client";
import React from "react";
import FileUploadDemo from "./fileupload";

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-black dark:bg-neutral-800 p-6 rounded-lg shadow-lg max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-neutral-500 hover:text-neutral-800"
        >
          &times;
        </button>
        <FileUploadDemo />
      </div>
    </div>
  );
};

export default FileUploadModal;
