import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MARKETER_API_END_POINT } from "@/utils/constant";

const AdminToggle = () => {
  const [posts, setPosts] = useState([]);

  // Fetch all posts
  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${MARKETER_API_END_POINT}/posts`); // Replace with your API endpoint
      console.log('Posts fetched successfully:', response.data);
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      setPosts([]);
    }
  };

  // Toggle trending status for a post
  const handleToggle = async (postId, currentTrendingStatus) => {
    try {
      const { data } = await axios.post(`${MARKETER_API_END_POINT}/posts/toggle-trending`, {
        postId,
        trending: !currentTrendingStatus,
      });
      if (data.success) {
        alert(`Post ${data.post.trending ? 'marked as Trending' : 'removed from Trending'}`);
        fetchPosts(); // Refresh the posts
      }
    } catch (error) {
      console.error('Error toggling post trending status:', error);
      alert('Failed to update post status.');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      <h2>Admin: Toggle Trending Status</h2>
      {posts.length > 0 ? (
        <table border="1" cellPadding="10" style={{ width: '100%', textAlign: 'left' }}>
          <thead>
            <tr>
              <th>Post ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Trending</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post._id}>
                <td>{post._id}</td>
                <td>{post.title}</td>
                <td>{post.author?.profile?.fullname || 'N/A'}</td>
                <td>{post.trending ? 'Yes' : 'No'}</td>
                <td>
                  <button onClick={() => handleToggle(post._id, post.trending)}>
                    {post.trending ? 'Remove from Trending' : 'Mark as Trending'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
};

export default AdminToggle;
