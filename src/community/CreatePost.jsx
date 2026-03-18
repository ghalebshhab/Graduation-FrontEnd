import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Image, MapPin, User, Hash, Globe, ChevronDown } from "lucide-react";
import "./CreatePost.css";
import { api } from "../services/api"; // adjust path if needed

const CreatePost = () => {
  const navigate = useNavigate();

  // ✅ Temporary for testing: you can hardcode authorId
  const [authorId, setAuthorId] = useState(1); // <-- change to an existing user id in DB
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [type, setType] = useState("COMMUNITY");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleClose = () => navigate(-1);

  const handleSubmit = async () => {
    setErrorMsg("");

    if (!authorId || Number.isNaN(Number(authorId))) {
      setErrorMsg("authorId مطلوب (لازم رقم صحيح).");
      return;
    }

    if (!content.trim()) {
      setErrorMsg("الرجاء كتابة محتوى المنشور قبل النشر.");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        authorId: Number(authorId),
        content: content.trim(),
        type: type || null,
        mediaUrl: mediaUrl.trim() ? mediaUrl.trim() : null,
      };

      await api.post("/api/posts", payload);

      navigate(-1); // success
    } catch (err) {
      setErrorMsg(err.message || "حدث خطأ أثناء نشر المنشور.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="web-modal-backdrop">
      <div className="create-post-web-card" dir="rtl">
        {/* Header */}
        <div className="post-header-web">
          <button className="close-circle-btn" onClick={handleClose} disabled={isSubmitting}>
            <X size={20} />
          </button>

          <h2 className="modal-title-web">إنشاء منشور جديد</h2>

          <button
            className="submit-post-btn-web"
            onClick={handleSubmit}
            disabled={isSubmitting || !content.trim()}
          >
            {isSubmitting ? "جاري النشر..." : "نشر"}
          </button>
        </div>

        {/* Small config row for testing (author/type/media) */}
        <div style={{ padding: "10px 16px", display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input
            type="number"
            value={authorId}
            onChange={(e) => setAuthorId(e.target.value)}
            placeholder="Author ID"
            disabled={isSubmitting}
            style={{ padding: 8, borderRadius: 8, border: "1px solid #ddd", minWidth: 120 }}
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            disabled={isSubmitting}
            style={{ padding: 8, borderRadius: 8, border: "1px solid #ddd", minWidth: 150 }}
          >
            <option value="COMMUNITY">COMMUNITY</option>
            <option value="EVENT">EVENT</option>
            <option value="OFFER">OFFER</option>
          </select>

          <input
            type="text"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            placeholder="Media URL (optional)"
            disabled={isSubmitting}
            style={{ padding: 8, borderRadius: 8, border: "1px solid #ddd", flex: 1, minWidth: 220 }}
          />
        </div>

        {/* Content Area */}
        <div className="post-body-web">
          <div className="user-profile-side">
            <div className="web-avatar-small" />
          </div>

          <div className="post-input-side">
            <div className="post-meta-web">
              <span className="user-name-web">غالب شهاب</span>
              <button className="audience-selector" type="button">
                <Globe size={14} />
                <span>عام</span>
                <ChevronDown size={14} />
              </button>
            </div>

            <textarea
              placeholder="ماذا يدور في ذهنك عن الأردن؟"
              className="post-textarea-web"
              autoFocus
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isSubmitting}
            />

            {errorMsg && (
              <div style={{ marginTop: 10, color: "crimson", fontSize: 14 }}>
                {errorMsg}
              </div>
            )}
          </div>
        </div>

        {/* Media Preview Area (Optional Placeholder) */}
        <div className="media-placeholder-web">
          <p>اسحب الصور أو الفيديو هنا</p>
        </div>

        {/* Toolbar */}
        <div className="post-footer-web">
          <p className="add-to-post-label">إضافة إلى منشورك</p>
          <div className="post-actions-web">
            <button className="action-tool-btn tooltip" data-label="صورة/فيديو" type="button">
              <Image size={22} className="text-green" />
            </button>
            <button className="action-tool-btn tooltip" data-label="موقع" type="button">
              <MapPin size={22} className="text-red" />
            </button>
            <button className="action-tool-btn tooltip" data-label="إشارة لصديق" type="button">
              <User size={22} className="text-blue" />
            </button>
            <button className="action-tool-btn tooltip" data-label="هاشتاق" type="button">
              <Hash size={22} className="text-orange" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
