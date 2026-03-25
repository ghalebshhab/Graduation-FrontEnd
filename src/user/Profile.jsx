import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Edit3,
  Loader2,
  LogOut,
  MapPin,
  Calendar,
  Globe,
  Save,
  X,
  User
} from 'lucide-react';
import Sidebar from '../nav/Sidebar';
import { api } from '../services/api';
import './User.css';

const EMPTY_FORM = {
  userName: '',
  phoneNumber: '',
  profileImageUrl: '',
  coverImageUrl: '',
  bio: '',
  location: '',
  birthDate: '',
  website: ''
};

// Helper function to compress large images into lightweight Base64 strings natively
const compressImage = (file, maxWidth = 600, maxHeight = 600) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Compress as JPEG
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

function getErrorMessage(err) {
  return (
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    'Something went wrong'
  );
}

function unwrapResponse(payload) {
  if (!payload) return null;

  if (payload.success === false) {
    throw new Error(payload.message || 'Request failed');
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'data')) {
    return payload.data;
  }

  return payload;
}

function normalizeProfile(payload) {
  const src = unwrapResponse(payload);
  if (!src) return null;

  return {
    userId: src.userId ?? src.id ?? src.user_id ?? null,
    username: src.username ?? src.userName ?? src.name ?? '',
    email: src.email ?? '',
    phoneNumber: src.phoneNumber ?? src.phone_number ?? '',
    profileImageUrl: src.profileImageUrl ?? src.profile_image_url ?? '',
    bio: src.bio ?? '',
    location: src.location ?? '',
    birthDate: src.birthDate ?? src.birth_date ?? '',
    website: src.website ?? '',
    createdAt: src.createdAt ?? src.created_at ?? ''
  };
}

function normalizePosts(payload) {
  const src = unwrapResponse(payload);
  if (Array.isArray(src)) return src;
  return [];
}

function buildForm(user) {
  return {
    userName: user?.username || '',
    phoneNumber: user?.phoneNumber || '',
    profileImageUrl: user?.profileImageUrl || '',
    coverImageUrl: user?.coverImageUrl || '',
    bio: user?.bio || '',
    location: user?.location || '',
    birthDate: user?.birthDate || '',
    website: user?.website || ''
  };
}

function formatJoinedDate(dateValue) {
  if (!dateValue) return 'No join date';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return 'No join date';
  return date.toLocaleDateString();
}

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const localUserId = String(localStorage.getItem('userId') || '').trim();
  const localUsername = String(localStorage.getItem('username') || '').trim().toLowerCase();

  const routeId = String(id || '').trim();
  const isMeRoute = !routeId || routeId === 'me';

  const viewedUserId = useMemo(() => {
    if (isMeRoute) return localUserId;
    return routeId;
  }, [isMeRoute, localUserId, routeId]);

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');

  const profileGetEndpoint = viewedUserId ? `/api/profile/${viewedUserId}` : null;
  const profileUpdateEndpoint = '/api/profile/me';

  const isOwnProfile = useMemo(() => {
    const loadedUserId = String(user?.userId || '').trim();
    const loadedUsername = String(user?.username || '').trim().toLowerCase();

    if (isMeRoute) return true;
    if (localUserId && routeId && localUserId === routeId) return true;
    if (localUserId && loadedUserId && localUserId === loadedUserId) return true;
    if (localUsername && loadedUsername && localUsername === loadedUsername) return true;

    return false;
  }, [isMeRoute, localUserId, routeId, user, localUsername]);

  useEffect(() => {
    let mounted = true;

    async function loadPage() {
      setLoading(true);
      setPageError('');

      try {
        if (!profileGetEndpoint) {
          throw new Error(
            'Profile id was not found. Make sure userId is saved in localStorage after login.'
          );
        }

        const profileRes = await api.get(profileGetEndpoint);
        const profileData = normalizeProfile(profileRes.data);

        if (!profileData) {
          throw new Error('Profile data not found');
        }

        let postsData = [];
        try {
          const postsRes = await api.get('/api/posts/feed/summary?page=0&size=100');
          const allPosts = normalizePosts(postsRes.data);
          postsData = allPosts.filter(
            (post) => String(post.authorId ?? post.userId ?? post.author_id ?? '') === String(profileData.userId)
          );
        } catch (postErr) {
          console.error('Posts load failed:', postErr);
          postsData = [];
        }

        if (!mounted) return;

        setUser(profileData);
        setForm(buildForm(profileData));
        setPosts(postsData);
      } catch (err) {
        console.error('Profile page error:', err);
        if (mounted) {
          setPageError(getErrorMessage(err));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadPage();

    return () => {
      mounted = false;
    };
  }, [profileGetEndpoint]);

  const openEditModal = () => {
    setEditError('');
    setEditSuccess('');
    setForm(buildForm(user));
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    if (saving) return;
    setIsEditOpen(false);
    setEditError('');
    setEditSuccess('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const base64String = await compressImage(file);
      setForm((prev) => ({
        ...prev,
        [fieldName]: base64String
      }));
    } catch (err) {
      console.error("Image compression error:", err);
      setEditError("Failed to process image. Please try another one.");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setEditError('');
    setEditSuccess('');

    try {
      const payload = {
        userName: form.userName?.trim() || null,
        phoneNumber: form.phoneNumber?.trim() || null,
        profileImageUrl: form.profileImageUrl?.trim() || null,
        coverImageUrl: form.coverImageUrl?.trim() || null,
        bio: form.bio?.trim() || null,
        location: form.location?.trim() || null,
        birthDate: form.birthDate || null,
        website: form.website?.trim() || null
      };

      const res = await api.put(profileUpdateEndpoint, payload);
      const updatedUser = normalizeProfile(res.data);

      if (!updatedUser) {
        throw new Error('Updated profile data is invalid');
      }

      setUser(updatedUser);
      setForm(buildForm(updatedUser));
      setEditSuccess('Profile updated successfully');

      setTimeout(() => {
        setIsEditOpen(false);
        setEditSuccess('');
      }, 900);
    } catch (err) {
      console.error('Profile update error:', err);
      setEditError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="profile-layout">
        <Sidebar />
        <main className="profile-main center-box">
          <Loader2 className="spin" size={34} />
        </main>
      </div>
    );
  }

  if (pageError || !user) {
    return (
      <div className="profile-layout">
        <Sidebar />
        <main className="profile-main center-box">
          <div className="state-card">
            <h2>Failed to load profile</h2>
            <p>{pageError || 'Profile not found'}</p>
            <button className="primary-btn" onClick={() => navigate('/')}>
              Return Home
            </button>
          </div>
        </main>
      </div>
    );
  }

  const displayName =
    user.username ||
    (user.email ? user.email.split('@')[0] : '') ||
    `User ${user.userId || ''}`;

  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className="profile-layout">
      <Sidebar />

      <main className="profile-main">
        <section className="profile-card">
          <div 
            className="profile-cover" 
            style={user.coverImageUrl ? { backgroundImage: `url(${user.coverImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
          />

          <div className="profile-content">
            <div className="avatar-box">
              {user.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt={displayName}
                  className="avatar-img"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="avatar-fallback">{avatarLetter}</div>
              )}
            </div>

            <div className="profile-info">
              <div className="profile-top-row">
                <div>
                  <h1 className="profile-name">{displayName}</h1>
                  <p className="profile-handle">
                    {user.username ? `@${user.username}` : '@user'}
                  </p>
                </div>

                <div className="profile-actions">
                  {isOwnProfile && (
                    <>
                      <button className="secondary-btn" onClick={openEditModal}>
                        <Edit3 size={16} />
                        Edit Profile
                      </button>

                      <button className="danger-btn" onClick={handleLogout}>
                        <LogOut size={16} />
                        Logout
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="stats-row">
                <div className="stat-item">
                  <strong>{posts.length}</strong>
                  <span>Posts</span>
                </div>
                <div className="stat-item">
                  <strong>0</strong>
                  <span>Followers</span>
                </div>
                <div className="stat-item">
                  <strong>0</strong>
                  <span>Following</span>
                </div>
              </div>

              {user.bio && <p className="profile-bio">{user.bio}</p>}

              <div className="meta-list">
                {user.location && (
                  <div className="meta-item">
                    <MapPin size={15} />
                    <span>{user.location}</span>
                  </div>
                )}

                {user.website && (
                  <a
                    className="meta-item link-item"
                    href={user.website}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Globe size={15} />
                    <span>{user.website}</span>
                  </a>
                )}

                {user.birthDate && (
                  <div className="meta-item">
                    <Calendar size={15} />
                    <span>{user.birthDate}</span>
                  </div>
                )}

                <div className="meta-item">
                  <Calendar size={15} />
                  <span>Joined {formatJoinedDate(user.createdAt)}</span>
                </div>
              </div>

              {isOwnProfile && (
                <div className="private-info">
                  {user.email && <p>Email: {user.email}</p>}
                  {user.phoneNumber && <p>Phone: {user.phoneNumber}</p>}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="posts-card">
  <div className="posts-header">
    <h2>Posts</h2>
    <span className="posts-count">{posts.length}</span>
  </div>

  {posts.length === 0 ? (
    <div className="empty-posts">No posts yet</div>
  ) : (
    <div className="posts-list">
      {posts.map((post) => {
        const authorName =
          user?.username ||
          (user?.email ? user.email.split('@')[0] : 'User');

        const authorLetter = authorName.charAt(0).toUpperCase();

        return (
          <article key={post.id} className="post-card">
            <div className="post-card-header">
              <div className="post-author">
                <div className="post-author-avatar">
                  {user?.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
                      alt={authorName}
                      className="post-author-avatar-img"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <span>{authorLetter}</span>
                  )}
                </div>

                <div className="post-author-info">
                  <h3>{authorName}</h3>
                  <p>
                    {user?.username ? `@${user.username}` : '@user'} · Post #{post.id}
                  </p>
                </div>
              </div>
            </div>

            <div className="post-card-body">
              <p className="post-content">
                {post.content || 'No content'}
              </p>

              {post.mediaUrl && (
                <div className="post-media-box">
                  <a
                    href={post.mediaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="post-link-btn"
                  >
                    Open media
                  </a>
                </div>
              )}
            </div>

            <div className="post-card-footer">
              <span>Community Post</span>
            </div>
          </article>
        );
      })}
    </div>
  )}
</section>
      </main>

      {isEditOpen && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>Edit Profile</h3>
                <p>Update your profile information</p>
              </div>

              <button className="icon-btn" onClick={closeEditModal} type="button">
                <X size={18} />
              </button>
            </div>

            <form className="edit-form" onSubmit={handleSave}>
              <label>
                Username
                <div className="input-wrap">
                  <User size={16} />
                  <input
                    name="userName"
                    value={form.userName}
                    onChange={handleChange}
                    placeholder="Enter username"
                  />
                </div>
              </label>

              <label>
                Phone Number
                <div className="input-wrap">
                  <User size={16} />
                  <input
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    placeholder="0791234567"
                  />
                </div>
              </label>

              <label>
                Profile Image
                <div className="input-wrap" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'profileImageUrl')}
                    style={{ flex: 1 }}
                  />
                  {form.profileImageUrl && (
                    <div 
                      style={{ 
                        width: '32px', height: '32px', borderRadius: '50%', 
                        backgroundImage: `url(${form.profileImageUrl})`, 
                        backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid #3f3f46' 
                      }} 
                    />
                  )}
                </div>
              </label>

              <label>
                Cover Image
                <div className="input-wrap" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'coverImageUrl')}
                    style={{ flex: 1 }}
                  />
                  {form.coverImageUrl && (
                    <div 
                      style={{ 
                        width: '40px', height: '24px', borderRadius: '4px', 
                        backgroundImage: `url(${form.coverImageUrl})`, 
                        backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid #3f3f46' 
                      }} 
                    />
                  )}
                </div>
              </label>

              <label>
                Bio
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Write something about yourself"
                />
              </label>

              <label>
                Location
                <div className="input-wrap">
                  <MapPin size={16} />
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Amman, Jordan"
                  />
                </div>
              </label>

              <label>
                Birth Date
                <div className="input-wrap">
                  <Calendar size={16} />
                  <input
                    type="date"
                    name="birthDate"
                    value={form.birthDate || ''}
                    onChange={handleChange}
                  />
                </div>
              </label>

              <label>
                Website
                <div className="input-wrap">
                  <Globe size={16} />
                  <input
                    name="website"
                    value={form.website}
                    onChange={handleChange}
                    placeholder="https://your-site.com"
                  />
                </div>
              </label>

              {editError && <div className="message error">{editError}</div>}
              {editSuccess && <div className="message success">{editSuccess}</div>}

              <div className="modal-actions">
                <button
                  type="button"
                  className="ghost-btn"
                  onClick={closeEditModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button type="submit" className="primary-btn" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 size={16} className="spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}