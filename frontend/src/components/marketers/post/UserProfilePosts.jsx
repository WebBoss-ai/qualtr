import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MARKETER_API_END_POINT } from '@/utils/constant';

const UserProfilePosts = () => {
  const { userId } = useParams(); // Get userId from route params
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${MARKETER_API_END_POINT}/posts/profile/user/${userId}`);
        const { success, posts, message } = response.data;

        if (success) {
          setPosts(posts);
          setMessage(message);
        } else {
          setMessage('Failed to load posts.');
        }
      } catch (error) {
        console.error('Error fetching user posts:', error);
        setMessage('An error occurred while fetching posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId]);

  const handleCreatePost = () => {
    navigate('/posts');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {posts.length > 0 ? (
        <div>
          <h2>User Posts</h2>
          <ul>
            {posts.map((post) => (
              <li key={post._id}>
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <small>By: {post.author.name}</small>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h2>{message}</h2>
          <p>Click below to start creating your first post!</p>
          <button onClick={handleCreatePost}>Start Writing</button>
        </div>
      )}
    </div>
  );
};

export default UserProfilePosts;