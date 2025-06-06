import React, { useState, useRef } from "react";

export const Post = ({ onClose }) => {
  const [selectedTab, setSelectedTab] = useState('upload'); // 'upload' or 'gallery'
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [completedFiles, setCompletedFiles] = useState([]);
  const fileInputRef = useRef(null);
  
  // Mock gallery files - replace with actual data
  const galleryFiles = [
    { id: 1, name: 'design-portfolio.pdf', size: '2.1 MB', type: 'pdf' },
    { id: 2, name: 'web-mockups.pdf', size: '3.4 MB', type: 'pdf' },
    { id: 3, name: 'mobile-designs.pdf', size: '1.8 MB', type: 'pdf' },
    { id: 4, name: 'branding-guide.pdf', size: '4.2 MB', type: 'pdf' },
    { id: 5, name: 'ui-components.pdf', size: '2.7 MB', type: 'pdf' },
  ];

const categories = [
  'Design Portfolio',
  'Styling Portfolio',
  'Textile Design Portfolio',
  'Communication Portfolio',
  'Merchandising Portfolio',
  'Illustration Portfolio',
  'Digital Portfolio'
];

  // Simulate file upload progress
  const simulateUpload = (file) => {
    const fileId = Date.now() + Math.random();
    const newFile = {
      id: fileId,
      name: file.name,
      size: file.size,
      progress: 0,
      totalSize: file.size
    };

    setUploadingFiles(prev => [...prev, newFile]);
    setSelectedTab('upload'); // Switch to upload tab to show progress

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5; // Random progress increment
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Move to completed files
        setTimeout(() => {
          setUploadingFiles(prev => prev.filter(f => f.id !== fileId));
          setCompletedFiles(prev => [...prev, {
            id: fileId,
            name: file.name,
            size: file.size,
            type: file.type
          }]);
        }, 500);
      }

      setUploadingFiles(prev => 
        prev.map(f => f.id === fileId ? { ...f, progress: Math.min(progress, 100) } : f)
      );
    }, 200);
  };

  // Handle PC file upload
  const handlePCUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      simulateUpload(file);
    });
    // Reset input
    event.target.value = '';
  };

  // Handle gallery file selection
  const handleGallerySelect = (galleryFile) => {
    // Create a mock File object for gallery selection
    const mockFile = {
      name: galleryFile.name,
      size: parseInt(galleryFile.size.replace(' MB', '')) * 1024 * 1024, // Convert to bytes
      type: 'application/pdf'
    };
    simulateUpload(mockFile);
  };

  // Remove file from upload queue
  const removeUploadingFile = (fileId) => {
    setUploadingFiles(prev => prev.filter(f => f.id !== fileId));
  };

  // Remove completed file
  const removeCompletedFile = (fileId) => {
    setCompletedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx"
          className="hidden"
        />

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Upload Portfolio</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
          >
            <span className="text-gray-600 text-xl">×</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 ">
          {/* Upload Options */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => {
                setSelectedTab('upload');
                handlePCUpload();
              }}
              className={`group relative overflow-hidden border-2 border-dashed rounded-lg p-4 transition-all duration-300 hover:scale-105 ${
                selectedTab === 'upload' 
                  ? 'bg-gradient-to-br from-blue-100 to-blue-200 border-blue-400' 
                  : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300 hover:border-blue-400'
              }`}
            >
              <div className="flex flex-col items-center space-y-2 ">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-200">
                  <span className="text-white text-sm">💻</span>
                </div>
                <span className="font-semibold text-blue-700 text-sm">From PC</span>
                <span className="text-xs text-blue-600 text-center">
                  Upload files from computer
                </span>
              </div>
            </button>

            <button 
              onClick={() => setSelectedTab('gallery')}
              className={`group relative overflow-hidden border-2 border-dashed rounded-lg p-4 transition-all duration-300 hover:scale-105 ${
                selectedTab === 'gallery' 
                  ? 'bg-gradient-to-br from-purple-100 to-purple-200 border-purple-400' 
                  : 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-300 hover:border-purple-400'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center group-hover:bg-purple-600 transition-colors duration-200">
                  <span className="text-white text-sm">🖼️</span>
                </div>
                <span className="font-semibold text-purple-700 text-sm">
                  From Gallery
                </span>
                <span className="text-xs text-purple-600 text-center">
                  Choose existing files
                </span>
              </div>
            </button>
          </div>

          {/* Content based on selected tab */}
          {selectedTab === 'upload' ? (
            <div className="space-y-4">
              {/* Uploading Files */}
              {uploadingFiles.map((file) => (
                <div key={file.id} className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-blue-500">📄</span>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.totalSize * file.progress / 100)} / {formatFileSize(file.totalSize)} ({Math.round(file.progress)}%)
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeUploadingFile(file.id)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <span className="text-lg">×</span>
                    </button>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${file.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}

              {/* Completed Files */}
              {completedFiles.map((file) => (
                <div key={file.id} className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-green-500">✅</span>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">
                          {file.name}
                        </p>
                        <p className="text-xs text-green-600">Upload complete</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                    
                      <button 
                        onClick={() => removeCompletedFile(file.id)}
                        className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                      >
                        <span className="text-gray-600 text-xs">🗑️</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

            
            </div>
          ) : (
            /* Gallery View */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-800">Select from Gallery</h3>
                <span className="text-xs text-gray-500">{galleryFiles.length} files</span>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {galleryFiles.map((file) => (
                  <div key={file.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-red-500">📄</span>
                        <div>
                          <p className="font-medium text-gray-800 text-sm">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">{file.size}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleGallerySelect(file)}
                        className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                      >
                        Select
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Portfolio Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Portfolio Category
            </label>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 flex items-center justify-between text-left"
              >
                <span className="text-gray-700">
                  {selectedCategory || 'Select Portfolio Type'}
                </span>
                <span className={`text-gray-500 transform transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="py-1 max-h-40 overflow-y-auto">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150"
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
              rows="3"
              placeholder="Add a description for your portfolio..."
            ></textarea>
          </div>
        </div>

        {/* Footer with buttons */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
            <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl">
              Post Portfolio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};