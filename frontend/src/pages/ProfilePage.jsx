import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Camera } from 'lucide-react';
import { User, Mail } from 'lucide-react';

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [fullName, setFullName] = useState(authUser?.fullName || '');
  const [email, setEmail] = useState(authUser?.email || '');

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.readAsDataURL(file);
  
    reader.onload = async () => {
      const base64Image = reader.result; // Corrected reference
      setSelectedImg(base64Image); // Update UI
      await updateProfile({ profilePic: base64Image }); // Send to backend
    };
  };
  
  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-gray-800 rounded-xl p-6 space-y-8 shadow-2xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">Profile</h1>
            <p className="mt-2 text-gray-400">Manage your profile information</p>
          </div>
          {/* Avatar */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || (authUser ? authUser.profilePic : '/avatar.png')}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-700 shadow-md"
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-1 right-1 
                  bg-gray-700 hover:bg-gray-600 
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200 shadow-lg
                  ${isUpdatingProfile ? 'animate-pulse pointer-events-none' : ''}`}
              >
                <Camera className="w-5 h-5 text-gray-300" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-gray-400">
              {isUpdatingProfile ? 'Uploading...' : 'Click the camera icon to update your photo'}
            </p>
          </div>
          {/* Profile Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-300 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </label>
              <input
                className="w-full px-5 py-3 bg-gray-700 rounded-lg border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-300 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <input
                className="w-full px-5 py-3 bg-gray-700 rounded-lg border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          {/* Account Info */}
          <div className="mt-6 bg-gray-700 rounded-xl p-6 shadow-lg">
            <h2 className="text-lg font-medium mb-4 text-gray-200">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-gray-600">
                <span className="text-gray-400">Member Since</span>
                <span>{authUser?.createdAt?.split('T')[0] || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-400">Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
