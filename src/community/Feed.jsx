import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart, FaComment, FaShareAlt } from 'react-icons/fa';
import { api } from '../services/api';

const JoMapHome = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch posts from backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Adjust this endpoint based on your actual backend route (e.g., /api/posts)
        const response = await api.get('/api/posts'); 
        setPosts(response.data.data || response.data || []);
      } catch (err) {
        setError('تعذر تحميل المنشورات. يرجى التأكد من اتصالك بالخادم.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const toggleLike = async (postId, currentLikedStatus) => {
    // Optimistic UI update
    setPosts(posts.map(p => p.id === postId ? { ...p, isLiked: !currentLikedStatus, likesCount: currentLikedStatus ? p.likesCount - 1 : p.likesCount + 1 } : p));
    
    try {
      await api.post(`/api/posts/${postId}/like`);
    } catch (err) {
      // Revert if failed
      setPosts(posts.map(p => p.id === postId ? { ...p, isLiked: currentLikedStatus, likesCount: currentLikedStatus ? p.likesCount + 1 : p.likesCount - 1 } : p));
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 pb-24 md:pb-6 font-sans">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">اكتشف الأردن</h1>
        <p className="text-gray-500">أحدث الفعاليات والمنشورات من مجتمع JoMap</p>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-center border border-red-100">
          {error}
        </div>
      )}

      {/* Loading Skeletons */}
      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((skeleton) => (
            <div key={skeleton} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 w-16 bg-gray-100 rounded"></div>
                </div>
              </div>
              <div className="h-24 bg-gray-100 rounded-xl mb-4"></div>
              <div className="flex gap-4">
                <div className="h-6 w-12 bg-gray-200 rounded"></div>
                <div className="h-6 w-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Posts Feed */
        <div className="space-y-6">
          {posts.length === 0 && !error ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-500">
              لا توجد منشورات حتى الآن. كن أول من يشارك!
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                
                {/* Post Header (User Info) */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={post.userProfilePic || "https://ui-avatars.com/api/?name=" + (post.authorName || "User")} 
                      alt="avatar" 
                      className="w-12 h-12 rounded-full object-cover border border-gray-200"
                    />
                    <div>
                      <h3 className="font-bold text-gray-900">{post.authorName || "مستخدم JoMap"}</h3>
                      <p className="text-xs text-gray-500">{post.createdAt || "منذ قليل"}</p>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <p className="text-gray-800 mb-4 leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </p>

                {/* Post Image (Optional) */}
                {post.imageUrl && (
                  <img 
                    src={post.imageUrl} 
                    alt="Post media" 
                    className="w-full h-64 object-cover rounded-xl mb-4 border border-gray-100"
                  />
                )}

                <hr className="border-gray-100 mb-4" />

                {/* Post Actions */}
                <div className="flex items-center gap-6 text-gray-500">
                  <button 
                    onClick={() => toggleLike(post.id, post.isLiked)}
                    className={`flex items-center gap-2 transition-colors ${post.isLiked ? 'text-red-500' : 'hover:text-red-500'}`}
                  >
                    {post.isLiked ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
                    <span className="font-medium">{post.likesCount || 0}</span>
                  </button>
                  
                  <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
                    <FaComment size={20} />
                    <span className="font-medium">{post.commentsCount || 0}</span>
                  </button>

                  <button className="flex items-center gap-2 hover:text-green-500 transition-colors mr-auto">
                    <FaShareAlt size={18} />
                  </button>
                </div>

              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default JoMapHome;