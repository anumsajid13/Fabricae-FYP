import React, { useState, useRef, useEffect } from "react";

export const Post = ({ onClose, onUploadSuccess }) => {
  const [selectedTab, setSelectedTab] = useState("upload");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [completedFiles, setCompletedFiles] = useState([]);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [galleryError, setGalleryError] = useState(null);
  const [portfolioName, setPortfolioName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const fileInputRef = useRef(null);
  const [userEmail, setUserEmail] = useState("");

  const categories = [
    "Design Portfolio",
    "Styling Portfolio",
    "Textile Design Portfolio",
    "Communication Portfolio",
    "Merchandising Portfolio",
    "Illustration Portfolio",
    "Digital Portfolio",
  ];

  // Check if form is ready to submit
  const isFormValid =
    portfolioName && selectedCategory && completedFiles.length > 0;

  // Disable upload options when a file is selected
  const isUploadDisabled = completedFiles.length > 0;

  useEffect(() => {
    const emailFromStorage = localStorage.getItem("userEmail");
    setUserEmail(emailFromStorage);
    if (selectedTab === "gallery" && emailFromStorage) {
      fetchUserPortfolios();
    }
  }, [selectedTab]);

  const fetchUserPortfolios = async () => {
    setLoadingGallery(true);
    setGalleryError(null);
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/profile/${encodeURIComponent(
          userEmail
        )}/getPort`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch portfolios");
      }
      const data = await response.json();
      setGalleryFiles(
        data.portfolioPdfUrls.map((url, index) => {
          const encodedPath = url.split("/o/")[1].split("?")[0];
          const decodedPath = decodeURIComponent(encodedPath);
          const fileName = decodedPath.split("/").pop();

          return {
            id: index,
            name: fileName || `portfolio-${index}.pdf`,
            url: url,
            size: "N/A",
            type: "pdf",
          };
        })
      );
    } catch (error) {
      console.error("Error fetching portfolios:", error);
      setGalleryError(error.message);
    } finally {
      setLoadingGallery(false);
    }
  };

  // Fixed file upload to Firebase function
  const uploadFileToFirebase = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", userEmail);

    const response = await fetch("http://localhost:5000/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload file to Firebase");
    }

    const data = await response.json();
    return data.downloadUrl;
  };

  const simulateUpload = async (file, isFromGallery = false) => {
    // Clear any existing files first
    setUploadingFiles([]);
    setCompletedFiles([]);

    const fileId = Date.now() + Math.random();
    let fileUrl = file.url; // For gallery files

    const newFile = {
      id: fileId,
      name: file.name,
      size: file.size,
      progress: 0,
      totalSize: file.size,
      type: file.type,
      url: fileUrl,
    };

    setUploadingFiles([newFile]);
    setSelectedTab("upload");

    try {
      // If it's a new file from PC, upload it to Firebase
      if (!isFromGallery && file instanceof File) {
        let progress = 0;
        const progressInterval = setInterval(() => {
          progress += Math.random() * 15 + 5;
          if (progress >= 90) {
            clearInterval(progressInterval);
          }
          setUploadingFiles((prev) =>
            prev.map((f) =>
              f.id === fileId ? { ...f, progress: Math.min(progress, 90) } : f
            )
          );
        }, 200);

        // Upload to Firebase
        fileUrl = await uploadFileToFirebase(file);
        clearInterval(progressInterval);

        // Complete progress
        setUploadingFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, progress: 100 } : f))
        );
      } else {
        // For gallery files, just simulate quick progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 20 + 10;

          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
          }

          setUploadingFiles((prev) =>
            prev.map((f) =>
              f.id === fileId ? { ...f, progress: Math.min(progress, 100) } : f
            )
          );
        }, 100);
      }

      // Move to completed files after a short delay
      setTimeout(() => {
        setUploadingFiles([]);
        setCompletedFiles([
          {
            id: fileId,
            name: file.name,
            size: file.size,
            type: file.type,
            url: fileUrl,
          },
        ]);
      }, 500);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadingFiles([]);
      setSubmitError("Failed to upload file: " + error.message);
    }
  };

  const handlePCUpload = () => {
    if (!isUploadDisabled) {
      fileInputRef.current?.click();
    }
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      simulateUpload(files[0], false); // false = not from gallery
    }
    event.target.value = "";
  };

  const handleGallerySelect = (galleryFile) => {
    if (!isUploadDisabled) {
      const mockFile = {
        name: galleryFile.name,
        size: 0,
        type: "application/pdf",
        url: galleryFile.url,
      };
      simulateUpload(mockFile, true); // true = from gallery
    }
  };

  const removeCompletedFile = () => {
    setCompletedFiles([]);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatFileName = (name) => {
    const cleanName = name
      .replace(/\.[^/.]+$/, "")
      .replace(/[_-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return cleanName.length > 20
      ? cleanName.substring(0, 20) + "..."
      : cleanName;
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const file = completedFiles[0];
      const response = await fetch(
        "http://localhost:5000/api/user-portfolios/upload",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userEmail,
            name: portfolioName,
            category: selectedCategory,
            description: description,
            pdfUrl: file.url,
            fileName: file.name,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload portfolio");
      }

      const data = await response.json();
      console.log("Portfolio uploaded:", data);

      // Call success callback with the new portfolio
      if (onUploadSuccess) {
        onUploadSuccess(data.portfolio);
      }

      // Close modal and reset form
      onClose();
      setPortfolioName("");
      setDescription("");
      setSelectedCategory("");
      setCompletedFiles([]);
    } catch (error) {
      console.error("Error uploading portfolio:", error);
      setSubmitError(error.message || "Failed to upload portfolio");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx"
          className="hidden"
        />

        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Upload Portfolio</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
          >
            <span className="text-gray-600 text-xl">×</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Portfolio Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Portfolio Name *
            </label>
            <input
              type="text"
              value={portfolioName}
              onChange={(e) => setPortfolioName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="My Awesome Portfolio"
              required
            />
          </div>

          {/* Upload Options */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                setSelectedTab("upload");
                handlePCUpload();
              }}
              disabled={isUploadDisabled}
              className={`group relative overflow-hidden border-2 border-dashed rounded-lg p-4 transition-all duration-300 hover:scale-105 ${
                selectedTab === "upload"
                  ? "bg-gradient-to-br from-blue-100 to-blue-200 border-blue-400"
                  : "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300 hover:border-blue-400"
              } ${isUploadDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${
                    isUploadDisabled
                      ? "bg-gray-400"
                      : "bg-blue-500 group-hover:bg-blue-600"
                  }`}
                >
                  <span className="text-white text-sm">💻</span>
                </div>
                <span className="font-semibold text-blue-700 text-sm">
                  From PC
                </span>
                <span className="text-xs text-blue-600 text-center">
                  Upload files from computer
                </span>
              </div>
            </button>

            <button
              onClick={() => setSelectedTab("gallery")}
              disabled={isUploadDisabled}
              className={`group relative overflow-hidden border-2 border-dashed rounded-lg p-4 transition-all duration-300 hover:scale-105 ${
                selectedTab === "gallery"
                  ? "bg-gradient-to-br from-purple-100 to-purple-200 border-purple-400"
                  : "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-300 hover:border-purple-400"
              } ${isUploadDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${
                    isUploadDisabled
                      ? "bg-gray-400"
                      : "bg-purple-500 group-hover:bg-purple-600"
                  }`}
                >
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

          {/* File Display */}
          {completedFiles.length > 0 ? (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-green-500">✅</span>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">
                      {formatFileName(completedFiles[0].name)}
                    </p>
                    <p className="text-xs text-green-600">
                      {completedFiles[0].size
                        ? `Upload complete • ${formatFileSize(
                            completedFiles[0].size
                          )}`
                        : "File selected"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={removeCompletedFile}
                  className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <span className="text-gray-600 text-xs">🗑️</span>
                </button>
              </div>
            </div>
          ) : uploadingFiles.length > 0 ? (
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span className="text-blue-500">📄</span>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">
                      {formatFileName(uploadingFiles[0].name)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(
                        (uploadingFiles[0].totalSize *
                          uploadingFiles[0].progress) /
                          100
                      )}{" "}
                      / {formatFileSize(uploadingFiles[0].totalSize)} (
                      {Math.round(uploadingFiles[0].progress)}%)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setUploadingFiles([])}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <span className="text-lg">×</span>
                </button>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${uploadingFiles[0].progress}%` }}
                ></div>
              </div>
            </div>
          ) : selectedTab === "gallery" ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-800">
                  Select from Gallery
                </h3>
                {!loadingGallery && (
                  <span className="text-xs text-gray-500">
                    {galleryFiles.length} files
                  </span>
                )}
              </div>

              {loadingGallery ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : galleryError ? (
                <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-600">
                  <p>Error loading gallery: {galleryError}</p>
                  <button
                    onClick={fetchUserPortfolios}
                    className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : galleryFiles.length === 0 ? (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-gray-600 text-center">
                  No portfolio files found in your gallery
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {galleryFiles.map((file) => (
                    <div
                      key={file.id}
                      className="bg-gray-50 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-red-500">📄</span>
                          <div>
                            <p className="font-medium text-gray-800 text-sm truncate max-w-[180px]">
                              {formatFileName(file.name)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {file.size === "N/A"
                                ? "Size not available"
                                : file.size}
                            </p>
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
              )}
            </div>
          ) : null}

          {/* Portfolio Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Portfolio Category *
            </label>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 flex items-center justify-between text-left"
              >
                <span className="text-gray-700">
                  {selectedCategory || "Select Portfolio Type"}
                </span>
                <span
                  className={`text-gray-500 transform transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                >
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
              rows="3"
              placeholder="Add a description for your portfolio..."
            ></textarea>
          </div>

          {submitError && (
            <div className="bg-red-50 p-3 rounded-lg border border-red-200 text-red-600 text-sm">
              {submitError}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !isFormValid}
              className={`flex-1 px-6 py-3 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center ${
                isFormValid
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-400 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                "Post Portfolio"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
