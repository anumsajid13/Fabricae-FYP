import React, { useState, useEffect } from "react";
import "./style.css";

export default function Feedback() {
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        profession: '',
        rating: 0,
        testimonial: '',
        profileImage: ''
    });
    
    // UI state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null
    const [errors, setErrors] = useState({});
    const [isLoadingProfile, setIsLoadingProfile] = useState(false);
    const [userEmail, setUserEmail] = useState('');

    // Load user email from localStorage and fetch profile on component mount
    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                const email = localStorage.getItem('userEmail');
                if (email) {
                    setUserEmail(email);
                    await fetchUserProfile(email);
                }
            } catch (error) {
                console.error('Error loading user email from localStorage:', error);
            }
        };
        
        loadUserProfile();
    }, []);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Handle star rating
    const handleStarClick = (rating) => {
        setFormData(prev => ({
            ...prev,
            rating: rating
        }));
        
        if (errors.rating) {
            setErrors(prev => ({
                ...prev,
                rating: ''
            }));
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }
        
        if (!formData.profession.trim()) {
            newErrors.profession = 'Profession is required';
        } else if (formData.profession.trim().length < 2) {
            newErrors.profession = 'Profession must be at least 2 characters';
        }
        
        if (formData.rating === 0) {
            newErrors.rating = 'Please provide a rating';
        }
        
        if (!formData.testimonial.trim()) {
            newErrors.testimonial = 'Success story is required';
        } else if (formData.testimonial.trim().length < 10) {
            newErrors.testimonial = 'Success story must be at least 10 characters';
        }
        
        return newErrors;
    };

    // Fetch user profile data by email
    const fetchUserProfile = async (email) => {

        setIsLoadingProfile(true);
        console.log("email is",email)
        try {
            const response = await fetch(`http://localhost:5000/api/users/profile/${email}`);
            if (response.ok) {
                const profileData = await response.json();
                if (profileData.profilePictureUrl) {
                    setFormData(prev => ({
                        ...prev,
                        profileImage: profileData.profilePictureUrl
                    }));
                }
                return profileData;
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setIsLoadingProfile(false);
        }
        return null;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }
        
        setIsSubmitting(true);
        setSubmitStatus(null);
        
        try {
            // Prepare submission data including profileImage
            const submissionData = {
                name: formData.name.trim(),
                profession: formData.profession.trim(),
                rating: formData.rating,
                testimonial: formData.testimonial.trim(),
                profileImage: formData.profileImage || null
            };

console.log ("profile pic is", formData.profileImage)

            const response = await fetch('http://localhost:5000/api/success-stories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData),
            });
            
            const data = await response.json();
            
            if (data.success) {
                setSubmitStatus('success');
                // Reset form
                setFormData({
                    name: '',
                    profession: '',
                    rating: 0,
                    testimonial: '',
                    profileImage: ''
                });
            } else {
                setSubmitStatus('error');
                // Handle validation errors from backend
                if (data.errors && Array.isArray(data.errors)) {
                    const backendErrors = {};
                    data.errors.forEach(error => {
                        if (error.field) {
                            backendErrors[error.field] = error.message;
                        }
                    });
                    setErrors(backendErrors);
                }
            }
        } catch (error) {
            console.error('Error submitting story:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div id="webcrumbs">
            <div className="p-6 bg-gradient-to-b from-[#e7e4d8] to-white font-sans">
                <header className="mb-10 text-center">
                    <h1 className="text-4xl font-bold font-custom mb-2 text-[#616852]">Designer Success Stories</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Share your journey and inspire other fashion designers in our growing community.
                    </p>
                </header>

                <section className="mb-12 flex justify-center">
                    <div className="bg-white shadow-lg rounded-xl p-8 border border-violet-100 hover:shadow-xl transition-all duration-300 w-[1000px]">
                        <h2 className="text-2xl font-semibold font-custom mb-6 text-[#616852]">Share Your Success Story</h2>

                        {/* Success/Error Messages */}
                        {submitStatus === 'success' && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-green-800">
                                    ✅ Thank you! Your success story has been submitted successfully.
                                </p>
                            </div>
                        )}

                        {submitStatus === 'error' && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-800">
                                    ❌ There was an error submitting your story. Please try again.
                                </p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Your Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 border text-black rounded-lg focus:ring-2 
                                         focus:ring-[#e7e4d8] focus:border-[#e7e4d8] transition-all ${
                                        errors.name ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter your name"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                )}
                            </div>

                            {/* Profile Image Preview */}
                            {(isLoadingProfile || formData.profileImage) && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Profile
                                    </label>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        {isLoadingProfile ? (
                                            <>
                                                <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
                                                <span className="text-sm text-gray-600">Loading profile...</span>
                                            </>
                                        ) : formData.profileImage ? (
                                            <>
                                                <img 
                                                    src={formData.profileImage} 
                                                    alt="Profile" 
                                                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                                                />
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-green-600 font-medium">Profile loaded</span>
                                                    <span className="text-xs text-gray-500">{userEmail}</span>
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                </div>
                            )}

                            <div className="mb-6">
                                <label htmlFor="profession" className="block text-sm font-medium text-gray-700 mb-1">
                                    Your Profession *
                                </label>
                                <input
                                    type="text"
                                    id="profession"
                                    name="profession"
                                    value={formData.profession}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 border rounded-lg text-black focus:ring-2 focus:ring-[#e7e4d8] focus:border-[#e7e4d8] transition-all ${
                                        errors.profession ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="e.g., Fashion Designer, Stylist, Brand Owner"
                                />
                                {errors.profession && (
                                    <p className="mt-1 text-sm text-red-600">{errors.profession}</p>
                                )}
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Your Overall Experience *
                                </label>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => handleStarClick(star)}
                                            className={`text-3xl transition-colors duration-150 ${
                                                star <= formData.rating 
                                                    ? 'text-yellow-400' 
                                                    : 'text-gray-300 hover:text-yellow-200'
                                            }`}
                                        >
                                            <span className="material-symbols-outlined">star</span>
                                        </button>
                                    ))}
                                    {formData.rating > 0 && (
                                        <span className="ml-2 text-sm text-gray-600">
                                            {formData.rating}/5
                                        </span>
                                    )}
                                </div>
                                {errors.rating && (
                                    <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
                                )}
                            </div>

                            <div className="mb-6">
                                <label htmlFor="testimonial" className="block text-sm font-medium text-gray-700 mb-1">
                                    Your Success Story *
                                </label>
                                <textarea
                                    id="testimonial"
                                    name="testimonial"
                                    rows="6"
                                    value={formData.testimonial}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 text-black border rounded-lg focus:ring-2 focus:ring-[#e7e4d8] focus:border-[#e7e4d8] transition-all ${
                                        errors.testimonial ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="Share your journey, challenges you overcame, and how our platform helped you succeed..."
                                />
                                <div className="flex justify-between items-center mt-1">
                                    {errors.testimonial ? (
                                        <p className="text-sm text-red-600">{errors.testimonial}</p>
                                    ) : (
                                        <div></div>
                                    )}
                                    <p className="text-xs text-gray-500">
                                        {formData.testimonial.length}/500
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`px-6 py-3 rounded-lg shadow-md transition-all duration-200 ${
                                        isSubmitting
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-[#822538] hover:bg-[#b4707e] text-white hover:shadow-lg transform hover:-translate-y-1'
                                    }`}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Share Your Story'}
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        </div>
    );
}