// FileUploadDemo.tsx
"use client";
import React, { useState } from "react";
import { FileUpload } from "../ui/file-upload";

const FileUploadDemo: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = (files: File[]) => {
    setFiles(files);
    console.log(files);
  };

  return (
    <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-black border-neutral-800 rounded-lg">
      <FileUpload onChange={handleFileUpload} />
    </div>
  );
};

export default FileUploadDemo; // Ensure it's a default export
