import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MARKETER_API_END_POINT } from '@/utils/constant';
import { formatDistanceToNow } from 'date-fns';
import { Clock, ThumbsUp, MessageCircle, Eye, ChevronRight } from 'lucide-react';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';

const UserProfilePosts = ({ id }) => {
    const [posts, setPosts] = useState([]);
    const [displayedPosts, setDisplayedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [page, setPage] = useState(0); // Tracks the current page
    const [hasMore, setHasMore] = useState(false); // Tracks if more posts are available
    const navigate = useNavigate();
    const postsPerPage = 8; // Number of posts to load per page

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`${MARKETER_API_END_POINT}/posts/profile/user/${id}`);
                const { success, posts, message } = response.data;

                if (success) {
                    setPosts(posts);
                    setDisplayedPosts(posts.slice(0, postsPerPage)); // Load the first 8 posts
                    setHasMore(posts.length > postsPerPage); // Check if there are more posts
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

    const loadMorePosts = () => {
        const nextPage = page + 1;
        const nextPosts = posts.slice(0, (nextPage + 1) * postsPerPage);
        setDisplayedPosts(nextPosts); // Update the displayed posts
        setPage(nextPage); // Increment the page
        setHasMore(posts.length > nextPosts.length); // Check if more posts are available
    };

    const handleCreatePost = () => {
        navigate('/posts');
    };

    const PostTimestamp = ({ createdAt }) => {
        const formattedTime = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

        return (
            <div className="flex items-center text-gray-400 text-xs">
                <Clock className="w-3 h-3 mr-1" />
                <span>{formattedTime}</span>
            </div>
        );
    };

    const ExpandableText = ({ text, maxLength = 100, className = '' }) => {
        const [isExpanded, setIsExpanded] = useState(false);

        const toggleExpand = () => {
            setIsExpanded(!isExpanded);
        };

        const isExpandable = text.length > maxLength;
        const displayedText = isExpanded ? text : text.slice(0, maxLength);

        const modifyLinks = (rawText) => {
            const urlRegex = /(\bhttps?:\/\/[^\s]+)(?=\s*(?!<\/p>))/g;
            let withLinks = rawText.replace(urlRegex, (url) => {
                return `<a href="${url}" target="_blank" class="text-blue-500 hover:underline">${url}</a>`;
            });
            const anchorRegex = /<a(.*?)href="(.*?)"(.*?)>/g;
            const enhancedLinks = withLinks.replace(anchorRegex, (match, p1, p2, p3) => {
                return `<a${p1}href="${p2}" target="_blank" class="text-blue-500 hover:underline"${p3}>`;
            });
            return DOMPurify.sanitize(enhancedLinks);
        };

        const modifiedText = modifyLinks(displayedText);

        return (
            <div>
                <p className={`${className} inline`}>
                    {parse(modifiedText)}
                    {!isExpanded && isExpandable && <span>...</span>}
                </p>
                {isExpandable && (
                    <button
                        onClick={toggleExpand}
                        className="text-gray-500 text-xs font-medium hover:underline focus:outline-none inline ml-1"
                    >
                        {isExpanded ? 'Read Less' : 'Read More'}
                    </button>
                )}
            </div>
        );
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto py-8">
            {displayedPosts.length > 0 ? (
                <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-6">User Posts</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {displayedPosts.map((post) => (
                            <div key={post._id} className="border-b border-gray-200 pb-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="text-sm text-gray-900">
                                            {post.author?.profile?.fullname || 'Unknown Author'}
                                        </p>
                                        {post.category && (
                                            <p className="text-xs text-gray-500">{post.category}</p>
                                        )}
                                    </div>
                                    <PostTimestamp createdAt={post.createdAt} />
                                </div>
                                {post.text && (
                                    <ExpandableText
                                        className="text-gray-700 text-sm mb-2"
                                        text={post.text}
                                        maxLength={30}
                                    />
                                )}
                                <div className="flex items-center justify-between mt-2">
                                    <div className="flex space-x-4">
                                        <div className="flex items-center text-gray-500 text-xs">
                                            <ThumbsUp className="w-3 h-3 mr-1" />
                                            <span>{post.likes?.length || 0}</span>
                                        </div>
                                        <div className="flex items-center text-gray-500 text-xs">
                                            <MessageCircle className="w-3 h-3 mr-1" />
                                            <span>{post.comments?.length || 0}</span>
                                        </div>
                                        <div className="flex items-center text-gray-500 text-xs">
                                            <Eye className="w-3 h-3 mr-1" />
                                            <span>{post.impressions || 0}</span>
                                        </div>
                                    </div>
                                    <button
                                        className="text-gray-500 text-xs font-medium hover:underline focus:outline-none flex items-center"
                                        onClick={() => navigate(`/post/${post._id}`)}
                                    >
                                        View Post
                                        <ChevronRight className="w-3 h-3 ml-1" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {hasMore && (
                        <div className="text-center">
                            <button
                                onClick={loadMorePosts}
                                className="px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded hover:bg-gray-700 transition-colors duration-300"
                            >
                                Load More
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{message}</h2>
                    <p className="text-gray-600 mb-6">Click below to start creating your first post!</p>
                    <button
                        onClick={handleCreatePost}
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