import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Settings, Camera, Grid, Heart, Bookmark, Calendar, MapPin, Link as LinkIcon, Mail, Phone } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Profile = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setProfile({
        id: 1,
        username: username || currentUser?.username || "TamilArtisan",
        name: "Rajeshwari S.",
        email: "rajeshwari@tamilart.com",
        bio: "Preserving Tamil Nadu's rich cultural heritage through traditional art forms. 10+ years of experience in Kanchipuram silk weaving.",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg",
        coverImage: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200",
        location: "Kanchipuram, Tamil Nadu",
        website: "https://tamilart.com",
        joinedDate: "2023-01-15",
        stats: { posts: 24, followers: 1245, following: 89 },
        posts: Array(12).fill().map((_, i) => ({ id: i, title: `Masterpiece ${i+1}`, image: `https://picsum.photos/400/500?random=${i}`, likes: Math.floor(Math.random() * 1000) })),
        savedPosts: Array(6).fill().map((_, i) => ({ id: i, title: `Saved Art ${i+1}`, image: `https://picsum.photos/400/500?random=${i+100}` }))
      });
      setLoading(false);
    }, 500);
  }, [username, currentUser]);

  const handleFollow = () => setFollowing(!following);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500"></div></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 dark:from-gray-900 dark:to-purple-900">
      {/* Cover Photo */}
      <div className="relative h-64 md:h-80">
        <img src={profile.coverImage} alt="Cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <button className="absolute bottom-4 right-4 bg-black/50 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-black/70 transition">
          <Camera className="h-4 w-4" /> Update Cover
        </button>
      </div>

      {/* Profile Info */}
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="flex flex-col md:flex-row gap-6 -mt-20 mb-8">
          <img src={profile.avatar} alt={profile.username} className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-xl object-cover" />
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
              <h1 className="text-3xl font-bold">{profile.name}</h1>
              <p className="text-gray-600 dark:text-gray-400">@{profile.username}</p>
              {currentUser?.username !== profile.username && (
                <button onClick={handleFollow} className={`px-6 py-2 rounded-full font-semibold transition ${following ? "bg-gray-200 text-gray-700" : "bg-gradient-to-r from-orange-500 to-red-500 text-white"}`}>
                  {following ? "Following" : "Follow"}
                </button>
              )}
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-3">{profile.bio}</p>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
              {profile.location && <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {profile.location}</span>}
              {profile.website && <span className="flex items-center gap-1"><LinkIcon className="h-4 w-4" /> {profile.website}</span>}
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Joined {new Date(profile.joinedDate).toLocaleDateString()}</span>
            </div>
          </div>
          
          {currentUser?.username === profile.username && (
            <button className="bg-gray-200 dark:bg-gray-700 px-6 py-2 rounded-full flex items-center gap-2 hover:bg-gray-300 transition">
              <Settings className="h-4 w-4" /> Edit Profile
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="flex justify-around gap-4 py-4 border-y border-gray-200 dark:border-gray-700 mb-8">
          {[
            { label: "Posts", value: profile.stats.posts, icon: Grid },
            { label: "Followers", value: profile.stats.followers, icon: User },
            { label: "Following", value: profile.stats.following, icon: Heart }
          ].map(stat => (
            <div key={stat.label} className="text-center"><stat.icon className="h-6 w-6 mx-auto mb-1 text-gray-500" /><p className="text-2xl font-bold">{stat.value}</p><p className="text-sm text-gray-500">{stat.label}</p></div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200 dark:border-gray-700 mb-6">
          {[
            { id: "posts", label: "Posts", icon: Grid, count: profile.stats.posts },
            { id: "saved", label: "Saved", icon: Bookmark, count: profile.savedPosts.length }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`pb-3 flex items-center gap-2 transition ${activeTab === tab.id ? "border-b-2 border-orange-500 text-orange-500" : "text-gray-500"}`}>
              <tab.icon className="h-5 w-5" /> {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 pb-12">
          {(activeTab === "posts" ? profile.posts : profile.savedPosts).map((post, idx) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="break-inside-avoid cursor-pointer group relative">
              <img src={post.image} alt={post.title} className="w-full rounded-lg shadow hover:shadow-xl transition" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
                <span className="text-white font-bold">{post.likes || 0}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
