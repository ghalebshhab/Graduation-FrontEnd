import { api } from "./api";

// GET /api/posts/{postId}/comments
export const getPostComments = async (postId) => {
  const response = await api.get(`/api/posts/${postId}/comments`);
  return response.data;
};

// GET /api/posts/{postId}/comments/count
export const getPostCommentsCount = async (postId) => {
  const response = await api.get(`/api/posts/${postId}/comments/count`);
  return response.data;
};

// GET /api/posts/comments/{commentId}
export const getCommentById = async (commentId) => {
  const response = await api.get(`/api/posts/comments/${commentId}`);
  return response.data;
};

// POST /api/posts/{postId}/comments
export const createComment = async (postId, content) => {
  const response = await api.post(`/api/posts/${postId}/comments`, {
    content,
  });
  return response.data;
};

// PUT /api/posts/comments/{commentId}
export const updateComment = async (commentId, content) => {
  const response = await api.put(`/api/posts/comments/${commentId}`, {
    content,
  });
  return response.data;
};

// DELETE /api/posts/comments/{commentId}
export const deleteComment = async (commentId) => {
  const response = await api.delete(`/api/posts/comments/${commentId}`);
  return response.data;
};
