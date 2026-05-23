import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Eye, Bookmark, Share2, Download, ArrowLeft, User, Calendar, MessageCircle } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  // Mock post data - replace with API call
  useEffect(() => {
    setTimeout(() => {
      setPost({
        id: parseInt(id),
        name: "காஞ்சிபுரம் பட்டு சேலை",
        nameEn: "Kanchipuram Silk Saree",
        price: 8999,
        description: "Handwoven pure silk saree from Kanchipuram, Tamil Nadu. Features traditional zari work and intricate patterns.",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800",
        artisan: "காஞ்சி நெசவாளர்",
        artisanEn: "Kanchi Weaver",
        artisanAvatar: "https://randomuser.me/api/portraits/women/1.jpg",
        category: "Fashion",
        likes: 1234,
        views: 5678,
        createdAt: "2024-01-15",
        inStock: true,
        sizes: ["S", "M", "L", "XL"],
        colors: ["Red", "Gold", "Green", "Blue"]
      });
      setComments([
        { id: 1, user: "Priya R.", text: "Beautiful saree! Loved the quality.", likes: 12, date: "2024-01-20" },
        { id: 2, user: "Karthik S.", text: "Excellent craftsmanship. Worth every rupee.", likes: 8, date: "2024-01-18" },
      ]);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleLike = () => {
    setLiked(!liked);
    setPost(prev => ({ ...prev, likes: liked ? prev.likes - 1 : prev.likes + 1 }));
  };

  const handleAddToCart = () => {
    addToCart(post);
    alert("Added to cart!");
  };

  const handleComment = () => {
    if (comment.trim()) {
      setComments([{ id: Date.now(), user: user?.username || "Guest", text: comment, likes: 0, date: new Date().toISOString() }, ...comments]);
      setComment("");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 dark:from-gray-900 dark:to-purple-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-orange-500 mb-6">
          <ArrowLeft className="h-5 w-5" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="relative">
            <img src={post.image} alt={post.name} className="w-full rounded-2xl shadow-2xl" />
            {post.inStock && <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm">In Stock</div>}
          </motion.div>

          {/* Details Section */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">{post.name}</h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">{post.nameEn}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <img src={post.artisanAvatar} alt={post.artisan} className="w-12 h-12 rounded-full" />
                <div>
                  <p className="font-semibold">{post.artisan}</p>
                  <p className="text-sm text-gray-500">{post.artisanEn}</p>
                </div>
              </div>
              <button className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm hover:bg-orange-600 transition">Follow</button>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                <span>{post.likes} likes</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-500" />
                <span>{post.views} views</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="border-t border-b py-4">
              <p className="text-3xl font-bold text-orange-500">₹{post.price.toLocaleString()}</p>
              <p className="text-gray-600 dark:text-gray-400 mt-2">{post.description}</p>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="font-semibold mb-2">Select Size</h3>
              <div className="flex gap-2">
                {post.sizes.map(size => (
                  <button key={size} className="border-2 border-gray-300 px-4 py-2 rounded-lg hover:border-orange-500 transition">{size}</button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="font-semibold mb-2">Select Color</h3>
              <div className="flex gap-2">
                {post.colors.map(color => (
                  <button key={color} className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-orange-500 transition" style={{ backgroundColor: color.toLowerCase() }} title={color} />
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button onClick={handleAddToCart} className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-full font-semibold hover:shadow-lg transition">
                Add to Cart
              </button>
              <button onClick={handleLike} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 transition">
                <Heart className={`h-6 w-6 ${liked ? "fill-red-500 text-red-500" : ""}`} />
              </button>
              <button className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 transition">
                <Share2 className="h-6 w-6" />
              </button>
              <button className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 transition">
                <Bookmark className="h-6 w-6" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Comments Section */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2"><MessageCircle /> Comments ({comments.length})</h3>
          
          {user && (
            <div className="flex gap-3 mb-6">
              <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write a comment..." className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:border-orange-500" />
              <button onClick={handleComment} className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition">Post</button>
            </div>
          )}

          <div className="space-y-4">
            {comments.map(c => (
              <div key={c.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
                <div className="flex justify-between items-start">
                  <div><p className="font-semibold">{c.user}</p><p className="text-gray-600 dark:text-gray-400 mt-1">{c.text}</p></div>
                  <button className="text-red-500"><Heart className="h-4 w-4" /> {c.likes}</button>
                </div>
                <p className="text-xs text-gray-400 mt-2">{new Date(c.date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
