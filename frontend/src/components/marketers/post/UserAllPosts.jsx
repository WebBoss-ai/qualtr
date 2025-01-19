import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MARKETER_API_END_POINT } from "@/utils/constant";

const UserAllPosts = ({ authorId }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${MARKETER_API_END_POINT}/all-posts/${authorId}`);
        setPosts(response.data.posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [authorId]);

  if (loading) {
    return <p>Loading posts...</p>;
  }

  return (
    <div>
      <h2>Posts by Author</h2>
      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post._id}>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              {post.author?.profile?.profilePhoto && (
                <img
                  src={post.author.profile.profilePhoto}
                  alt={`${post.author.name}'s profile`}
                  style={{ width: '50px', borderRadius: '50%' }}
                />
              )}
              {post.media?.photos?.length > 0 && (
                <div>
                  {post.media.photos.map((photo, index) => (
                    <img key={index} src={photo.url} alt={`Post photo ${index + 1}`} style={{ width: '100px' }} />
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserAllPosts;
