import React from "react"


export default function Footer  () {
    return (
        <div  className="bg-[#E7E4D8]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 bg-[#424242] p-8 ">
                <div className="lg:col-span-5 flex flex-col justify-center gap-8">
                    <h2 className="text-white text-3xl md:text-4xl font-bold font-custom">Why connect on Fabricae?</h2>

                    <div className="flex items-start gap-4 group">
                        <div className="bg-red-800 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-red-700 transition-colors">
                            <span className="material-symbols-outlined text-white">diamond</span>
                        </div>
                        <div>
                            <h3 className="text-white text-xl font-semibold mb-1">Elite Designer Network</h3>
                            <p className="text-gray-300 text-sm">
                                Connect with top-tier fashion designers from around the globe, showcasing innovative and
                                trend-setting portfolios.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 group">
                        <div className="bg-red-800 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-red-700 transition-colors">
                            <span className="material-symbols-outlined text-white">handshake</span>
                        </div>
                        <div>
                            <h3 className="text-white text-xl font-semibold mb-1">Direct Brand Collaboration</h3>
                            <p className="text-gray-300 text-sm">
                                Establish direct relationships with brands looking for fresh talent, bypassing
                                traditional barriers to entry.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 group">
                        <div className="bg-red-800 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-red-700 transition-colors">
                            <span className="material-symbols-outlined text-white">security</span>
                        </div>
                        <div>
                            <h3 className="text-white text-xl font-semibold mb-1">Secure Communication</h3>
                            <p className="text-gray-300 text-sm">
                                Our platform ensures your designs and conversations remain protected with
                                industry-standard security protocols.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-7 flex items-center justify-center">
                    <div className="bg-neutral-100 rounded-xl p-4 w-full max-w-lg">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MzkyNDZ8MHwxfHNlYXJjaHwxfHxwcm9maWxlfGVufDB8fHx8MTc0NzMzMjI2Mnww&ixlib=rb-4.1.0&q=80&w=1080"
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                    keywords="profile, avatar, user, designer"
                                />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold">James Wilson</h4>
                                <p className="text-xs text-gray-600">Menswear Designer</p>
                            </div>
                        </div>

                        <div className="bg-gray-100 rounded-lg p-3 mb-3">
                            <p className="text-sm text-gray-700">
                                Hello! I really love your autumn collection. Would you be interested in collaborating on
                                a limited edition piece for our brand?
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Luxury Brand Co. • 2 hours ago</p>
                        </div>

                        <div className="bg-red-200 rounded-lg p-3 mb-4 ml-auto max-w-[80%]">
                            <p className="text-sm text-red-900">
                                Thank you for reaching out! I'd be delighted to discuss a collaboration. My schedule is
                                open next week for a detailed conversation.
                            </p>
                            <p className="text-xs text-right text-gray-500 mt-1">You • 1 hour ago</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Type your message..."
                                className="w-full rounded-full py-2 px-4 text-sm bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-800 transition-all"
                            />
                            <button className="bg-red-800 w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
                                <span className="material-symbols-outlined text-white">send</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
