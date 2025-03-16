"use client";
import React, { useState, useEffect } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";

type ProfileKeys = "firstName" | "lastName" | "dob" | "country" | "username";

const Profile: React.FC = () => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dob: "",
    country: "Pakistan",
    profilePicture: "",
    username: "",
  });

  const [isEditable, setIsEditable] = useState<Record<ProfileKeys, boolean>>({
    firstName: false,
    lastName: false,
    dob: false,
    country: false,
    username: false,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/profile/${email}`);
        if (!response.ok) throw new Error("Failed to fetch profile data");
        const data = await response.json();
        console.log("data", data);
        setProfile({
          firstName: data.firstname || "",
          lastName: data.lastname || "",
          email: data.email || "",
          dob: data.dob || "",
          country: data.country || "",
          profilePicture: data.profilePictureUrl || "https://via.placeholder.com/150",
          username: data.username || "",
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (field: ProfileKeys, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  const toggleEdit = (field: ProfileKeys) => {
    setIsEditable({ ...isEditable, [field]: !isEditable[field] });
  };

  const handleProfilePictureChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const uniqueId = uuidv4();
      const storageRef = ref(storage, `profilePictures/profile_image_${uniqueId}`);

      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      setProfile((prevProfile) => ({
        ...prevProfile,
        profilePicture: downloadURL,
      }));
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload the profile picture. Please try again.");
    }
  };

  const updateProfile = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/profile/${profile.email}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname: profile.firstName,
          lastname: profile.lastName,
          username: profile.username,
          country: profile.country,
          profilePictureUrl: profile.profilePicture,
        }),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      console.log("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#E7E4D8]">
      {/* 🔹 Blurred Background */}
      <div className="absolute inset-0  bg-opacity-60 backdrop-blur-lg z-0"></div>

      {/* 🔹 Profile Box */}
      <div className="relative z-10 bg-white rounded-xl shadow-lg w-full max-w-4xl p-10 md:p-12 overflow-hidden">
        {/* Profile Picture */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-28 h-28 bg-gray-300 rounded-full overflow-hidden shadow-md">
          <img src={profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
          <label htmlFor="upload-profile-picture">
            <AiOutlineEdit className="absolute bottom-1 right-1 bg-[#822538] p-1 rounded-full text-white cursor-pointer hover:bg-[#6f2331]" size={30} />
          </label>
          <input id="upload-profile-picture" type="file" accept="image/*" className="hidden" onChange={handleProfilePictureChange} />
        </div>

        {/* 🔹 Profile Form */}
        <div className="mt-28">
          <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "First Name", key: "firstName" },
              { label: "Last Name", key: "lastName" },
              { label: "Username", key: "username" },
            ].map(({ label, key }) => (
              <div key={key} className="relative">
                <label className="block text-gray-600 font-medium mb-1">{label}</label>
                <input
                  type="text"
                  className="w-full p-3 border-b-2 border-gray-300 focus:border-[#822538] focus:outline-none bg-transparent"
                  value={profile[key as ProfileKeys]}
                  onChange={(e) => handleInputChange(key as ProfileKeys, e.target.value)}
                  disabled={!isEditable[key as ProfileKeys]}
                />
                <AiOutlineEdit className="absolute top-10 right-3 text-gray-400 cursor-pointer hover:text-gray-600" onClick={() => toggleEdit(key as ProfileKeys)} size={20} />
              </div>
            ))}

            {/* Email (Non-editable) */}
            <div>
              <label className="block text-gray-600 font-medium mb-1">Email</label>
              <input type="email" className="w-full p-3 border-b-2 border-gray-300 bg-transparent cursor-not-allowed" value={profile.email} disabled />
              <span className="text-green-500 text-sm">Verified</span>
            </div>

            {/* Role (Non-editable) */}
            <div>
              <label className="block text-gray-600 font-medium mb-1">Role</label>
              <input type="text" className="w-full p-3 border-b-2 border-gray-300 bg-transparent cursor-not-allowed" value="Designer" disabled />
            </div>

            {/* Country */}
            <div className="relative">
              <label className="block text-gray-600 font-medium mb-1">Country</label>
              <select className="w-full p-3 border-b-2 border-gray-300 focus:border-[#822538] bg-transparent" value={profile.country} onChange={(e) => handleInputChange("country", e.target.value)}>
                <option>Pakistan</option>
                <option>USA</option>
                <option>India</option>
              </select>
              <AiOutlineEdit className="absolute top-10 right-4 text-gray-400 cursor-pointer hover:text-gray-600" onClick={() => toggleEdit("country")} size={20} />
            </div>
          </form>

          {/* Save Button */}
          <div className="mt-6 text-right">
            <button className="bg-[#822538] text-white py-3 px-8 rounded-xl shadow-md hover:bg-[#6f2331]" onClick={(e) => { e.preventDefault(); updateProfile(); }}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
