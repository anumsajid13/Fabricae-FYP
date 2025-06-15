import React, { useState, useEffect } from "react";
import { Post } from "./post"; // 🟢 Import correctly using named import
import "./style.css";

export default function ExploreSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [stories, setStories] = useState([]);
  const [allStories, setAllStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAll, setLoadingAll] = useState(false);
  const [error, setError] = useState(null);
  const [showAllStories, setShowAllStories] = useState(false);

  // Fetch top 3 success stories from backend
  useEffect(() => {
    const fetchTopStories = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/success-stories/top');
        
        if (!response.ok) {
          throw new Error('Failed to fetch success stories');
        }
        
        const data = await response.json();
        
        if (data.success) {
          setStories(data.data);
        } else {
          throw new Error(data.message || 'Failed to load stories');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching success stories:', err);
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
      const response = await fetch('http://localhost:5000/api/success-stories');
      
      if (!response.ok) {
        throw new Error('Failed to fetch all success stories');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setAllStories(data.data);
      } else {
        throw new Error(data.message || 'Failed to load all stories');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching all success stories:', err);
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
        <span key={i} className="material-symbols-outlined text-[#822538] text-sm">
          star
        </span>
      );
    }

    // Half star (if needed)
    if (hasHalfStar) {
      stars.push(
        <span key="half" className="material-symbols-outlined text-[#822538] text-sm">
          star_half
        </span>
      );
    }

    // Empty stars to complete 5
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="material-symbols-outlined text-neutral-300 text-sm">
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
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(story.name)}&background=822538&color=ffffff&size=128`;
  };

  // Get stories to display
  const displayedStories = showAllStories ? allStories : stories;

  return (
    <div id="webcrumbs">
      <div className="h-[450px] w-full rounded-md bg-[#E7E4D8] relative flex flex-col items-center justify-center antialiased">
        {/* Background Video */}
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

          <p className="text-white   drop-shadow-sm text-center self-center font-para">
            Connect with top designers, showcase your portfolio, or discover the
            next big fashion talent all in one place.
          </p>
        </div>
      </div>
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
              >
                <span className="material-symbols-outlined text-[#822538]">
                  add_circle
                </span>
              </button>

              <button className="rounded-full bg-primary-50 p-2 hover:bg-primary-100 transition-colors">
                <span className="material-symbols-outlined text-[#822538]">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Portfolio Card 1 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-48 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3"
                  alt="Fashion collection"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  keywords="fashion, rack, clothes, collection"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MzkyNDZ8MHwxfHNlYXJjaHwyfHxwcm9maWxlfGVufDB8fHx8MTc0NjE1OTI5OHww&ixlib=rb-4.0.3&q=80&w=1080"
                      alt="Tyler Chen"
                      className="w-8 h-8 rounded-full"
                      keywords="profile, designer, avatar"
                    />
                    <div>
                      <p className="font-medium text-sm">Tyler Chen</p>
                      <p className="text-xs text-neutral-500">
                        Fashion Designer
                      </p>
                    </div>
                  </div>
                  <button className="p-1 hover:bg-neutral-100 rounded-full transition-colors">
                    <span className="material-symbols-outlined text-[#822538] ">
                      favorite_border
                    </span>
                  </button>
                </div>

                {/* Portfolio Title and Description */}
                <h3 className="text-md font-semibold mb-1">Design Portfolio</h3>
                <p className="text-sm text-neutral-600 mb-4">
                  A curated collection showcasing original fashion sketches,
                  garment construction, and conceptual design work.
                </p>

                <button className="w-full bg-[#822538] text-white py-2 rounded-md hover:bg-[#b4707e] transition-colors text-sm font-medium">
                  Chat Now
                </button>
              </div>
            </div>

            {/* Portfolio Card 2 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-48 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1488161628813-04466f872be2?ixlib=rb-4.0.3"
                  alt="Model portrait"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  keywords="fashion, model, male, urban"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MzkyNDZ8MHwxfHNlYXJjaHwzfHxwcm9maWxlfGVufDB8fHx8MTc0NjE1OTI5OHww&ixlib=rb-4.0.3&q=80&w=1080"
                      alt="Marcus Reynolds"
                      className="w-8 h-8 rounded-full"
                      keywords="profile, designer, avatar"
                    />
                    <div>
                      <p className="font-medium text-sm">Marcus Reynolds</p>
                      <p className="text-xs text-neutral-500">
                        Model & Designer
                      </p>
                    </div>
                  </div>
                  <button className="p-1 hover:bg-neutral-100 rounded-full transition-colors">
                    <span className="material-symbols-outlined text-neutral-400 hover:text-primary-600">
                      favorite_border
                    </span>
                  </button>
                </div>
                <button className="w-full bg-primary-700 text-white py-2 rounded-md hover:bg-primary-800 transition-colors text-sm font-medium">
                  Chat Now
                </button>
              </div>
            </div>

            {/* Portfolio Card 3 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-48 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1584184924103-e310d9dc82fc?ixlib=rb-4.0.3"
                  alt="Clothing store"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  keywords="fashion, store, retail, clothes"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1618641986557-1ecd230959aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MzkyNDZ8MHwxfHNlYXJjaHw0fHxwcm9maWxlfGVufDB8fHx8MTc0NjE1OTI5OHww&ixlib=rb-4.0.3&q=80&w=1080"
                      alt="Aria Walker"
                      className="w-8 h-8 rounded-full"
                      keywords="profile, designer, avatar"
                    />
                    <div>
                      <p className="font-medium text-sm">Aria Walker</p>
                      <p className="text-xs text-neutral-500">Store Owner</p>
                    </div>
                  </div>
                  <button className="p-1 hover:bg-neutral-100 rounded-full transition-colors">
                    <span className="material-symbols-outlined text-neutral-400 hover:text-primary-600">
                      favorite_border
                    </span>
                  </button>
                </div>
                <button className="w-full bg-primary-700 text-white py-2 rounded-md hover:bg-primary-800 transition-colors text-sm font-medium">
                  Chat Now
                </button>
              </div>
            </div>

            {/* Portfolio Card 4 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-48 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3"
                  alt="Fashion collection"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  keywords="fashion, rack, clothes, collection"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1457449940276-e8deed18bfff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MzkyNDZ8MHwxfHNlYXJjaHw1fHxwcm9maWxlfGVufDB8fHx8MTc0NjE1OTI5OHww&ixlib=rb-4.0.3&q=80&w=1080"
                      alt="Tyler Chen"
                      className="w-8 h-8 rounded-full"
                      keywords="profile, designer, avatar"
                    />
                    <div>
                      <p className="font-medium text-sm">Tyler Chen</p>
                      <p className="text-xs text-neutral-500">
                        Fashion Designer
                      </p>
                    </div>
                  </div>
                  <button className="p-1 hover:bg-neutral-100 rounded-full transition-colors">
                    <span className="material-symbols-outlined text-neutral-400 hover:text-primary-600">
                      favorite_border
                    </span>
                  </button>
                </div>
                <button className="w-full bg-primary-700 text-white py-2 rounded-md hover:bg-primary-800 transition-colors text-sm font-medium">
                  Chat Now
                </button>
              </div>
            </div>

            {/* Portfolio Card 5 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-48 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1488161628813-04466f872be2?ixlib=rb-4.0.3"
                  alt="Model portrait"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  keywords="fashion, model, male, urban"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1497316730643-415fac54a2af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MzkyNDZ8MHwxfHNlYXJjaHw2fHxwcm9maWxlfGVufDB8fHx8MTc0NjE1OTI5OHww&ixlib=rb-4.0.3&q=80&w=1080"
                      alt="Marcus Reynolds"
                      className="w-8 h-8 rounded-full"
                      keywords="profile, designer, avatar"
                    />
                    <div>
                      <p className="font-medium text-sm">Marcus Reynolds</p>
                      <p className="text-xs text-neutral-500">
                        Model & Designer
                      </p>
                    </div>
                  </div>
                  <button className="p-1 hover:bg-neutral-100 rounded-full transition-colors">
                    <span className="material-symbols-outlined text-neutral-400 hover:text-primary-600">
                      favorite_border
                    </span>
                  </button>
                </div>
                <button className="w-full bg-primary-700 text-white py-2 rounded-md hover:bg-primary-800 transition-colors text-sm font-medium">
                  Chat Now
                </button>
              </div>
            </div>

            {/* Portfolio Card 6 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-48 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1584184924103-e310d9dc82fc?ixlib=rb-4.0.3"
                  alt="Clothing store"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  keywords="fashion, store, retail, clothes"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1579783483458-83d02161294e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MzkyNDZ8MHwxfHNlYXJjaHw3fHxwcm9maWxlfGVufDB8fHx8MTc0NjE1OTI5OHww&ixlib=rb-4.0.3&q=80&w=1080"
                      alt="Aria Walker"
                      className="w-8 h-8 rounded-full"
                      keywords="profile, designer, avatar"
                    />
                    <div>
                      <p className="font-medium text-sm">Aria Walker</p>
                      <p className="text-xs text-neutral-500">Store Owner</p>
                    </div>
                  </div>
                  <button className="p-1 hover:bg-neutral-100 rounded-full transition-colors">
                    <span className="material-symbols-outlined text-neutral-400 hover:text-primary-600">
                      favorite_border
                    </span>
                  </button>
                </div>
                <button className="w-full bg-primary-700 text-white py-2 rounded-md hover:bg-primary-800 transition-colors text-sm font-medium">
                  Chat Now
                </button>
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8 gap-2">
            <button className="w-2 h-2 rounded-full bg-[#822538]"></button>
            <button className="w-2 h-2 rounded-full bg-neutral-300 hover:bg-primary-300 transition-colors"></button>
            <button className="w-2 h-2 rounded-full bg-neutral-300 hover:bg-primary-300 transition-colors"></button>
          </div>
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
                <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-500 ${
                  showAllStories ? 'max-h-none' : 'max-h-96 overflow-hidden'
                }`}>
                  {displayedStories.map((story) => (
                    <div key={story._id} className="flex flex-col items-center text-center">
                      <img
                        src={getProfileImage(story)}
                        alt={story.name}
                        className="w-16 h-16 rounded-full mb-3 object-cover"
                        onError={(e) => {
                          // Fallback to generated avatar if image fails to load
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(story.name)}&background=822538&color=ffffff&size=128`;
                        }}
                      />
                      <h3 className="font-medium">{story.name}</h3>
                      <p className="text-xs text-neutral-500 mb-3">
                        {story.profession}
                      </p>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex">
                          {renderStars(story.rating)}
                        </div>
                        <span className="text-sm font-medium">{story.rating}</span>
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
                    <span className="ml-2 text-sm text-neutral-600">Loading more stories...</span>
                  </div>
                )}

                <div className="text-center mt-8">
                  <button
                    onClick={handleViewAllStories}
                    disabled={loadingAll}
                    className="text-xs text-[#822538] transition-colors inline-flex items-center hover:underline disabled:opacity-50"
                  >
                    {showAllStories ? 'Show Less' : 'View all Success Stories'}
                    <span className={`material-symbols-outlined text-sm ml-1 transition-transform ${
                      showAllStories ? 'rotate-180' : ''
                    }`}>
                      {showAllStories ? 'expand_less' : 'arrow_forward'}
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
        {/* 📦 Render Post Modal */}
        {isModalOpen && <Post onClose={() => setIsModalOpen(false)} />}
      </div>
    </div>
  );
}