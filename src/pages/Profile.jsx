import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { auth, storage } from "../firebase";
import {
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import CustomCursor from "../components/CustomCursor";
import { FaCamera, FaTrash } from "react-icons/fa";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isGoogleUser, setIsGoogleUser] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setDisplayName(currentUser.displayName || "");
        setProfilePic(
          currentUser.photoURL || "https://via.placeholder.com/150"
        );
        // Check if the user signed in with Google
        const googleProvider = currentUser.providerData.some(
          (provider) => provider.providerId === "google.com"
        );
        setIsGoogleUser(googleProvider);
        setLoading(false);
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleNameUpdate = async () => {
    setError("");
    setSuccess("");
    try {
      await updateProfile(user, { displayName });
      setSuccess("Name updated successfully!");
    } catch (err) {
      setError("Failed to update name: " + err.message);
    }
  };

  const handlePasswordChange = async () => {
    setError("");
    setSuccess("");
    if (isGoogleUser) {
      setError(
        "Google users cannot change passwords here. Manage your password via Google Account settings."
      );
      return;
    }
    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setSuccess("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setError("Failed to update password: " + err.message);
    }
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setError("");
      setSuccess("");
      try {
        const storageRef = ref(storage, `profile_pics/${user.uid}`);
        await uploadBytes(storageRef, file);
        const photoURL = await getDownloadURL(storageRef);
        await updateProfile(user, { photoURL });
        setProfilePic(photoURL);
        setSuccess("Profile picture updated successfully!");
      } catch (err) {
        setError("Failed to update profile picture: " + err.message);
      }
    }
  };

  const handleDeleteAccount = async () => {
    setError("");
    setSuccess("");
    if (!isGoogleUser) {
      try {
        const credential = EmailAuthProvider.credential(
          user.email,
          currentPassword
        );
        await reauthenticateWithCredential(user, credential);
      } catch (err) {
        setError("Failed to reauthenticate: " + err.message);
        return;
      }
    }
    try {
      await deleteUser(user);
      setSuccess("Account deleted successfully!");
      navigate("/login");
    } catch (err) {
      setError("Failed to delete account: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-t-cyan-500 border-r-magenta-500 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white relative">
      <CustomCursor />
      <div className="container mx-auto px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <section className="mb-12 mt-6 flex justify-between items-center">
            <h1 className="text-4xl font-bold text-cyan-400">Profile</h1>
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg"
            >
              Back to Dashboard
            </motion.button>
          </section>

          {/* Profile Details */}
          <section className="mb-12 bg-gray-800 bg-opacity-80 p-6 rounded-xl shadow-xl">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">
              Your Details
            </h2>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-2 border-cyan-500"
                />
                <label
                  htmlFor="profile-pic-upload"
                  className="absolute bottom-0 right-0 p-2 bg-cyan-500 rounded-full cursor-pointer"
                >
                  <FaCamera size={20} />
                  <input
                    id="profile-pic-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePicChange}
                  />
                </label>
              </div>
              <div className="space-y-2">
                <p>
                  <span className="font-semibold text-cyan-400">Email:</span>{" "}
                  {user.email}
                </p>
                <p>
                  <span className="font-semibold text-cyan-400">Name:</span>{" "}
                  {user.displayName || "Not set"}
                </p>
                <p>
                  <span className="font-semibold text-cyan-400">
                    Sign-in Method:
                  </span>{" "}
                  {isGoogleUser ? "Google" : "Email/Password"}
                </p>
                <p>
                  <span className="font-semibold text-cyan-400">
                    Account Created:
                  </span>{" "}
                  {new Date(user.metadata.creationTime).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-semibold text-cyan-400">
                    Last Login:
                  </span>{" "}
                  {new Date(user.metadata.lastSignInTime).toLocaleDateString()}
                </p>
              </div>
            </div>
          </section>

          {/* Edit Name */}
          <section className="mb-12 bg-gray-800 bg-opacity-80 p-6 rounded-xl shadow-xl">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Edit Name</h2>
            <div className="flex space-x-4">
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full p-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Enter your name"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleNameUpdate}
                className="px-4 py-2 bg-cyan-500 text-black rounded-lg font-semibold"
              >
                Update Name
              </motion.button>
            </div>
          </section>

          {/* Change Password (Hidden for Google Users) */}
          {!isGoogleUser && (
            <section className="mb-12 bg-gray-800 bg-opacity-80 p-6 rounded-xl shadow-xl">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">
                Change Password
              </h2>
              <div className="space-y-4">
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Current Password"
                />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="New Password"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={handlePasswordChange}
                  className="px-4 py-2 bg-cyan-500 text-black rounded-lg font-semibold"
                >
                  Update Password
                </motion.button>
              </div>
            </section>
          )}

          {/* Message for Google Users */}
          {isGoogleUser && (
            <section className="mb-12 bg-gray-800 bg-opacity-80 p-6 rounded-xl shadow-xl">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">
                Password Management
              </h2>
              <p className="text-gray-400">
                You signed in with Google. To change your password, please visit
                your{" "}
                <a
                  href="https://myaccount.google.com/security"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 underline"
                >
                  Google Account settings
                </a>
                .
              </p>
            </section>
          )}

          {/* Delete Account */}
          <section className="mb-12 bg-gray-800 bg-opacity-80 p-6 rounded-xl shadow-xl">
            <h2 className="text-2xl font-bold text-red-400 mb-4">
              Delete Account
            </h2>
            <p className="text-gray-400 mb-4">
              This action is irreversible.{" "}
              {isGoogleUser
                ? "Confirm by clicking below."
                : "Enter your current password to confirm."}
            </p>
            {!isGoogleUser ? (
              <div className="flex space-x-4">
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Current Password"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold"
                >
                  Delete Account
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold"
              >
                Delete Account
              </motion.button>
            )}
          </section>

          {/* Status Messages */}
          {error && <p className="text-red-400 text-center mb-4">{error}</p>}
          {success && (
            <p className="text-green-400 text-center mb-4">{success}</p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
