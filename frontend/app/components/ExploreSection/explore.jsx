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
  const [userRole, setUserRole] = useState(null);


  // Get user email from localStorage
  useEffect(() => {
    const emailFromStorage = localStorage.getItem("userEmail");
    setUserEmail(emailFromStorage || "");
     const role = localStorage.getItem('userRole');
  setUserRole(role);
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
    // Add the new portfolio with a pending thumbnail status
    const portfolioWithPendingThumbnail = {
      ...newPortfolio,
      thumbnailStatus: "pending",
    };

    setPortfolios((prevPortfolios) => [
      portfolioWithPendingThumbnail,
      ...prevPortfolios,
    ]);

    // Start polling for thumbnail generation
    const pollForThumbnail = async (portfolioId) => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/thumbnails/${portfolioId}/thumbnail-status`
        );

        if (response.ok) {
          const data = await response.json();

          if (data.thumbnailStatus === "generated") {
            // Update the portfolio with the generated thumbnail
            setPortfolios((prevPortfolios) =>
              prevPortfolios.map((portfolio) =>
                portfolio._id === portfolioId
                  ? {
                      ...portfolio,
                      thumbnailUrl: data.thumbnailUrl,
                      thumbnailStatus: "generated",
                    }
                  : portfolio
              )
            );
            return true;
          }
        }
        return false;
      } catch (error) {
        console.error("Error checking thumbnail status:", error);
        return false;
      }
    };

    // Poll every 2 seconds for up to 30 seconds
    const maxAttempts = 15;
    let attempts = 0;

    const intervalId = setInterval(async () => {
      attempts++;
      const success = await pollForThumbnail(newPortfolio._id);

      if (success || attempts >= maxAttempts) {
        clearInterval(intervalId);
        // If still not generated after max attempts, mark as failed
        if (!success) {
          setPortfolios((prevPortfolios) =>
            prevPortfolios.map((portfolio) =>
              portfolio._id === newPortfolio._id
                ? {
                    ...portfolio,
                    thumbnailStatus: "failed",
                  }
                : portfolio
            )
          );
        }
      }
    }, 2000);
  };
  // Function to get thumbnail URL with fallbacks
  const getThumbnailUrl = (portfolio) => {
    // If thumbnail is available and generated, use it
    if (portfolio.thumbnailUrl && portfolio.thumbnailStatus === "generated") {
      return portfolio.thumbnailUrl;
    }

    // If thumbnail is pending, show a loading placeholder
    if (portfolio.thumbnailStatus === "pending") {
      return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjEwMCIgcj0iMjAiIGZpbGw9IiM5Q0E0QUYiLz4KPGFuZXh0IHg9IjE1MCIgeT0iMTMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjM3Mzg1IiBmb250LXNpemU9IjEyIj5HZW5lcmF0aW5nLi4uPC90ZXh0Pgo8L3N2Zz4K";
    }

    // Default fallback for failed or missing thumbnails
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjEyNSIgeT0iNzUiIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgZmlsbD0iIzlDQTNBRiIvPgo8dGV4dCB4PSIxNTAiIHk9IjEzNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzYzNzM4NSIgZm9udC1zaXplPSIxMiI+UERGIFBvcnRmb2xpbzwvdGV4dD4KPC9zdmc+";
  };

  const [stories, setStories] = useState([]);
  const [allStories, setAllStories] = useState([]);
  const [loadingAll, setLoadingAll] = useState(false);
  const [showAllStories, setShowAllStories] = useState(false);

  // Fetch top 3 success stories from backend
  useEffect(() => {
    const fetchTopStories = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://localhost:5000/api/success-stories/top"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch success stories");
        }

        const data = await response.json();

        if (data.success) {
          setStories(data.data);
        } else {
          throw new Error(data.message || "Failed to load stories");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching success stories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopStories();
  }, []);

  // Fetch all success stories
  const fetchAllStories = async () => {
    try {
      setLoadingAll(true);
      const response = await fetch("http://localhost:5000/api/success-stories");

      if (!response.ok) {
        throw new Error("Failed to fetch all success stories");
      }

      const data = await response.json();

      if (data.success) {
        setAllStories(data.data);
      } else {
        throw new Error(data.message || "Failed to load all stories");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching all success stories:", err);
    } finally {
      setLoadingAll(false);
    }
  };

  // Handle view all stories click
  const handleViewAllStories = async () => {
    if (!showAllStories && allStories.length === 0) {
      await fetchAllStories();
    }
    setShowAllStories(!showAllStories);
  };

  // Render star rating
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span
          key={i}
          className="material-symbols-outlined text-[#822538] text-sm"
        >
          star
        </span>
      );
    }

    // Half star (if needed)
    if (hasHalfStar) {
      stars.push(
        <span
          key="half"
          className="material-symbols-outlined text-[#822538] text-sm"
        >
          star_half
        </span>
      );
    }

    // Empty stars to complete 5
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <span
          key={`empty-${i}`}
          className="material-symbols-outlined text-neutral-300 text-sm"
        >
          star
        </span>
      );
    }

    return stars;
  };

  // Default placeholder image
  const getProfileImage = (story) => {
    if (story.profileImage) {
      return story.profileImage;
    }
    // Generate a placeholder based on name
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      story.name
    )}&background=822538&color=ffffff&size=128`;
  };

  // Get stories to display
  const displayedStories = showAllStories ? allStories : stories;

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
                    {/* PDF Thumbnail with fallback + spinner if no thumbnail */}
                    {portfolio.thumbnailUrl ? (
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
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <svg
                          className="animate-spin h-8 w-8 text-gray-400"
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
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          ></path>
                        </svg>
                      </div>
                    )}

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
                          <p className="font-medium text-sm text-gray-900">
                            {portfolio.email.split("@")[0]}
                          </p>
                          <p className="text-xs text-neutral-500  text-black">
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
                    <h3 className="text-md font-semibold mb-1 line-clamp-1 text-gray-900">
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
                     {userRole !== 'Designer' && (
  <div className="flex gap-2">
    <button
      onClick={() => handleChatNow(portfolio.email)}
      disabled={userEmail === portfolio.email}
      className={`flex-1 py-2 rounded-md text-sm font-medium bg-[#822538] text-white hover:bg-[#b4707e] transition-colors`}
      
    >
      Chat Now
    </button>
  </div>
)}

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

            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#822538]"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                <p>Error loading success stories: {error}</p>
              </div>
            ) : (
              <>
                <div
                  className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-500 ${
                    showAllStories ? "max-h-none" : "max-h-96 overflow-hidden"
                  }`}
                >
                  {displayedStories.map((story) => (
                    <div
                      key={story._id}
                      className="flex flex-col items-center text-center"
                    >
                      <img
                        src={getProfileImage(story)}
                        alt={story.name}
                        className="w-16 h-16 rounded-full mb-3 object-cover"
                        onError={(e) => {
                          // Fallback to generated avatar if image fails to load
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            story.name
                          )}&background=822538&color=ffffff&size=128`;
                        }}
                      />
                      <h3 className="font-medium">{story.name}</h3>
                      <p className="text-xs text-neutral-500 mb-3">
                        {story.profession}
                      </p>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex">{renderStars(story.rating)}</div>
                        <span className="text-sm font-medium">
                          {story.rating}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600">
                        "{story.testimonial}"
                      </p>
                    </div>
                  ))}
                </div>

                {loadingAll && (
                  <div className="flex justify-center items-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#822538]"></div>
                    <span className="ml-2 text-sm text-neutral-600">
                      Loading more stories...
                    </span>
                  </div>
                )}

                <div className="text-center mt-8">
                  <button
                    onClick={handleViewAllStories}
                    disabled={loadingAll}
                    className="text-xs text-[#822538] transition-colors inline-flex items-center hover:underline disabled:opacity-50"
                  >
                    {showAllStories ? "Show Less" : "View all Success Stories"}
                    <span
                      className={`material-symbols-outlined text-sm ml-1 transition-transform ${
                        showAllStories ? "rotate-180" : ""
                      }`}
                    >
                      {showAllStories ? "expand_less" : "arrow_forward"}
                    </span>
                  </button>
                </div>
              </>
            )}
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
