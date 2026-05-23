import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Eye, Bookmark } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { likePost, savePost } from "../../services/api";

const PostCard = ({ post }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [liked, setLiked] = useState(post.likes?.some(l => l.user === user?.id) || false);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [saved, setSaved] = useState(false);

  const handleLike = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      const response = await likePost(post._id);
      setLiked(response.data.liked);
      setLikesCount(response.data.likesCount);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      const response = await savePost(post._id);
      setSaved(response.data.saved);
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(post);
  };

  return (
    <div className="card group relative">
      <Link to={`/post/${post._id}`}>
        <div className="relative overflow-hidden">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full object-cover transition-transform duration-300 group-hover:scale-110"
            style={{ aspectRatio: "4/5" }}
          />
          
          {/* Overlay buttons */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300">
            <div className="absolute bottom-4 left-4 right-4 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleLike}
                className="bg-white rounded-full p-2 hover:scale-110 transition"
              >
                <Heart className={`h-5 w-5 ${liked ? "fill-red-500 text-red-500" : "text-gray-700"}`} />
              </button>
              
              <button
                onClick={handleAddToCart}
                className="bg-white rounded-full p-2 hover:scale-110 transition"
              >
                <ShoppingCart className="h-5 w-5 text-gray-700" />
              </button>
              
              <button
                onClick={handleSave}
                className="bg-white rounded-full p-2 hover:scale-110 transition"
              >
                <Bookmark className={`h-5 w-5 ${saved ? "fill-purple-500 text-purple-500" : "text-gray-700"}`} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-3">
          <h3 className="font-semibold text-sm truncate">{post.title}</h3>
          <div className="flex justify-between items-center mt-1">
            <p className="text-purple-600 font-bold">${post.finalPrice || post.price}</p>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span className="flex items-center">
                <Heart className="h-3 w-3 mr-1" /> {likesCount}
              </span>
              <span className="flex items-center">
                <Eye className="h-3 w-3 mr-1" /> {post.views || 0}
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">by {post.user?.username}</p>
        </div>
      </Link>
    </div>
  );
};

export default PostCard;
