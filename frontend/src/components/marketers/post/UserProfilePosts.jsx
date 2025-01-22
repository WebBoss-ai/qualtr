import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MARKETER_API_END_POINT } from '@/utils/constant';
import { Clock, ThumbsUp, MessageCircle, Eye, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import { useParams } from 'react-router-dom';

const UserProfilePosts = ({ id }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`${MARKETER_API_END_POINT}/posts/profile/user/${id}`);
                const { success, posts, message } = response.data;

                if (success) {
                    setPosts(posts);
                    setMessage('');
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

        if (id) {
            fetchPosts();
        }
    }, [id]);

    const PostTimestamp = ({ createdAt }) => {
        const formattedTime = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
        return (
            <div className="flex items-center text-gray-400 text-xs">
                <Clock className="w-3 h-3 mr-1" />
                <span>{formattedTime}</span>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    const displayedPosts = posts.slice(0, 5); // Limit to the first 5 posts

    return (
        <div className="max-w-6xl mx-auto py-8">
            {/* CSS to hide scrollbar */}
            <style>
                {`
                    .scrollbar-hide::-webkit-scrollbar {
                        display: none;
                    }

                    .scrollbar-hide {
                        -ms-overflow-style: none;  /* for Internet Explorer 10+ */
                        scrollbar-width: none;      /* for Firefox */
                    }
                `}
            </style>

            {displayedPosts.length > 0 ? (
                <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-6">Recent Posts</h3>
                    <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
                        {displayedPosts.map((post) => (
                            <div
                                key={post._id}
                                className="flex-none w-80 border border-gray-200 bg-white rounded-lg p-6 shadow-sm"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-sm text-gray-900 font-medium">
                                            {post.author?.profile?.fullname || 'Unknown Author'}
                                        </p>
                                    </div>
                                    <PostTimestamp createdAt={post.createdAt} />
                                </div>
                                {post.text && (
                                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                                        {parse(DOMPurify.sanitize(post.text))}
                                    </p>
                                )}
                                <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                                    <div className="flex space-x-4">
                                        <div className="flex items-center">
                                            <ThumbsUp className="w-4 h-4 mr-1" />
                                            <span>{post.likes?.length || 0}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <MessageCircle className="w-4 h-4 mr-1" />
                                            <span>{post.comments?.length || 0}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Eye className="w-4 h-4 mr-1" />
                                            <span>{post.impressions || 0}</span>
                                        </div>
                                    </div>
                                    <button
                                        className="text-gray-500 hover:underline"
                                        onClick={() => navigate(`/post/${post._id}`)}
                                    >
                                        View Post
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center">
                        <button
                            onClick={() => navigate(`/all-posts/${id}`)}
                            className="w-full py-2 border-t border-b bg-white text-gray-1000 hover:bg-gray-200 flex justify-center items-center space-x-2 transition-all duration-300"
                        >
                            <span>View All Posts</span>
                            <ChevronRight className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{message}</h2>
                    <p className="text-gray-600 mb-6">Click below to start creating your first post!</p>
                    <button
                        onClick={() => navigate('/posts')}
                        className="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors duration-300"
                    >
                        Start Writing
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserProfilePosts;
