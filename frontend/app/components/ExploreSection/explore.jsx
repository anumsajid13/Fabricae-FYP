import React, { useState, useEffect } from "react";
import { Post } from "./post";
import "./style.css";

export default function ExploreSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userProfiles, setUserProfiles] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);
  const [userEmail, setUserEmail] = useState("");

  // Get user email from localStorage
  useEffect(() => {
    const emailFromStorage = localStorage.getItem("userEmail");
    setUserEmail(emailFromStorage || "");
  }, []);

  // Fetch portfolios from backend
  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:5000/api/user-portfolios/?page=${currentPage}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch portfolios");
        }

        const data = await response.json();
        setPortfolios(data.portfolios);
        setTotalPages(data.pagination.totalPages);
        setError(null);

        await fetchUserProfiles(data.portfolios);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching portfolios:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, [currentPage, refreshKey]);

  const fetchUserProfiles = async (portfolios) => {
    const uniqueEmails = [...new Set(portfolios.map((p) => p.email))];
    const profiles = {};

    await Promise.all(
      uniqueEmails.map(async (email) => {
        try {
          const response = await fetch(
            `http://localhost:5000/api/users/profile/${encodeURIComponent(
              email
            )}`
          );

          if (response.ok) {
            const data = await response.json();
            profiles[email] = data;
          }
        } catch (err) {
          console.error(`Error fetching profile for ${email}:`, err);
        }
      })
    );

    setUserProfiles(profiles);
  };

  // Handle PDF viewing - Open in new tab
  const handleViewPdf = (pdfUrl) => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    }
  };

  // Handle portfolio deletion
  const handleDeletePortfolio = async (portfolioId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/user-portfolios/${portfolioId}`,
        {
          method: "DELETE",
          headers: {
            email: userEmail, // Send email in headers for authorization
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete portfolio");
      }

      // Remove the portfolio from local state
      setPortfolios((prevPortfolios) =>
        prevPortfolios.filter((portfolio) => portfolio._id !== portfolioId)
      );
    } catch (error) {
      console.error("Error deleting portfolio:", error);
      alert("Error deleting portfolio: " + error.message);
    }
  };

  // Handle Chat Now functionality
  const handleChatNow = async (receiverEmail) => {
    if (!userEmail) {
      alert("Please log in to start a chat");
      return;
    }

    if (userEmail === receiverEmail) {
      alert("You cannot chat with yourself");
      return;
    }

    try {
      // Get sender's name from user profiles or email
      const senderName = getUserDisplayName(userEmail);
      const receiverName = getUserDisplayName(receiverEmail);

      // Create automated message
      const messageText = `Hello ${receiverName}! This is ${senderName}. I came across your portfolio and I'm really impressed with your work. I'd love to connect and discuss potential collaboration opportunities. Looking forward to hearing from you!`;

      const response = await fetch("http://localhost:5000/api/chat/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderEmail: userEmail,
          receiverEmail: receiverEmail,
          messageText: messageText,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create chat");
      }

      const data = await response.json();
      console.log("Chat created successfully:", data);

      // Redirect to chat page
      window.location.href = `/Chat`;
    } catch (error) {
      console.error("Error creating chat:", error);
      alert("Error starting chat: " + error.message);
    }
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getUserProfilePicture = (email) => {
    if (userProfiles[email]?.profilePictureUrl) {
      return userProfiles[email].profilePictureUrl;
    }
    return `https://i.pravatar.cc/80?u=${email}`;
  };

  const getUserDisplayName = (email) => {
    if (userProfiles[email]) {
      const { firstname, lastname } = userProfiles[email];
      if (firstname && lastname) return `${firstname} ${lastname}`;
      if (firstname) return firstname;
    }
    return email.split("@")[0];
  };

  const handleUploadSuccess = (newPortfolio) => {
    setPortfolios((prevPortfolios) => [newPortfolio, ...prevPortfolios]);
    setRefreshKey((prev) => prev + 1);
  };

  // Function to get thumbnail URL with fallbacks
  const getThumbnailUrl = (portfolio) => {
    // If thumbnail is available and generated, use it
    if (portfolio.thumbnailUrl && portfolio.thumbnailStatus === "generated") {
      return portfolio.thumbnailUrl;
    }

    // If thumbnail is pending or failed, show a placeholder
    if (portfolio.thumbnailStatus === "pending") {
      return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjEwMCIgcj0iMjAiIGZpbGw9IiM5Q0E0QUYiLz4KPGFuZXh0IHg9IjE1MCIgeT0iMTMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjM3Mzg1IiBmb250LXNpemU9IjEyIj5HZW5lcmF0aW5nLi4uPC90ZXh0Pgo8L3N2Zz4K";
    }

    // Default fallback for failed or missing thumbnails
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjEyNSIgeT0iNzUiIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgZmlsbD0iIzlDQTNBRiIvPgo8dGV4dCB4PSIxNTAiIHk9IjEzNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzYzNzM4NSIgZm9udC1zaXplPSIxMiI+UERGIFBvcnRmb2xpbzwvdGV4dD4KPC9zdmc+";
  };

  return (
    <div id="webcrumbs">
      {/* Background Video Section */}
      <div className="h-[450px] w-full rounded-md bg-[#E7E4D8] relative flex flex-col items-center justify-center antialiased">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          src="/Gradient.mp4"
          autoPlay
          loop
          muted
        ></video>

        <div className="relative z-10 max-w-1xl mx-auto p-4 h-64 flex flex-col justify-center font-custom">
          <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-sm">
            Where Fashion Design Meets Opportunity
          </h2>
          <br></br>
          <p className="text-white drop-shadow-sm text-center self-center font-para">
            Connect with top designers, showcase your portfolio, or discover the
            next big fashion talent all in one place.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative min-h-screen bg-[#E7E4D8]">
        {/* Trending Portfolios */}
        <section className="py-10 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-[#822538]">
              Trending Portfolios
            </h2>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="rounded-full bg-primary-50 p-2 hover:bg-primary-100 transition-colors"
                title="Upload Portfolio"
              >
                <span className="material-symbols-outlined text-[#822538]">
                  add_circle
                </span>
              </button>

              <button
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
                className="rounded-full bg-primary-50 p-2 hover:bg-primary-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Next Page"
              >
                <span className="material-symbols-outlined text-[#822538]">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#822538]"></div>
              <p className="ml-4 text-[#822538]">Loading portfolios...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-600 text-center">
              <p>Error loading portfolios: {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 px-4 py-2 bg-[#822538] text-white rounded-md hover:bg-[#b4707e] transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : portfolios.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold text-[#822538] mb-2">
                No Portfolios Yet
              </h3>
              <p className="text-neutral-600 mb-4">
                Be the first to share your amazing work!
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-[#822538] text-white rounded-md hover:bg-[#b4707e] transition-colors"
              >
                Upload Your Portfolio
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolios.map((portfolio) => (
                <div
                  key={portfolio._id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col min-h-[400px]" // Added flex-col and min-h
                >
                  <div className="h-48 overflow-hidden relative group">
                    {/* PDF Thumbnail with fallbacks */}
                    <img
                      src={getThumbnailUrl(portfolio)}
                      alt={portfolio.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src =
                          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjEyNSIgeT0iNzUiIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgZmlsbD0iIzlDQTNBRiIvPgo8dGV4dCB4PSIxNTAiIHk9IjEzNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzYzNzM4NSIgZm9udC1zaX6PSIxMiI+UERGIFBvcnRmb2xpbzwvdGV4dD4KPC9zdmc+";
                      }}
                    />

                    {/* Overlay button to view PDF */}
                    <button
                      onClick={() => handleViewPdf(portfolio.pdfUrl)}
                      className="absolute inset-0 w-full h-full flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300"
                      title="Click to open PDF in new tab"
                    >
                      <span className="bg-white rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="material-symbols-outlined text-[#822538] text-2xl">
                          open_in_new
                        </span>
                      </span>
                    </button>

                    {/* Delete button - only show for portfolio owner */}
                    {userEmail && portfolio.email === userEmail && (
                      <button
                        onClick={() => handleDeletePortfolio(portfolio._id)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        title="Delete Portfolio"
                      >
                        <span className="material-symbols-outlined text-sm">
                          delete
                        </span>
                      </button>
                    )}
                  </div>

                  {/* Content area that will grow to push button down */}
                  <div className="p-4 flex flex-col flex-grow">
                    {" "}
                    {/* Added flex-grow here */}
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        {/* User avatar */}
                        <img
                          src={getUserProfilePicture(portfolio.email)}
                          alt={getUserDisplayName(portfolio.email)}
                          className="w-8 h-8 rounded-full"
                          onError={(e) => {
                            e.target.src = `https://i.pravatar.cc/80?u=${portfolio.email}`;
                          }}
                        />
                        <div>
                          <p className="font-medium text-sm">
                            {portfolio.email.split("@")[0]}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {portfolio.category}
                          </p>
                        </div>
                      </div>

                      {/* Like button */}
                      <button
                        onClick={() =>
                          handleLike(portfolio._id, portfolio.isLiked)
                        }
                        className="p-1 hover:bg-neutral-100 rounded-full transition-colors group"
                      >
                        <span
                          className={`material-symbols-outlined text-lg ${
                            portfolio.isLiked
                              ? "text-red-500"
                              : "text-[#822538]"
                          } group-hover:scale-110 transition-transform`}
                        >
                          {portfolio.isLiked ? "favorite" : "favorite_border"}
                        </span>
                        {portfolio.likes > 0 && (
                          <span className="text-xs text-neutral-500 ml-1">
                            {portfolio.likes}
                          </span>
                        )}
                      </button>
                    </div>
                    <h3 className="text-md font-semibold mb-1 line-clamp-1">
                      {portfolio.name}
                    </h3>
                    <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                      {portfolio.description || "No description provided"}
                    </p>
                    {/* Upload date */}
                    <p className="text-xs text-neutral-400 mb-3">
                      Uploaded{" "}
                      {new Date(portfolio.uploadDate).toLocaleDateString()}
                    </p>
                    {/* This div will be pushed to the bottom */}
                    <div className="mt-auto">
                      {" "}
                      {/* Added mt-auto to push to bottom */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleChatNow(portfolio.email)}
                          disabled={userEmail === portfolio.email}
                          className={`flex-1 py-2 rounded-md text-sm font-medium ${
                            userEmail === portfolio.email
                              ? "bg-gray-300 cursor-not-allowed text-gray-500"
                              : "bg-[#822538] text-white hover:bg-[#b4707e] transition-colors"
                          }`}
                        >
                          {userEmail === portfolio.email
                            ? "Your Portfolio"
                            : "Chat Now"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-4 items-center">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`p-2 rounded-full transition-colors ${
                  currentPage === 1
                    ? "bg-gray-200 cursor-not-allowed text-gray-400"
                    : "bg-[#822538] hover:bg-[#b4707e] text-white"
                }`}
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-[#822538]">
                  Page {currentPage} of {totalPages}
                </span>
                <span className="text-xs text-neutral-500">
                  ({portfolios.length} portfolios)
                </span>
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-full transition-colors ${
                  currentPage === totalPages
                    ? "bg-gray-200 cursor-not-allowed text-gray-400"
                    : "bg-[#822538] hover:bg-[#b4707e] text-white"
                }`}
              >
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          )}
        </section>

        {/* Success Stories */}
        <section className="py-10 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-custom font-bold text-[#822538] mb-8">
              Success Stories
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Success Story 1 */}
              <div className="flex flex-col items-center text-center">
                <img
                  src="https://images.unsplash.com/photo-1558655146-d09347e92766?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MzkyNDZ8MHwxfHNlYXJjaHwxfHxkZXNpZ25lcnxlbnwwfHx8fDE3NDYxNjY5NDl8MA&ixlib=rb-4.0.3&q=80&w=1080"
                  alt="Alexander Kim"
                  className="w-16 h-16 rounded-full mb-3"
                  keywords="designer, success story, avatar"
                />
                <h3 className="font-medium">Alexander Kim</h3>
                <p className="text-xs text-neutral-500 mb-3">
                  Fashion Designer
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    <span className="material-symbols-outlined text-[#822538] text-sm">
                      star
                    </span>
                    <span className="material-symbols-outlined text-[#822538] text-sm">
                      star
                    </span>
                    <span className="material-symbols-outlined text-[#822538] text-sm">
                      star
                    </span>
                    <span className="material-symbols-outlined text-[#822538] text-sm">
                      star
                    </span>
                    <span className="material-symbols-outlined text-[#822538] text-sm">
                      star
                    </span>
                  </div>
                  <span className="text-sm font-medium">4.9</span>
                </div>
                <p className="text-xs text-neutral-600">
                  "Fashion connects us with my customers and has increased my
                  business by 300% in just two months."
                </p>
              </div>

              {/* Success Story 2 */}
              <div className="flex flex-col items-center text-center">
                <img
                  src="https://images.unsplash.com/photo-1506097425191-7ad538b29cef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MzkyNDZ8MHwxfHNlYXJjaHw4fHxkZXNpZ25lcnxlbnwwfHx8fDE3NDYxNjY5NDl8MA&ixlib=rb-4.0.3&q=80&w=1080"
                  alt="Mei Rodriguez"
                  className="w-16 h-16 rounded-full mb-3"
                  keywords="designer, success story, avatar"
                />
                <h3 className="font-medium">Mei Rodriguez</h3>
                <p className="text-xs text-neutral-500 mb-3">
                  Accessory Designer
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    <span className="material-symbols-outlined text-primary-600 text-sm">
                      star
                    </span>
                    <span className="material-symbols-outlined text-primary-600 text-sm">
                      star
                    </span>
                    <span className="material-symbols-outlined text-primary-600 text-sm">
                      star
                    </span>
                    <span className="material-symbols-outlined text-primary-600 text-sm">
                      star
                    </span>
                    <span className="material-symbols-outlined text-neutral-300 text-sm">
                      star
                    </span>
                  </div>
                  <span className="text-sm font-medium">4.3</span>
                </div>
                <p className="text-xs text-neutral-600">
                  "Found amazing designers I couldn't have reached otherwise and
                  now we collaborate twice monthly."
                </p>
              </div>
            </div>

            <div className="text-center mt-8">
              <a
                href="#"
                className="text-xs text-[#822538] transition-colors inline-flex items-center"
              >
                View all Success Stories
                <span className="material-symbols-outlined text-sm ml-1">
                  arrow_forward
                </span>
              </a>
            </div>
          </div>
        </section>
        {/* Portfolio Upload Modal */}
        {isModalOpen && (
          <Post
            onClose={() => setIsModalOpen(false)}
            onUploadSuccess={handleUploadSuccess}
          />
        )}
      </div>
    </div>
  );
}
