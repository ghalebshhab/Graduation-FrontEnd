import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Plus,
  MoreHorizontal,
  Loader2,
  Trash2,
  ImagePlus,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
  Users,
  CalendarSync,
  Tag
} from "lucide-react";
import { api } from "../services/api";
import "./Home.css";

// ----------------------------------------------------------------------------
// UTILITY FUNCTIONS
// ----------------------------------------------------------------------------
export const timeAgo = (instantString) => {
  if (!instantString) return "Just now";
  const date = new Date(instantString);
  if (Number.isNaN(date.getTime())) return "Just now";

  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 31536000;
  if (interval >= 1) return Math.floor(interval) + "y";
  interval = seconds / 2592000;
  if (interval >= 1) return Math.floor(interval) + "mo";
  interval = seconds / 86400;
  if (interval >= 1) return Math.floor(interval) + "d";
  interval = seconds / 3600;
  if (interval >= 1) return Math.floor(interval) + "h";
  interval = seconds / 60;
  if (interval >= 1) return Math.floor(interval) + "m";
  return "Just now"; // For everything under a minute
};

export const extractErrorMessage = (error) => {
  console.log("Feed Error:", error?.response?.data || error);
  const data = error?.response?.data;
  
  if (data?.errors && Array.isArray(data.errors)) {
    return data.errors.map(e => e.defaultMessage || e).join(", ");
  }

  if (typeof data === "string" && data.trim() !== "") return data;
  if (data?.message) return data.message;
  if (data?.error) return data.error;
  return error?.message || "Something went wrong";
};

// ----------------------------------------------------------------------------
// SUB-COMPONENTS
// ----------------------------------------------------------------------------
const StoryCircle = ({ name, imageUrl, isYou, onClick, isUploading }) => (
  <div className="story-item-web" onClick={onClick}>
    <div className={`story-avatar-web ${isYou ? "you" : "others"}`}>
      {isUploading ? (
         <div className="story-loader-overlay">
           <Loader2 className="spinning-loader" size={24} color="#fff" />
         </div>
      ) : (
        <img src={imageUrl || "/placeholder.jpg"} alt={name} />
      )}
      {isYou && !isUploading && (
        <div className="add-badge-web">
          <Plus size={12} strokeWidth={3} />
        </div>
      )}
    </div>
    <span className="story-name-web">{name}</span>
  </div>
);

export const PostCard = ({ post: initialPost, currentUserId }) => {
  const navigate = useNavigate();
  const [post, setPost] = useState(initialPost);
  
  // Like and Bookmark states
  const [isLiked, setIsLiked] = useState(post.isLiked || false); // Backend should optimally return `isLiked` per user
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked || false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  // Comments state
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  // --- Like & Bookmark ---
  const handleToggleLike = async () => {
    if (isLikeLoading) return;
    
    // Optimistic update
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikeCount((prev) => newIsLiked ? prev + 1 : Math.max(0, prev - 1));
    setIsLikeLoading(true);

    try {
      if (isLiked) {
        // If it was already liked, remove it using DELETE
        await api.delete(`/api/posts/${post.id}/likes`, { data: {} });
      } else {
        // If it was NOT liked, add it using POST
        await api.post(`/api/posts/${post.id}/likes`, {});
      }
    } catch (err) {
      // Revert if fails
      setIsLiked(!newIsLiked);
      setLikeCount((prev) => !newIsLiked ? prev + 1 : Math.max(0, prev - 1));
      console.error("Failed to toggle like:", extractErrorMessage(err));
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleToggleBookmark = async () => {
    const newBookmarked = !isBookmarked;
    setIsBookmarked(newBookmarked); // Optimistic
    try {
      await api.post(`/api/posts/${post.id}/bookmark`);
    } catch (err) {
      setIsBookmarked(!newBookmarked);
      console.error("Failed to toggle bookmark:", extractErrorMessage(err));
    }
  };

  // --- Comments ---
  const handleToggleComments = async () => {
    if (!showComments) {
      setShowComments(true);
      if (comments.length === 0) fetchComments();
    } else {
      setShowComments(false);
    }
  };

  const fetchComments = async () => {
    setCommentsLoading(true);
    try {
      const response = await api.get(`/api/posts/${post.id}/comments`);
      setComments(response.data || []);
    } catch (err) {
      console.error("Failed to fetch comments:", extractErrorMessage(err));
    } finally {
      setCommentsLoading(false);
    }
  };

  const handlePostComment = async () => {
    const content = newComment.trim();
    if (!content) return;
    
    setSubmittingComment(true);
    try {
      const response = await api.post(`/api/posts/${post.id}/comments`, { content });
      setComments((prev) => [response.data, ...prev]);
      setPost((prev) => ({ ...prev, commentCount: (prev.commentCount || 0) + 1 }));
      setNewComment("");
    } catch (err) {
      alert("Failed to post comment: " + extractErrorMessage(err));
    } finally {
      setSubmittingComment(false);
    }
  };

  const initiateDeleteComment = (commentId) => {
    setCommentToDelete(commentId);
  };

  const confirmDeleteComment = async () => {
    if (!commentToDelete) return;
    try {
      await api.delete(`/api/posts/comments/${commentToDelete}`);
      setComments((prev) => prev.filter(c => c.id !== commentToDelete));
      setPost((prev) => ({ ...prev, commentCount: Math.max(0, prev.commentCount - 1) }));
    } catch (err) {
      alert("Failed to delete comment: " + extractErrorMessage(err));
    } finally {
      setCommentToDelete(null);
    }
  };

  const authorName = post.authorEmail ? post.authorEmail.split("@")[0] : "User";
  const authorInitial = authorName.charAt(0).toUpperCase();

  return (
    <article className="post-card-web">
      <header className="post-header-web">
        <div className="post-user-web" onClick={() => navigate(`/profile/${post.authorId}`)}>
          <div className="avatar-placeholder-web">
            {authorInitial}
          </div>
          <div className="post-user-info">
            <h4 className="username-web">{authorName}</h4>
            <span className="time-web">{timeAgo(post.createdAt)}</span>
          </div>
        </div>
        {post.type && (
          <div className={`type-badge badge-${post.type.toLowerCase()}`}>
            {post.type === "COMMUNITY" && <Users size={12} />}
            {post.type === "EVENT" && <CalendarSync size={12} />}
            {post.type === "OFFER" && <Tag size={12} />}
            {post.type}
          </div>
        )}

        {String(post.authorId) === String(currentUserId) ? (
           <button className="icon-btn-ghost hover-red" onClick={() => window.confirmDeletePost(post.id)}>
             <Trash2 size={20} />
           </button>
        ) : (
           <button className="icon-btn-ghost"><MoreHorizontal size={20} /></button>
        )}
      </header>

      <div className="post-media-web">
        {post.mediaUrl ? (
           <img src={post.mediaUrl} alt="Post content" loading="lazy" />
        ) : (
           <div className="no-media-placeholder">
             <p>{post.content}</p>
           </div>
        )}
      </div>

      <div className="post-actions-web">
        <div className="actions-right-web">
          <Heart 
            className={`action-icon-web ${isLiked ? "liked" : ""}`} 
            size={26} 
            fill={isLiked ? "#ef4444" : "none"}
            color={isLiked ? "#ef4444" : "currentColor"}
            onClick={handleToggleLike} 
          />
          <MessageCircle className="action-icon-web" size={26} onClick={handleToggleComments} />
          <Send className="action-icon-web" size={26} onClick={() => alert("Share feature coming soon!")} />
        </div>
        <Bookmark 
          className={`action-icon-web ${isBookmarked ? "bookmarked" : ""}`} 
          size={26} 
          fill={isBookmarked ? "#f59e0b" : "none"}
          color={isBookmarked ? "#f59e0b" : "currentColor"}
          onClick={handleToggleBookmark} 
        />
      </div>

      <div className="post-info-web">
        <p className="likes-web">{likeCount} {likeCount === 1 ? "like" : "likes"}</p>
        {post.mediaUrl && (
          <p className="caption-web">
            <span className="caption-username">{authorName}</span> {post.content}
          </p>
        )}
        {post.commentCount > 0 && !showComments && (
          <p className="view-all-comments" onClick={handleToggleComments}>
            View all {post.commentCount} comments
          </p>
        )}
      </div>

      {showComments && (
        <div className="comments-section-web slide-down">
          <div className="comment-create-box-web">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a friendly comment..."
              className="comment-textarea-web"
              rows={1}
            />
            <button 
              onClick={handlePostComment}
              disabled={submittingComment || !newComment.trim()}
              className="comment-submit-btn-web"
            >
              {submittingComment ? <Loader2 size={16} className="spinning-loader"/> : "Post"}
            </button>
          </div>
          
          <div className="comments-list">
            {commentsLoading ? (
              <div className="comments-loader"><Loader2 size={24} className="spinning-loader"/></div>
            ) : comments.length === 0 ? (
              <p className="no-comments-text">No comments yet. Be the first!</p>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className="comment-card-web animate-fade-in">
                  <div className="comment-avatar-web">
                    {(comment.username || "U").charAt(0).toUpperCase()}
                  </div>
                  <div className="comment-body-web">
                    <div className="comment-top-web">
                      <span className="comment-username-web">{comment.username || "User"}</span>
                      {String(comment.userId) === String(currentUserId) && (
                        <button 
                          onClick={() => initiateDeleteComment(comment.id)} 
                          className="icon-btn-ghost text-red-500 hover-red"
                          title="Delete Comment"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    <p className="comment-content-web">{comment.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Delete Comment Dialog */}
      {commentToDelete && (
        <div className="custom-dialog-overlay">
          <div className="custom-dialog-box">
            <h4>Delete Comment?</h4>
            <p>Are you sure you want to delete this comment? This cannot be undone.</p>
            <div className="custom-dialog-actions">
              <button className="dialog-cancel-btn" onClick={() => setCommentToDelete(null)}>Cancel</button>
              <button className="dialog-delete-btn" onClick={confirmDeleteComment}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

// ----------------------------------------------------------------------------
// CREATE POST COMPONENT
// ----------------------------------------------------------------------------
const CreatePostBox = ({ onPostCreated, currentUserId }) => {
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState(null);
  const [postType, setPostType] = useState("COMMUNITY");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMediaUrl(URL.createObjectURL(file));
    e.target.value = null; // reset
  };

  const handleSubmit = async () => {
    if (!content.trim() && !mediaUrl) return;
    setIsSubmitting(true);
    try {
      const payload = { content, mediaUrl, type: postType };
      const response = await api.post("/api/posts", payload);
      onPostCreated(response.data);
      setContent("");
      setMediaUrl(null);
      setPostType("COMMUNITY");
    } catch (err) {
      alert("Failed to create post: " + extractErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-post-web post-card-web">
      <div className="create-post-top">
        <div className="avatar-placeholder-web small">
          {currentUserId ? "U" : "?"}
        </div>
        <textarea
          className="create-post-input"
          placeholder="What's on your mind, engineer?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={2}
        />
      </div>
      {mediaUrl && (
        <div className="create-post-media-preview">
          <button className="remove-preview-btn" onClick={() => setMediaUrl(null)}><X size={16}/></button>
          <img src={mediaUrl} alt="Preview" />
        </div>
      )}
      <div className="create-post-actions">
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: "none" }} 
          accept="image/*,video/*"
          onChange={handleImageUpload} 
        />
        <div style={{ display: "flex", alignItems: "center" }}>
          <button className="icon-btn-ghost submit-media-btn" onClick={() => fileInputRef.current.click()}>
            <ImagePlus size={20} /> <span className="action-text">Media</span>
          </button>
          
          <select 
            className="post-type-select"
            value={postType}
            onChange={e => setPostType(e.target.value)}
          >
            <option value="COMMUNITY">Community</option>
            <option value="EVENT">Event</option>
            <option value="OFFER">Offer</option>
          </select>
        </div>
        <button 
          className="create-post-submit-btn comment-submit-btn-web" 
          disabled={isSubmitting || (!content.trim() && !mediaUrl)}
          onClick={handleSubmit}
        >
          {isSubmitting ? <Loader2 size={16} className="spinning-loader"/> : "Post"}
        </button>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------
// MAIN FEED COMPONENT
// ----------------------------------------------------------------------------
export default function JoMapHome() {
  const currentUserId = localStorage.getItem("userId");
  const fileInputRef = useRef(null);

  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [loadingStories, setLoadingStories] = useState(true);
  
  const [errorFeed, setErrorFeed] = useState("");
  const [errorStories, setErrorStories] = useState("");

  const [postToDelete, setPostToDelete] = useState(null);

  // Expose delete setter globally for PostCard without prop drilling heavily
  useEffect(() => {
    window.confirmDeletePost = (id) => setPostToDelete(id);
    return () => delete window.confirmDeletePost;
  }, []);

  // -- Story Viewer Modes
  const [activeStoryGroup, setActiveStoryGroup] = useState(null); 
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);

  // -- Story Creator Modal
  const [storyDraftMedia, setStoryDraftMedia] = useState(null);
  const [storyDraftCaption, setStoryDraftCaption] = useState("");
  const [isUploadingStory, setIsUploadingStory] = useState(false);
  
  // -- Story Interactions (Local state since no matching backend)
  const [likedStoryIds, setLikedStoryIds] = useState(new Set());

  useEffect(() => {
    fetchPosts();
    fetchStories();
  }, []);

  const fetchPosts = async () => {
    setLoadingFeed(true);
    setErrorFeed("");
    try {
      const response = await api.get("/api/posts/feed/summary?page=0&size=10");
      setPosts(response.data || []);
    } catch (err) {
      setErrorFeed(extractErrorMessage(err));
    } finally {
      setLoadingFeed(false);
    }
  };

  const fetchStories = async () => {
    setLoadingStories(true);
    setErrorStories("");
    try {
      const response = await api.get("/api/stories/active?page=0&size=20");
      const fetchedStories = response.data || [];
      
      // Group by authorEmail or authorId
      const grouped = {};
      fetchedStories.forEach(s => {
        const id = s.authorId || s.authorEmail || "unknown";
        if (!grouped[id]) grouped[id] = [];
        grouped[id].push(s);
      });
      // Convert mapping back to ordered array based on most recent overarching story
      const groupedArray = Object.values(grouped).sort((a,b) => 
         new Date(b[0].createdAt) - new Date(a[0].createdAt)
      );

      setStories(groupedArray);
    } catch (err) {
      setErrorStories(extractErrorMessage(err));
    } finally {
      setLoadingStories(false);
    }
  };

  // --- Story Actions ---
  const handleCreateStoryClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Use local blob to prevent base64 backend crash and spawn preview modal
    const objectUrl = URL.createObjectURL(file);
    setStoryDraftMedia(objectUrl);
    e.target.value = null; 
  };

  const closeStoryDraft = () => {
    setStoryDraftMedia(null);
    setStoryDraftCaption("");
  };

  const uploadStoryToBackend = async () => {
    if (!storyDraftMedia) return;
    setIsUploadingStory(true);
    try {
      const payload = {
        mediaUrl: storyDraftMedia, // We are sending blob URL for MVP only!
        caption: storyDraftCaption || "New story from JoMap",
        expiresInHours: 24
      };
      const response = await api.post("/api/stories", payload);
      
      // Create a fresh group if none exists, or append
      // For simplicity in MVP, we just refetch
      closeStoryDraft();
      fetchStories(); 
    } catch (err) {
      alert("Failed to share story: " + extractErrorMessage(err));
    } finally {
      setIsUploadingStory(false);
    }
  };

  const openStoryViewer = async (storyGroup) => {
    setActiveStoryGroup(storyGroup);
    setActiveStoryIndex(0);
    recordStoryView(storyGroup[0]);
  };

  const recordStoryView = async (story) => {
    try {
      await api.post(`/api/stories/${story.id}/views`, {});
    } catch (err) {
      console.error("Could not record story view", err);
    }
  };

  const nextStory = () => {
    if (!activeStoryGroup) return;
    if (activeStoryIndex < activeStoryGroup.length - 1) {
      const nextIdx = activeStoryIndex + 1;
      setActiveStoryIndex(nextIdx);
      recordStoryView(activeStoryGroup[nextIdx]);
    } else {
      setActiveStoryGroup(null);
    }
  };

  const prevStory = () => {
    if (activeStoryIndex > 0) {
      const prevIdx = activeStoryIndex - 1;
      setActiveStoryIndex(prevIdx);
      recordStoryView(activeStoryGroup[prevIdx]);
    }
  };

  const handleToggleStoryLike = (storyId) => {
    setLikedStoryIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(storyId)) {
        newSet.delete(storyId);
      } else {
        newSet.add(storyId);
      }
      return newSet;
    });
  };

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

  const deleteActiveStory = async () => {
    if (!activeStoryGroup) return;
    const storyId = activeStoryGroup[activeStoryIndex].id;
    try {
      await api.delete(`/api/stories/${storyId}`);
      // Close viewer immediately for UX
      setActiveStoryGroup(null);
      fetchStories(); 
    } catch (err) {
      alert("Failed to delete story: " + extractErrorMessage(err));
    }
  };

  // --- Render Helpers ---
  const renderFeedContent = () => {
    if (loadingFeed) {
      return (
        <div className="feed-loader-container">
           <Loader2 className="spinning-loader" size={40} color="#3b82f6" />
           <p>Loading your feed...</p>
        </div>
      );
    }

    if (errorFeed) {
      return (
        <div className="feed-error-container">
          <p>{errorFeed}</p>
          <button onClick={fetchPosts} className="retry-btn">Try Again</button>
        </div>
      );
    }

    if (posts.length === 0) {
      return (
        <div className="empty-feed-container">
          <Sparkles size={48} color="#f59e0b" className="mb-4" />
          <h3>Welcome to JoMap!</h3>
          <p>Follow other engineers or share a post to get started.</p>
        </div>
      );
    }

    return posts.map((post) => (
      <PostCard 
        key={post.id} 
        post={post} 
        currentUserId={currentUserId} 
      />
    ));
  };

  return (
    <div className="web-home-layout" dir="ltr"> {/* Typically LTR for English/Code standard, adapt if needed */}
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: "none" }} 
        accept="image/*,video/*"
        onChange={handleFileChange} 
      />

      {/* Story Creator Modal */}
      {storyDraftMedia && (
        <div className="story-viewer-overlay">
          <div className="story-creator-modal">
            <div className="story-creator-header">
              <h3>Create Story</h3>
              <button className="icon-btn-ghost" onClick={closeStoryDraft}><X size={24} color="white"/></button>
            </div>
            <div className="story-creator-body">
              <img src={storyDraftMedia} alt="Draft" className="story-draft-image" />
              <textarea 
                className="story-caption-input"
                placeholder="Add a caption..."
                value={storyDraftCaption}
                onChange={(e) => setStoryDraftCaption(e.target.value)}
              />
            </div>
            <div className="story-creator-footer">
              <button className="dialog-cancel-btn" onClick={closeStoryDraft} disabled={isUploadingStory}>Cancel</button>
              <button className="dialog-delete-btn bg-blue-500 hover:bg-blue-600" style={{background: '#3b82f6'}} onClick={uploadStoryToBackend} disabled={isUploadingStory}>
                {isUploadingStory ? <Loader2 size={18} className="spinning-loader"/> : "Share"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Post Dialog */}
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

      {/* Story Viewer Modal (Group Iteration) */}
      {activeStoryGroup && (
        <div className="story-viewer-overlay">
          <button className="close-story-btn" onClick={() => setActiveStoryGroup(null)}><X size={32} color="white" /></button>
          
          <div className="story-content-container">
            {/* Story Timeline Bars */}
            <div className="story-progress-container">
              {activeStoryGroup.map((_, i) => (
                <div key={i} className="story-progress-bar">
                  <div className={`story-progress-fill ${i < activeStoryIndex ? "completed" : i === activeStoryIndex ? "active" : ""}`} />
                </div>
              ))}
            </div>

            <div className="story-viewer-inner" onClick={nextStory}>
              {/* Previous Click Target */}
              <div className="story-tap-zone prev-zone" onClick={(e) => { e.stopPropagation(); prevStory(); }}>
                {activeStoryIndex > 0 && <ChevronLeft size={36} color="rgba(255,255,255,0.7)" />}
              </div>

              <img 
                src={activeStoryGroup[activeStoryIndex].mediaUrl} 
                alt="Story" 
                className="active-story-media" 
              />
              
              <div className="story-viewer-info">
                <div className="story-author-header">
                  <div className="avatar-placeholder-web micro">
                    {(activeStoryGroup[activeStoryIndex].authorEmail || "U").charAt(0).toUpperCase()}
                  </div>
                  <p><strong>{activeStoryGroup[activeStoryIndex].authorEmail?.split('@')[0] || "User"}</strong></p>
                  <span className="story-time-stamp">{timeAgo(activeStoryGroup[activeStoryIndex].createdAt)}</span>
                  
                  {String(activeStoryGroup[activeStoryIndex].authorId || "") === String(currentUserId) && (
                    <button className="icon-btn-ghost hover-red" style={{marginLeft: "10px"}} onClick={(e) => { e.stopPropagation(); deleteActiveStory(); }}>
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
                <p className="story-viewer-caption">{activeStoryGroup[activeStoryIndex].caption}</p>
                
                {/* Simulated Reply Input (No Backend Logic) */}
                <div className="story-reply-box" onClick={e => e.stopPropagation()}>
                  <input type="text" placeholder="Reply to story..." className="story-reply-input" />
                  <Heart 
                    className={`action-icon-web ${likedStoryIds.has(activeStoryGroup[activeStoryIndex].id) ? "liked" : ""}`} 
                    size={28} 
                    fill={likedStoryIds.has(activeStoryGroup[activeStoryIndex].id) ? "#ef4444" : "none"}
                    color={likedStoryIds.has(activeStoryGroup[activeStoryIndex].id) ? "#ef4444" : "white"} 
                    onClick={() => handleToggleStoryLike(activeStoryGroup[activeStoryIndex].id)} 
                  />
                  <Send className="action-icon-web" size={24} color="white" onClick={() => alert("Reply sent natively!")} />
                </div>
              </div>

              {/* Next Click Target */}
              <div className="story-tap-zone next-zone" onClick={(e) => { e.stopPropagation(); nextStory(); }}>
               {activeStoryIndex < activeStoryGroup.length - 1 && <ChevronRight size={36} color="rgba(255,255,255,0.7)" />}
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="home-main-feed">
        {/* Stories Section */}
        <div className="stories-bar-web">
          <StoryCircle
            name={isUploadingStory ? "Uploading..." : "Your Story"}
            isYou={true}
            isUploading={isUploadingStory}
            onClick={handleCreateStoryClick}
          />
          
          {loadingStories ? (
            <div className="stories-loading-placeholder">
              <Loader2 className="spinning-loader" size={20} color="#71717a" />
            </div>
          ) : stories.length === 0 ? (
            <div className="no-stories-msg">No stories yet</div>
          ) : (
            stories.map((storyGroup) => {
              const latestStory = storyGroup[0];
              return (
                <StoryCircle
                  key={latestStory.id}
                  name={latestStory.authorEmail?.split('@')[0] || "User"}
                  imageUrl={latestStory.mediaUrl}
                  onClick={() => openStoryViewer(storyGroup)}
                />
              )
            })
          )}
        </div>

        {/* Feed Posts */}
        <div className="feed-container-web">
          <CreatePostBox onPostCreated={(newPost) => setPosts([newPost, ...posts])} currentUserId={currentUserId} />
          {renderFeedContent()}
        </div>
      </main>

      {/* Right Sidebar Suggestions */}
      <aside className="home-suggestions-bar">
        <div className="suggestion-card-web highlight-card">
          <h3 className="widget-title-web">
            <Sparkles size={20} color="#f59e0b" /> Discover JoMap
          </h3>
          <p className="suggestion-text">
            Connect with local engineers and build together. Explore new communities and opportunities in tech!
          </p>
          <button className="join-community-btn mt-4 w-full">Explore Networks</button>
        </div>
      </aside>
    </div>
  );
}