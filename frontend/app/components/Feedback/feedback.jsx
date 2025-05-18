import React from "react"

import "./style.css"

export default function Feedback () {
    return (
        <div id="webcrumbs">
            <div className=" p-6 bg-gradient-to-b from-[#e7e4d8] to-white font-sans">
                <header className="mb-10 text-center">
                    <h1 className="text-4xl font-bold  font-custom mb-2 text-[#616852]">Designer Success Stories</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Share your journey and inspire other fashion designers in our growing community.
                    </p>
                </header>

                <section className="mb-12">
                    <div className="bg-white shadow-lg rounded-xl p-8 border border-violet-100 hover:shadow-xl transition-all duration-300">
                        <h2 className="text-2xl font-semibold font-custom mb-6 text-[#616852]">Share Your Success Story</h2>

                        <form>
                            <div className="mb-6">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e7e4d8] focus:border-[#e7e4d8] transition-all"
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div className="mb-6">
                                <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                                    Brand/Company Name (optional)
                                </label>
                                <input
                                    type="text"
                                    id="brand"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e7e4d8] focus:border-[#e7e4d8] transition-all"
                                    placeholder="Your fashion brand or company"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Your Overall Experience
                                </label>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            className="text-3xl text-gray-300 hover:text-[#b4707e] transition-colors duration-150"
                                        >
                                            <span className="material-symbols-outlined">star</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6">
                                <label htmlFor="story" className="block text-sm font-medium text-gray-700 mb-1">
                                    Your Success Story
                                </label>
                                <textarea
                                    id="story"
                                    rows="6"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e7e4d8] focus:border-[#e7e4d8] transition-all"
                                    placeholder="Share your journey, challenges you overcame, and how our platform helped you succeed..."
                                ></textarea>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-[#822538] text-white rounded-lg hover:bg-[#b4707e] shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
                                >
                                    Share Your Story
                                </button>
                            </div>
                        </form>
                    </div>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-6 text-[#616852]">Success Stories From Our Community</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-[#e7e4d8]">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-medium text-lg">Emma Thompson</h3>
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star, index) => (
                                            <span key={index} className="material-symbols-outlined text-yellow-400">
                                                star
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-4">Thompson Designs</p>
                                <p className="text-gray-700 mb-4">
                                    I started as a small indie designer and now my collections are featured in major
                                    fashion weeks. This platform helped me connect with the right manufacturers and
                                    mentors.
                                </p>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500">Posted 3 days ago</span>
                                   
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-violet-100">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-medium text-lg">Marcus Chen</h3>
                                    <div className="flex">
                                        {[1, 2, 3, 4].map((star, index) => (
                                            <span key={index} className="material-symbols-outlined text-yellow-400">
                                                star
                                            </span>
                                        ))}
                                        <span className="material-symbols-outlined text-gray-300">star</span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-4">Urban Threads Co.</p>
                                <p className="text-gray-700 mb-4">
                                    The community feedback feature helped me refine my streetwear collection. I've gone
                                    from selling at local markets to having my own online store with international
                                    shipping.
                                </p>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500">Posted 1 week ago</span>
                                    <button className="text-primary-600 hover:text-primary-800 transition-colors flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">favorite_border</span>
                                        <span className="text-sm">17</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-violet-100">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-medium text-lg">Sofia Rodriguez</h3>
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star, index) => (
                                            <span key={index} className="material-symbols-outlined text-yellow-400">
                                                star
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-4">Flor de Moda</p>
                                <p className="text-gray-700 mb-4">
                                    As a sustainable fashion advocate, I found invaluable resources here. My
                                    eco-friendly line now has partnerships with three major retailers who share our
                                    values.
                                </p>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500">Posted 2 weeks ago</span>
                                    <button className="text-primary-600 hover:text-primary-800 transition-colors flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">favorite</span>
                                        <span className="text-sm">41</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Next: "Add load more button or pagination" */}
                    </div>
                </section>

                <section className="bg-gray-50 rounded-xl p-8 mb-12">
                    <h2 className="text-2xl font-semibold mb-6 text-[#822538] text-center">Success By The Numbers</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-all flex flex-col items-center justify-center text-center">
                            <span className="text-4xl font-bold text-[#822538] mb-2">750+</span>
                            <p className="text-gray-600">Designer Success Stories</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-all flex flex-col items-center justify-center text-center">
                            <span className="text-4xl font-bold text-[#822538] mb-2">92%</span>
                            <p className="text-gray-600">Report Increased Sales</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-all flex flex-col items-center justify-center text-center">
                            <span className="text-4xl font-bold text-[#822538] mb-2">124</span>
                            <p className="text-gray-600">Countries Represented</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-all flex flex-col items-center justify-center text-center">
                            <span className="text-4xl font-bold text-[#822538] mb-2">4.8/5</span>
                            <p className="text-gray-600">Average Designer Rating</p>
                        </div>
                    </div>
                    {/* Next: "Add animated progress bars showing growth metrics" */}
                </section>

             </div>
        </div>
    )
}
