import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MARKETER_API_END_POINT } from "@/utils/constant";

const TrendingPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchTrendingPosts = async () => {
      try {
        const { data } = await axios.get(`${MARKETER_API_END_POINT}/posts/trending`);
        if (data.success) {
          setPosts(data.posts);
        }
      } catch (error) {
        console.error('Error fetching trending posts:', error);
      }
    };

    fetchTrendingPosts();
  }, []);

  return (
    <div>
      <h2>Trending Posts</h2>
      <div>
        {posts.map((post) => (
          <div key={post._id}>
            <h3>{post.text}</h3>
            <p>
              <a href={post.profileLink}>{post.author?.profile?.fullname}</a> {/* Profile link */}
            </p>
            <p>{post.author?.profile?.agencyName}</p>
            <p>Posted: {post.timeAgo}</p> {/* Time ago */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingPosts;
