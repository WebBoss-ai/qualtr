import { useState, useEffect } from "react";
import axios from "axios";
import { MARKETER_API_END_POINT } from "@/utils/constant";

const PostLikesManager = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch all posts
    axios.get(`${MARKETER_API_END_POINT}/posts`)
      .then(response => {
        setPosts(response.data.posts); // Assuming the posts are returned under the 'posts' key
      })
      .catch(error => console.error("Error fetching posts:", error));
  }, []);

  const updateFakeLikes = (postId, fakeLikes) => {
    // Update fake likes for a specific post
    axios.post(`${MARKETER_API_END_POINT}/posts/${postId}/fake-likes`, { fakeLikes })
      .then(response => {
        const updatedPosts = posts.map(post =>
          post._id === postId ? { ...post, fakeLikes: response.data.fakeLikes } : post
        );
        setPosts(updatedPosts);
        alert("Fake likes updated!");
      })
      .catch(error => console.error("Error updating fake likes:", error));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Posts Likes</h2>
      {posts.map(post => (
        <div key={post._id} className="p-4 border rounded shadow-sm mb-4">
          <h3 className="text-lg font-bold">Post ID: {post._id}</h3>
          <p>Real Likes: {post.likes?.length || 0}</p>
          <p>Total Likes (Real + Fake): {post.likes?.length + (post.fakeLikes || 0)}</p>
          
          <input
            type="number"
            value={post.fakeLikes || 0}
            onChange={(e) => {
              const updatedPosts = posts.map(p =>
                p._id === post._id ? { ...p, fakeLikes: parseInt(e.target.value) || 0 } : p
              );
              setPosts(updatedPosts);
            }}
            className="border p-1 rounded mb-2"
          />
          
          <button
            onClick={() => updateFakeLikes(post._id, post.fakeLikes)}
            className="p-2 bg-blue-500 text-white rounded"
          >
            Update Fake Likes
          </button>
        </div>
      ))}
    </div>
  );
};

export default PostLikesManager;