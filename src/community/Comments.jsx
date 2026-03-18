import React, { useEffect, useState } from "react";
import {
  getPostComments,
  createComment,
  updateComment,
  deleteComment,
} from "../services/commentsService";

const formatTime = (instantString) => {
  if (!instantString) return "";
  const d = new Date(instantString);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function CommentsSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [errorComments, setErrorComments] = useState("");

  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  const currentUserId = localStorage.getItem("userId");

  const extractErrorMessage = (error) => {
    const data = error?.response?.data;

    if (typeof data === "string" && data.trim() !== "") {
      return data;
    }

    if (data?.message) return data.message;
    if (data?.error) return data.error;

    if (error?.response?.status === 401) {
      return "You must be logged in";
    }

    if (error?.response?.status === 403) {
      return "Access denied";
    }

    if (error?.response?.status === 404) {
      return "Comment or post was not found";
    }

    if (error?.response?.status === 400) {
      return "Invalid request data";
    }

    return error?.message || "Something went wrong";
  };

  const loadComments = async () => {
    setLoadingComments(true);
    setErrorComments("");

    try {
      const data = await getPostComments(postId);
      setComments(Array.isArray(data) ? data : []);
    } catch (error) {
      setErrorComments(extractErrorMessage(error));
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    if (postId) {
      loadComments();
    }
  }, [postId]);

  const handleCreateComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) {
      setErrorComments("Comment content is required");
      return;
    }

    setSubmitting(true);
    setErrorComments("");

    try {
      const created = await createComment(postId, newComment.trim());
      setComments((prev) => [created, ...prev]);
      setNewComment("");
    } catch (error) {
      setErrorComments(extractErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (comment) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  };

  const cancelEdit = () => {
    setEditingCommentId(null);
    setEditingContent("");
  };

  const handleUpdateComment = async (commentId) => {
    if (!editingContent.trim()) {
      setErrorComments("Comment content is required");
      return;
    }

    try {
      const updated = await updateComment(commentId, editingContent.trim());

      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId ? updated : comment
        )
      );

      setEditingCommentId(null);
      setEditingContent("");
    } catch (error) {
      setErrorComments(extractErrorMessage(error));
    }
  };

  const handleDeleteComment = async (commentId) => {
    const confirmed = window.confirm("Are you sure you want to delete this comment?");
    if (!confirmed) return;

    try {
      await deleteComment(commentId);

      setComments((prev) =>
        prev.filter((comment) => comment.id !== commentId)
      );
    } catch (error) {
      setErrorComments(extractErrorMessage(error));
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3 style={{ marginBottom: "12px" }}>Comments</h3>

      {errorComments && (
        <div
          style={{
            background: "#ffe8e8",
            color: "#b42318",
            border: "1px solid #f5b7b1",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "12px",
          }}
        >
          {errorComments}
        </div>
      )}

      <form onSubmit={handleCreateComment} style={{ marginBottom: "20px" }}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          rows={3}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            resize: "vertical",
            marginBottom: "10px",
            boxSizing: "border-box",
          }}
        />

        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: "10px 16px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
          }}
        >
          {submitting ? "Posting..." : "Add Comment"}
        </button>
      </form>

      {loadingComments && <p>Loading comments...</p>}

      {!loadingComments && comments.length === 0 && (
        <p>No comments yet.</p>
      )}

      {!loadingComments &&
        comments.map((comment) => {
          const isOwner =
            currentUserId &&
            String(comment.userId) === String(currentUserId);

          return (
            <div
              key={comment.id}
              style={{
                border: "1px solid #eee",
                borderRadius: "10px",
                padding: "12px",
                marginBottom: "12px",
                background: "#fff",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  gap: "10px",
                }}
              >
                <div>
                  <strong>{comment.username || `User #${comment.userId}`}</strong>
                  <div style={{ fontSize: "12px", opacity: 0.7, marginTop: "4px" }}>
                    {formatTime(comment.createdAt)}
                  </div>
                </div>

                {isOwner && editingCommentId !== comment.id && (
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      type="button"
                      onClick={() => startEdit(comment)}
                      style={{
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteComment(comment.id)}
                      style={{
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        color: "red",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              {editingCommentId === comment.id ? (
                <div style={{ marginTop: "10px" }}>
                  <textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                      resize: "vertical",
                      boxSizing: "border-box",
                      marginBottom: "10px",
                    }}
                  />

                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      type="button"
                      onClick={() => handleUpdateComment(comment.id)}
                      style={{
                        padding: "8px 14px",
                        borderRadius: "8px",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Save
                    </button>

                    <button
                      type="button"
                      onClick={cancelEdit}
                      style={{
                        padding: "8px 14px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        background: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p style={{ marginTop: "10px", marginBottom: 0 }}>
                  {comment.content}
                </p>
              )}
            </div>
          );
        })}
    </div>
  );
}