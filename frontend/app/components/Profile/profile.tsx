"use client";
import React, { useState } from "react";
import { AiOutlineEdit } from "react-icons/ai"; // Gray pen icon

type ProfileKeys = "firstName" | "lastName" | "dob" | "country" | "bio";

const Profile: React.FC = () => {
  const [profile, setProfile] = useState({
    firstName: "Jane",
    lastName: "Coop",
    email: "jane234@example.com",
    phone: "(209) 555-0104",
    dob: "1996-11-17",
    country: "Bangladesh",
    bio: "Passionate about connecting businesses with the goodness of nature! 🌱 I'm on a mission to make organic food, medicine, fruits, and FMCG products easily accessible to B2B partners. 🌍 Health and sustainability drive my business ethos. 💚 I love working closely with businesses that share our values. Let's grow together! 🌟",
    profilePicture: "https://via.placeholder.com/150", // Default picture
  });

  const [isEditable, setIsEditable] = useState<Record<ProfileKeys, boolean>>({
    firstName: false,
    lastName: false,
    dob: false,
    country: false,
    bio: false,
  });

  const handleInputChange = (field: ProfileKeys, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  const toggleEdit = (field: ProfileKeys) => {
    setIsEditable({ ...isEditable, [field]: !isEditable[field] });
  };

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfile({ ...profile, profilePicture: imageUrl });
    }
  };

  return (
    <div className="relative max-h-[75vh] bg-[#E7E4D8] flex items-center justify-center">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video autoPlay loop muted className="w-full max-h-[89vh] object-cover">
          <source src="Gradient.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Profile Box */}
      <div className="relative z-10 bg-white rounded-xl shadow-lg w-full max-w-5xl p-10  overflow-y-auto max-h-[73vh] mt-14" style={{marginTop:"5%"}}>
        <h2 className="text-2xl text-[#822538] font-semibold mb-6">Account Information</h2>

        <div className="flex items-center space-x-4 mb-8">
          {/* Profile Picture */}
          <div className="relative w-20 h-20 bg-gray-300 rounded-full overflow-hidden">
            <img
              src={profile.profilePicture}
              alt="Profile"
              className="w-full h-full object-cover"
            />
            <label htmlFor="upload-profile-picture">
              <AiOutlineEdit
                className="absolute bottom-0 right-0 bg-white p-1 rounded-full text-gray-400 cursor-pointer hover:text-gray-600"
                size={20}
              />
            </label>
            <input
              id="upload-profile-picture"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfilePictureChange}
            />
          </div>
          <button className="text-blue-500 font-medium hover:underline">
            Change Profile Picture
          </button>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div className="relative">
            <label className="block text-gray-600 font-medium mb-1">First Name</label>
            <input
              type="text"
              className="rounded-xl w-full p-3 border shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-gray-50"
              value={profile.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              disabled={!isEditable.firstName}
            />
            <AiOutlineEdit
              className="absolute top-10 right-3 text-gray-400 cursor-pointer hover:text-gray-600"
              onClick={() => toggleEdit("firstName")}
              size={20}
            />
          </div>

          {/* Last Name */}
          <div className="relative">
            <label className="block text-gray-600 font-medium mb-1">Last Name</label>
            <input
              type="text"
              className="w-full p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-gray-50"
              value={profile.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              disabled={!isEditable.lastName}
            />
            <AiOutlineEdit
              className="absolute top-10 right-3 text-gray-400 cursor-pointer hover:text-gray-600"
              onClick={() => toggleEdit("lastName")}
              size={20}
            />
          </div>

          {/* Email (Non-editable) */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full p-3 border rounded-xl shadow-sm bg-gray-200 cursor-not-allowed"
              value={profile.email}
              disabled
            />
            <span className="text-green-500 text-sm">Verified</span>
          </div>

          {/* Phone Number (Non-editable) */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              className="w-full p-3 border rounded-xl shadow-sm bg-gray-200 cursor-not-allowed"
              value={profile.phone}
              disabled
            />
            <span className="text-green-500 text-sm">Verified</span>
          </div>

          {/* Date of Birth */}
          <div className="relative">
            <label className="block text-gray-600 font-medium mb-1">Date of Birth</label>
            <input
              type="date"
              className="w-full p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-gray-50"
              value={profile.dob}
              onChange={(e) => handleInputChange("dob", e.target.value)}
              disabled={!isEditable.dob}
            />
            <AiOutlineEdit
              className="absolute top-10 right-3 text-gray-400 cursor-pointer hover:text-gray-600"
              onClick={() => toggleEdit("dob")}
              size={20}
            />
          </div>

          {/* Country */}
          <div className="relative">
            <label className="block text-gray-600 font-medium mb-1">Country</label>
            <select
              className="w-full p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-gray-50"
              value={profile.country}
              onChange={(e) => handleInputChange("country", e.target.value)}
              disabled={!isEditable.country}
            >
              <option>Pakistan</option>
              <option>USA</option>
              <option>India</option>
            </select>
            <AiOutlineEdit
              className="absolute top-10 right-4 text-gray-400 cursor-pointer hover:text-gray-600"
              onClick={() => toggleEdit("country")}
              size={20}
            />
          </div>

          {/* Bio */}
          <div className="relative md:col-span-2">
            <label className="block text-gray-600 font-medium mb-1">Bio</label>
            <textarea
              className="w-full p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-gray-50"
              rows={4}
              value={profile.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              disabled={!isEditable.bio}
            ></textarea>
            <AiOutlineEdit
              className="absolute top-2 right-3 text-gray-400 cursor-pointer hover:text-gray-600"
              onClick={() => toggleEdit("bio")}
              size={20}
            />
          </div>
        </form>

        {/* Save Button */}
        <div className="mt-6 text-right">
          <button
            className="bg-[#822538] text-white py-3 px-8 rounded-xl shadow-md hover:bg-blue-600"
            onClick={(e) => {
              e.preventDefault();
              console.log("Updated Profile:", profile);
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
