import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Settings, LogOut, MapPin, MessageSquare, Grid, Bookmark, Plus, Edit3, Share2, Loader2, Calendar } from 'lucide-react';
import Sidebar from '../nav/Sidebar'; 
import { api } from '../services/api';
import { PostCard, extractErrorMessage, timeAgo } from '../community/Feed';
import './User.css';

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("userId");
  const isOwnProfile = String(currentUserId) === String(id);

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [postToDelete, setPostToDelete] = useState(null);

  // Global delete handler for PostCard reuse
  useEffect(() => {
    window.confirmDeletePost = (postId) => setPostToDelete(postId);
    return () => delete window.confirmDeletePost;
  }, []);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      setError("");
      try {
        // 1. Fetch User Identity
        const userRes = await api.get(`/api/users/${id}`);
        setUser(userRes.data);

        // 2. Fetch All Posts and manually filter by authorId (Since Backend lacks /users/{id}/posts)
        const postsRes = await api.get('/api/posts/feed/summary?page=0&size=100'); // Increase size to ensure we catch their posts implicitly
        const userPosts = (postsRes.data || []).filter(p => String(p.authorId) === String(id));
        setPosts(userPosts);
        
      } catch (err) {
        setError(extractErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProfileData();
  }, [id]);

  const confirmDeletePost = async () => {
    if (!postToDelete) return;
    try {
      await api.delete(`/api/posts/${postToDelete}`);
      setPosts(prev => prev.filter(p => p.id !== postToDelete));
    } catch (err) {
      alert("Failed to delete post: " + extractErrorMessage(err));
    } finally {
      setPostToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="web-profile-layout center" dir="rtl">
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Loader2 className="spinning-loader" size={40} color="#3b82f6" />
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="web-profile-layout center" dir="rtl">
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: 20 }}>
          <h2 style={{color: '#ef4444'}}>Error loading profile</h2>
          <p style={{color: '#a1a1aa'}}>{error || "User not found"}</p>
          <button className="btn-web-primary" onClick={() => navigate('/')}>Return Home</button>
        </div>
      </div>
    );
  }

  // Deep universal fallback to hunt for ANY name field the backend might be providing
  const rawName = user.username || user.name || user.authorName || (user.email ? user.email.split('@')[0] : null) || user.authorEmail?.split('@')[0] || user.id?.toString() || "User";
  const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
  const userHandle = `@${rawName.toLowerCase()}`;

  return (
    <div className="web-profile-layout" dir="rtl">
      <Sidebar />

      <main className="profile-main-content">
        {/* Dynamic Header */}
        <section className="profile-top-card">
          <div className="profile-identity-box">
            <div className="avatar-wrapper-web">
              <div className="avatar-placeholder-web giant">
                {displayName.charAt(0)}
              </div>
            </div>

            <div className="profile-details-web">
              <div className="name-actions-row">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <h1 className="web-display-name">{displayName === "User" && id ? `User ${id}` : displayName}</h1>
                  <span style={{ color: '#a1a1aa', fontSize: '15px' }}>{userHandle}</span>
                </div>
                <div className="profile-web-buttons" style={{ marginRight: 'auto' }}>
                  {isOwnProfile ? (
                    <>
                      <button className="btn-web-secondary"><Edit3 size={18} /> Edit Profile</button>
                      <button className="btn-web-icon"><Settings size={18} /></button>
                      <button className="btn-web-icon logout" onClick={() => { localStorage.clear(); navigate('/login'); }}><LogOut size={18} /></button>
                    </>
                  ) : (
                    <>
                      <button className="btn-web-primary">Follow</button>
                      <button className="btn-web-secondary"><MessageSquare size={18} /> Message</button>
                    </>
                  )}
                </div>
              </div>

              <div className="stats-row-web">
                <span><strong>{posts.length}</strong> Posts</span>
                <span><strong>0</strong> Followers</span>
                <span><strong>0</strong> Following</span>
              </div>

              <div className="bio-area-web">
                 <p className="web-location-text"><Calendar size={16} color="#3b82f6" /> {user.createdAt ? `Joined ${timeAgo(user.createdAt)} ago` : "Active Member"}</p>
                 <p className="web-bio-desc">{user.email || user.authorEmail || ""}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Content Tabs */}
        <div className="profile-tabs-web">
          <button className="tab-item-web active"><Grid size={18} /> Posts</button>
          {isOwnProfile && <button className="tab-item-web"><Bookmark size={18} /> Saved</button>}
        </div>

        {/* Dynamic Posts Feed */}
        <section className="profile-feed-web">
           {posts.length === 0 ? (
             <div className="empty-profile-posts">
               <Grid size={48} color="#27272a" />
               <p>No posts yet</p>
             </div>
           ) : (
             <div className="profile-posts-list">
               {posts.map(post => (
                 <PostCard key={post.id} post={post} currentUserId={currentUserId} />
               ))}
             </div>
           )}
        </section>
      </main>

      {/* Reused Custom Delete Dialog */}
      {postToDelete && (
        <div className="custom-dialog-overlay">
          <div className="custom-dialog-box">
            <h4>Delete Post?</h4>
            <p>Are you sure you want to delete this post? This cannot be undone.</p>
            <div className="custom-dialog-actions">
              <button className="dialog-cancel-btn" onClick={() => setPostToDelete(null)}>Cancel</button>
              <button className="dialog-delete-btn" onClick={confirmDeletePost}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;