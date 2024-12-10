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
    username:""
  });

  const [isEditable, setIsEditable] = useState<Record<ProfileKeys, boolean>>({
    firstName: false,
    lastName: false,
    dob: false,
    country: false,
    username:false
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch profile data
  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/profile/${email}`); 
        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }
        const data = await response.json();
        console.log("data",data)
        setProfile({
          firstName: data.firstname || "", 
          lastName: data.lastname || "",   
          email: data.email || "",
          dob: data.dob || "", 
          country: data.country || "",
          profilePicture: data.profilePictureUrl || "https://via.placeholder.com/150",
          username:data.username || ""
        });
      } catch (err) {
          if (err instanceof Error) {
            setError(err.message); 
          } else {
            setError("An unknown error occurred"); 
          }
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
    if (!file) {
      alert("Please select a file!");
      return;
    }
  
    try {
      // Generate a unique ID for the file
      const uniqueId = uuidv4();
      const storageRef = ref(storage, `profilePictures/profile_image_${uniqueId}`);
  
      //Upload the file to Firebase Storage
      await uploadBytes(storageRef, file);
      
      //Get the downloadable URL
      const downloadURL = await getDownloadURL(storageRef);
  
      console.log("Image uploaded successfully. Firebase URL:", downloadURL);
  
      //Update the profile state with the new profile picture URL
      setProfile((prevProfile) => ({
        ...prevProfile,
        profilePicture: downloadURL,
      }));

    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload the profile picture. Please try again.");
    }
  };

  // if (loading) return <div>Loading profile...</div>;
  // if (error) return <div>Error: {error}</div>;

  const updateProfile = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/profile/${profile.email}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname: profile.firstName,
          lastname: profile.lastName,
          username: profile.username,
          country: profile.country,
          profilePictureUrl: profile.profilePicture,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
  
      const data = await response.json();
      console.log("Profile updated successfully:", data);
  
      //alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };
  

  return (
    <div className="relative max-h-[75vh] bg-[#E7E4D8] flex items-center justify-center">
      {/* Background Video */}
      <div className="absolute inset-0 z-0 mt-[15%]">
        <video autoPlay loop muted className="w-full max-h-[89vh] object-cover">
          <source src="Gradient.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Profile Box */}
      <div
        className="overflow-visible relative z-10 bg-white rounded-xl shadow-lg w-full max-w-5xl p-12 overflow-y-auto max-h-[73vh] mt-16"
        style={{ marginTop: "5%" }}
      >
        {/* Profile Picture */}
        <div className="absolute top-7 left-1/2 transform -translate-x-1/2 w-28 h-28 bg-gray-300 rounded-full overflow-hidden shadow-md z-12">
          <img
            src={profile.profilePicture}
            alt="Profile"
            className="w-full h-full object-cover"
          />
          <label htmlFor="upload-profile-picture">
            <AiOutlineEdit
              className="absolute bottom-0 right-0 bg-[#822538] p-1 rounded-full text-gray-400 cursor-pointer hover:text-gray-600"
              size={30}
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

        {/* Profile Box Content */}
        <div className="mt-28">
          <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* First Name */}
            <div className="relative">
              <label className="block text-gray-600 font-medium mb-1">First Name</label>
              <input
                type="text"
                className="w-full p-3 border-b-2 border-gray-300 focus:border-blue-400 focus:outline-none bg-transparent"
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
              className="w-full p-3 border-b-2 border-gray-300 focus:border-blue-400 focus:outline-none bg-transparent"
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

          {/* username*/}
          <div className="relative">
            <label className="block text-gray-600 font-medium mb-1">Username</label>
            <input
              type="text"
              className="w-full p-3 border-b-2 border-gray-300 focus:border-blue-400 focus:outline-none bg-transparent"
              value={profile.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              disabled={!isEditable.username}
            />
            <AiOutlineEdit
              className="absolute top-10 right-3 text-gray-400 cursor-pointer hover:text-gray-600"
              onClick={() => toggleEdit("username")}
              size={20}
            />
          </div>

          {/* Email (Non-editable) */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full p-3 border-b-2 border-gray-300 focus:border-blue-400 focus:outline-none bg-transparent cursor-not-allowed"
              value={profile.email}
              disabled
            />
            <span className="text-green-500 text-sm">Verified</span>
          </div>

          {/* role (Non-editable) */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">Role</label>
            <input
              type="tel"
              className="w-full p-3 border-b-2 border-gray-300 focus:border-blue-400 focus:outline-none bg-transparent cursor-not-allowed"
              value={"Designer"}
              disabled
            />
            <span className="text-green-500 text-sm">Verified</span>
          </div>

          {/* Country */}
          <div className="relative">
            <label className="block text-gray-600 font-medium mb-1">Country</label>
            <select
              className="w-full p-3 border-b-2 border-gray-300 focus:border-blue-400 focus:outline-none bg-transparent"
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
          </form>

          {/* Save Button */}
          <div className="mt-6 text-right">
            <button
              className="bg-[#822538] text-white py-3 px-8 rounded-xl shadow-md hover:bg-blue-600"
              onClick={(e) => {
                e.preventDefault();
                updateProfile(); 
              }}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
