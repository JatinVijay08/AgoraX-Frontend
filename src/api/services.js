import api from "./axios";

export const authService = {
  register: (registerRequest) => api.post("/auth/register", registerRequest),
  login: (loginRequest) => api.post("/auth/login", loginRequest),
  googleLogin: (idToken) => api.post("/auth/google", { idToken }),
};

export const postService = {
  getAllPosts: (sort = "new", limit = 10, cursor = null, page = 0) => {
    const params = { sort, limit };
    if (sort === "new" && cursor) params.cursor = cursor;
    else if (sort !== "new") params.page = page;

    return api.get("/posts", { params }).then((res) => {
      const data = res.data;
      if (Array.isArray(data)) {
        return { posts: data, nextCursor: null, hasMore: false };
      } else if (data.content) {
        return { posts: data.content, nextCursor: null, hasMore: !data.last };
      } else {
        return {
          posts: data.posts || [],
          nextCursor: data.nextCursor || null,
          hasMore: data.hasMore || false,
        };
      }
    });
  },
  getPostById: (id) => api.get(`/posts/${id}`).then((res) => res.data),
  createPost: (title, content, mediaFile) => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (mediaFile) {
      formData.append("media", mediaFile);
    }
    return api
      .post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data);
  },
  deletePost: (id) => api.delete(`/posts/${id}`),
  vote: (postId, voteType) =>
    api.post(`/posts/${postId}/votes`, { voteType }).then((res) => res.data),
};

export const commentService = {
  getCommentsByPostId: (postId, page = 0, size = 10) =>
    api
      .get(`/comments/post/${postId}?page=${page}&size=${size}`)
      .then((res) => res.data),
  addComment: (postId, content, parentId = null) =>
    api
      .post(`/comments/post/${postId}`, { content, parentId })
      .then((res) => res.data),
  deleteComment: (commentId) => api.delete(`/comments/${commentId}`),
  voteOnComment: (commentId, voteType) =>
    api
      .post(`/comments/${commentId}/votes`, { voteType })
      .then((res) => res.data),
};

export const userService = {
  getCurrentUser: () => api.get("/users").then((res) => res.data),
  getUserPosts: (sort = "new") =>
    api.get("/users/posts", { params: { sort } }).then((res) => res.data),
  deleteUserPost: (id) => api.delete(`/users/posts/${id}`),
  updateUsername: (username) =>
    api.patch("/users/username", { username }).then((res) => res.data),
  getUserProfile: (username) =>
    api.get("/users/profile/" + username).then((res) => res.data),
  getUserProfilePosts: (username, sort = "new") =>
    api
      .get("/users/profile/" + username + "/posts", { params: { sort } })
      .then((res) => res.data),
};

export const notificationService = {
  getNotifications: (limit, cursor) =>
    api
      .get("/notifications", { params: { limit, cursor } })
      .then((res) => res.data),
  markAllAsRead: () => api.patch("/notifications/read-all"),
  getUnreadNotificationCount: () =>
    api.get("/notifications/unread-count").then((res) => res.data),
};
