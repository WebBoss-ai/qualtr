import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MARKETER_API_END_POINT } from "@/utils/constant";
import RandomSuggestedProfiles from '../RandomSuggestedProfiles';
import { ChevronRight, ThumbsUp, Calendar, MapPin, Briefcase, BarChart2, FileText } from 'lucide-react'
import { MessageCircle, Share2, Send, X, ChevronLeft } from 'lucide-react'
import moment from 'moment';
import Footer from '@/components/shared/Footer';
import Navbar from '@/components/shared/Navbar';

const PostPage = () => {
    const [posts, setPosts] = useState([]);
    const [post, setPost] = useState(null)
    const [postCategory, setPostCategory] = useState('');
    const [postType, setPostType] = useState('');
    const [postText, setPostText] = useState('');
    const [media, setMedia] = useState({ images: [], videos: [] });
    const [additionalData, setAdditionalData] = useState({});
    const [currentStep, setCurrentStep] = useState(1);
    const [likes, setLikes] = useState({ isLiked: false, length: 0 })
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')
    const [reply, setReply] = useState({ commentId: null, text: '' })
    const [userId, setUserId] = useState(null)
    const [showModal, setShowModal] = useState(false)


    const LoginModal = ({ isOpen, onClose }) => {
        if (!isOpen) return null

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
                <div className="relative bg-white rounded-lg w-full max-w-sm p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Sign in to continue</h2>
                        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
                            <X size={18} className="text-gray-500" />
                        </button>
                    </div>
                    <p className="text-sm text-gray-600">Please sign in to interact with posts and connect with other marketers.</p>
                    <div className="flex gap-3">
                        <a
                            href="/marketer/login"
                            className="flex-1 bg-gray-900 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition-colors text-center"
                        >
                            Sign in
                        </a>
                        <button
                            onClick={onClose}
                            className="flex-1 border border-gray-200 px-4 py-2 rounded-md text-sm hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    const toggleLike = async (postId) => {
        if (!userId) {
            console.log('User not logged in. Showing login modal...');
            return setShowModal(true); // Show login modal if user is not logged in
        }

        console.log('Attempting to toggle like for post ID:', postId);

        try {
            const response = await axios.post(`${MARKETER_API_END_POINT}/posts/${postId}/like`);

            console.log('API response received:', response.data);

            // Update the state for the specific post
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post._id === postId
                        ? {
                            ...post,
                            likes: {
                                isLiked: response.data.isLiked,
                                length: response.data.likesCount,
                            },
                        }
                        : post
                )
            );

            console.log('Post state updated successfully');
        } catch (error) {
            console.error('Error toggling like:', error);
            console.error('Error response:', error.response?.data || 'No error response from server');
            console.error('Error config:', error.config);
        }
    };

    const categories = [
        { name: 'Trending', href: '/trending' },
        { name: 'Brand Strategy & Identity', href: '/category/brand-strategy-identity' },
        { name: 'Memes & Marketing Fun', href: '/category/memes-marketing-fun' },
        { name: 'Content Creation & Design', href: '/category/content-creation-design' },
        { name: 'Digital Marketing', href: '/category/digital-marketing' },
    ]

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        const storedUserId = localStorage.getItem('userId');
        setUserId(storedUserId);

        try {
            // Fetch all posts
            const response = await axios.get(`${MARKETER_API_END_POINT}/posts`);
            console.log('Posts fetched successfully:', response.data);

            const posts = response.data.posts || [];

            // Fetch likes and comments for each post
            const updatedPosts = await Promise.all(
                posts.map(async (post) => {
                    try {
                        const postResponse = await axios.get(`${MARKETER_API_END_POINT}/post/${post._id}`);
                        const fetchedPost = postResponse.data.post;

                        return {
                            ...post,
                            likes: {
                                isLiked: fetchedPost.likes?.includes(storedUserId),
                                length: fetchedPost.likes?.length || 0,
                            },
                            comments: fetchedPost.comments || [],
                        };
                    } catch (error) {
                        console.error(`Failed to fetch details for post ${post._id}:`, error);
                        return post; // Return original post if fetching details fails
                    }
                })
            );

            setPosts(updatedPosts);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
            setPosts([]);
        }
    };

    const addComment = async (postId, commentText) => {
        if (!userId) return setShowModal(true);

        try {
            const response = await axios.post(`${MARKETER_API_END_POINT}/posts/${postId}/comment`, {
                text: commentText,
            });

            // Update the comments for the specific post
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post._id === postId
                        ? {
                            ...post,
                            comments: response.data.post.comments,
                        }
                        : post
                )
            );
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const replyToComment = async (postId, commentId, replyText) => {
        if (!userId) return setShowModal(true);

        try {
            const response = await axios.post(
                `${MARKETER_API_END_POINT}/posts/${postId}/comment/${commentId}/reply`,
                { text: replyText }
            );

            // Update the comments for the specific post
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post._id === postId
                        ? {
                            ...post,
                            comments: response.data.post.comments,
                        }
                        : post
                )
            );
        } catch (error) {
            console.error('Error replying to comment:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submission started...');

        const formData = new FormData();
        formData.append('category', postCategory);
        formData.append('text', postText);

        // Append media files (photos and videos)
        for (let file of media.images) {
            console.log('Appending photo:', file.name);
            formData.append('images', file);
        }
        for (let file of media.videos) {
            console.log('Appending video:', file.name);
            formData.append('videos', file);
        }

        // Append additional fields
        if (additionalData.event) {
            console.log('Appending event:', additionalData.event);
            formData.append('event[title]', additionalData.event.title || '');
            formData.append('event[description]', additionalData.event.description || '');
            formData.append('event[date]', additionalData.event.date || '');
            formData.append('event[location]', additionalData.event.location || '');
        }

        if (additionalData.occasion) {
            console.log('Appending occasion:', additionalData.occasion);
            formData.append('occasion[title]', additionalData.occasion.title || '');
            formData.append('occasion[description]', additionalData.occasion.description || '');
            formData.append('occasion[date]', additionalData.occasion.date || '');
        }

        if (additionalData.jobOpening) {
            console.log('Appending jobOpening:', additionalData.jobOpening);
            formData.append('jobOpening[title]', additionalData.jobOpening.title || '');
            formData.append('jobOpening[description]', additionalData.jobOpening.description || '');
            formData.append('jobOpening[location]', additionalData.jobOpening.location || '');
            formData.append('jobOpening[salaryRange]', additionalData.jobOpening.salaryRange || '');
        }

        if (additionalData.poll) {
            console.log('Appending poll:', additionalData.poll);
            formData.append('poll[question]', additionalData.poll.question || '');
            additionalData.poll.options.forEach((option, index) => {
                formData.append(`poll[options][${index}]`, option);
            });
            formData.append('poll[endDate]', additionalData.poll.endDate || '');
        }

        if (additionalData.document) {
            console.log('Appending document:', additionalData.document);
            formData.append('document[name]', additionalData.document.name || '');
            formData.append('document[url]', additionalData.document.url || '');
        }

        try {
            const response = await axios.post(`${MARKETER_API_END_POINT}/posts`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log('Post created successfully:', response.data);
            fetchPosts(); // Refresh posts after submission
        } catch (error) {
            console.error('Failed to create post:', error);
        }
    };

    const renderPostTypeFields = () => {
        switch (postType) {
            case 'media':
                return (
                    <>
                        <label>images (Max 10):</label>
                        <input
                            type="file"
                            name="images"
                            accept="image/*,video/*"
                            multiple
                            onChange={(e) => {
                                setMedia((prev) => ({
                                    ...prev,
                                    images: [...prev.images, ...e.target.files],
                                }));
                            }}
                        />

                        <label>Videos (Max 5):</label>
                        <input
                            type="file"
                            accept="video/*"
                            multiple
                            onChange={(e) => {
                                console.log('Videos selected:', e.target.files);
                                setMedia((prev) => ({
                                    ...prev,
                                    videos: [...prev.videos, ...e.target.files],
                                }));
                            }}
                        />
                    </>
                );
            case 'event':
                return (
                    <>
                        <label>Event Title:</label>
                        <input
                            type="text"
                            onChange={(e) => {
                                console.log('Event title:', e.target.value);
                                setAdditionalData((prev) => ({
                                    ...prev,
                                    event: { ...prev.event, title: e.target.value },
                                }));
                            }}
                        />
                        <label>Description:</label>
                        <textarea
                            onChange={(e) => {
                                console.log('Event description:', e.target.value);
                                setAdditionalData((prev) => ({
                                    ...prev,
                                    event: { ...prev.event, description: e.target.value },
                                }));
                            }}
                        />
                        <label>Date:</label>
                        <input
                            type="date"
                            onChange={(e) => {
                                console.log('Event date:', e.target.value);
                                setAdditionalData((prev) => ({
                                    ...prev,
                                    event: { ...prev.event, date: e.target.value },
                                }));
                            }}
                        />
                        <label>Location:</label>
                        <input
                            type="text"
                            onChange={(e) => {
                                console.log('Event location:', e.target.value);
                                setAdditionalData((prev) => ({
                                    ...prev,
                                    event: { ...prev.event, location: e.target.value },
                                }));
                            }}
                        />
                    </>
                );
            case 'occasion':
                return (
                    <>
                        <label>Occasion Title:</label>
                        <input
                            type="text"
                            onChange={(e) => {
                                console.log('Occasion title:', e.target.value);
                                setAdditionalData((prev) => ({
                                    ...prev,
                                    occasion: { ...prev.occasion, title: e.target.value },
                                }));
                            }}
                        />
                        <label>Description:</label>
                        <textarea
                            onChange={(e) => {
                                console.log('Occasion description:', e.target.value);
                                setAdditionalData((prev) => ({
                                    ...prev,
                                    occasion: { ...prev.occasion, description: e.target.value },
                                }));
                            }}
                        />
                        <label>Date:</label>
                        <input
                            type="date"
                            onChange={(e) => {
                                console.log('Occasion date:', e.target.value);
                                setAdditionalData((prev) => ({
                                    ...prev,
                                    occasion: { ...prev.occasion, date: e.target.value },
                                }));
                            }}
                        />
                    </>
                );
            case 'jobOpening':
                return (
                    <>
                        <label>Job Title:</label>
                        <input
                            type="text"
                            onChange={(e) => {
                                console.log('Job title:', e.target.value);
                                setAdditionalData((prev) => ({
                                    ...prev,
                                    jobOpening: { ...prev.jobOpening, title: e.target.value },
                                }));
                            }}
                        />
                        <label>Description:</label>
                        <textarea
                            onChange={(e) => {
                                console.log('Job description:', e.target.value);
                                setAdditionalData((prev) => ({
                                    ...prev,
                                    jobOpening: { ...prev.jobOpening, description: e.target.value },
                                }));
                            }}
                        />
                        <label>Location:</label>
                        <input
                            type="text"
                            onChange={(e) => {
                                console.log('Job location:', e.target.value);
                                setAdditionalData((prev) => ({
                                    ...prev,
                                    jobOpening: { ...prev.jobOpening, location: e.target.value },
                                }));
                            }}
                        />
                        <label>Salary Range:</label>
                        <input
                            type="text"
                            onChange={(e) => {
                                console.log('Salary range:', e.target.value);
                                setAdditionalData((prev) => ({
                                    ...prev,
                                    jobOpening: { ...prev.jobOpening, salaryRange: e.target.value },
                                }));
                            }}
                        />
                    </>
                );
            case 'poll':
                return (
                    <>
                        <label>Question:</label>
                        <input
                            type="text"
                            onChange={(e) => {
                                console.log('Poll question:', e.target.value);
                                setAdditionalData((prev) => ({
                                    ...prev,
                                    poll: { ...prev.poll, question: e.target.value },
                                }));
                            }}
                        />
                        <label>Options (Max 4):</label>
                        <input
                            type="text"
                            placeholder="Option 1"
                            onChange={(e) => {
                                console.log('Poll option added:', e.target.value);
                                setAdditionalData((prev) => ({
                                    ...prev,
                                    poll: {
                                        ...prev.poll,
                                        options: [...(prev.poll?.options || []), e.target.value],
                                    },
                                }));
                            }}
                        />
                        <label>End Date:</label>
                        <input
                            type="date"
                            onChange={(e) => {
                                console.log('Poll end date:', e.target.value);
                                setAdditionalData((prev) => ({
                                    ...prev,
                                    poll: { ...prev.poll, endDate: e.target.value },
                                }));
                            }}
                        />
                    </>
                );
            case 'document':
                return (
                    <>
                        <label>Document Name:</label>
                        <input
                            type="text"
                            onChange={(e) => {
                                console.log('Document name:', e.target.value);
                                setAdditionalData((prev) => ({
                                    ...prev,
                                    document: { ...prev.document, name: e.target.value },
                                }));
                            }}
                        />
                        <label>Document URL:</label>
                        <input
                            type="text"
                            onChange={(e) => {
                                console.log('Document URL:', e.target.value);
                                setAdditionalData((prev) => ({
                                    ...prev,
                                    document: { ...prev.document, url: e.target.value },
                                }));
                            }}
                        />
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div>
            <Navbar/>
            <div>
            {currentStep === 1 && (
                <>
                    <h2>Select Post Category</h2>
                    <select
                        value={postCategory}
                        onChange={(e) => {
                            console.log('Post category selected:', e.target.value);
                            setPostCategory(e.target.value);
                        }}
                        required
                    >
                        <option value="">Select Category</option>
                        <option value="Brand Strategy & Identity">Brand Strategy & Identity</option>
                        <option value="Memes & Marketing Fun">Memes & Marketing Fun</option>
                        <option value="Content Creation & Design">Content Creation & Design</option>
                        <option value="Digital Marketing">Digital Marketing</option>
                    </select>
                    <button onClick={() => setCurrentStep(2)}>Next</button>
                </>
            )}
            {currentStep === 2 && (
                <>
                    <h2>Select Post Type</h2>
                    <select
                        value={postType}
                        onChange={(e) => {
                            console.log('Post type selected:', e.target.value);
                            setPostType(e.target.value);
                        }}
                        required
                    >
                        <option value="">Select Type</option>
                        <option value="media">Media</option>
                        <option value="event">Event</option>
                        <option value="occasion">Occasion</option>
                        <option value="jobOpening">Job Opening</option>
                        <option value="poll">Poll</option>
                        <option value="document">Document</option>
                    </select>
                    <button onClick={() => setCurrentStep(3)}>Next</button>
                </>
            )}
            {currentStep === 3 && (
                <form onSubmit={handleSubmit}>
                    <h2>Create Post</h2>
                    <label>Post Text:</label>
                    <textarea
                        value={postText}
                        onChange={(e) => {
                            console.log('Post text:', e.target.value);
                            setPostText(e.target.value);
                        }}
                        placeholder="Write your post"
                        required
                    ></textarea>
                    {renderPostTypeFields()}
                    <button type="submit">Create Post</button>
                </form>
            )}
            <div className="bg-gray-100 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left Sidebar */}
                        <div className="hidden lg:block lg:col-span-3">
                            <div className="sticky top-10">
                                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                                    <h2 className="text-lg font-semibold text-gray-900 p-4 border-b border-gray-200">Categories</h2>
                                    <nav className="flex flex-col">
                                        {categories.map((category, index) => (
                                            <a
                                                key={index}
                                                href={category.href}
                                                className="flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                                            >
                                                {category.name}
                                                <ChevronRight className="h-5 w-5 text-gray-400" />
                                            </a>
                                        ))}
                                    </nav>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-6">
                            {posts.length > 0 ? (
                                posts.map((post) => (
                                    <div key={post._id} className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
                                        <div className="p-4">
                                            {post.category && (
                                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700 mb-2">
                                                    {post.category}
                                                </span>
                                            )}
                                            {post.text && <p className="text-gray-700 text-sm mb-4">{post.text}</p>}
                                            {post.author?.profile && (
                                                <div className="flex items-center mb-4">
                                                    {post.author.profile.profilePhoto && (
                                                        <img
                                                            src={post.author.profile.profilePhoto || "/placeholder.svg"}
                                                            alt={post.author.profile.fullname}
                                                            className="w-10 h-10 rounded-full mr-3"
                                                        />
                                                    )}
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{post.author.profile.fullname}</p>
                                                        <p className="text-xs text-gray-500">{post.author.profile.agencyName}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Media Section */}
                                            {post.media?.photos?.length > 0 && (
                                                <div className="mb-4">
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {post.media.photos.map((photo, index) => (
                                                            <img
                                                                key={index}
                                                                src={photo.url || "/placeholder.svg"}
                                                                alt={`Photo ${index + 1}`}
                                                                className="w-full h-40 object-cover rounded-md"
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {post.media?.videos?.length > 0 && (
                                                <div className="mb-4">
                                                    {post.media.videos.map((video, index) => (
                                                        <video key={index} controls className="w-full rounded-md">
                                                            <source src={video.url} type="video/mp4" />
                                                            Your browser does not support the video tag.
                                                        </video>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Event Section */}
                                            {post.event && (
                                                <div className="bg-gray-50 rounded-md p-3 mb-4">
                                                    <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                                                        <Calendar className="w-4 h-4 mr-1" /> Event
                                                    </h4>
                                                    <p className="text-sm font-medium text-gray-700">{post.event.title}</p>
                                                    {post.event.description && <p className="text-xs text-gray-600 mt-1">{post.event.description}</p>}
                                                    {post.event.date && (
                                                        <p className="text-xs text-gray-600 mt-1">
                                                            Date: {new Date(post.event.date).toLocaleDateString()}
                                                        </p>
                                                    )}
                                                    {post.event.location && (
                                                        <p className="text-xs text-gray-600 mt-1 flex items-center">
                                                            <MapPin className="w-3 h-3 mr-1" /> {post.event.location}
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            {/* Occasion Section */}
                                            {post.occasion && (
                                                <div className="bg-gray-50 rounded-md p-3 mb-4">
                                                    <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                                                        <Calendar className="w-4 h-4 mr-1" /> Occasion
                                                    </h4>
                                                    <p className="text-sm font-medium text-gray-700">{post.occasion.title}</p>
                                                    {post.occasion.description && (
                                                        <p className="text-xs text-gray-600 mt-1">{post.occasion.description}</p>
                                                    )}
                                                    {post.occasion.date && (
                                                        <p className="text-xs text-gray-600 mt-1">
                                                            Date: {new Date(post.occasion.date).toLocaleDateString()}
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            {/* Job Opening Section */}
                                            {post.jobOpening && (
                                                <div className="bg-gray-50 rounded-md p-3 mb-4">
                                                    <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                                                        <Briefcase className="w-4 h-4 mr-1" /> Job Opening
                                                    </h4>
                                                    <p className="text-sm font-medium text-gray-700">{post.jobOpening.position}</p>
                                                    {post.jobOpening.company && (
                                                        <p className="text-xs text-gray-600 mt-1">{post.jobOpening.company}</p>
                                                    )}
                                                    {post.jobOpening.location && (
                                                        <p className="text-xs text-gray-600 mt-1 flex items-center">
                                                            <MapPin className="w-3 h-3 mr-1" /> {post.jobOpening.location}
                                                        </p>
                                                    )}
                                                    {post.jobOpening.salary && (
                                                        <p className="text-xs text-gray-600 mt-1">Salary: {post.jobOpening.salary}</p>
                                                    )}
                                                </div>
                                            )}

                                            {/* Poll Section */}
                                            {post.poll && (
                                                <div className="bg-gray-50 rounded-md p-3 mb-4">
                                                    <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                                                        <BarChart2 className="w-4 h-4 mr-1" /> Poll
                                                    </h4>
                                                    <p className="text-sm font-medium text-gray-700">{post.poll.question}</p>
                                                    {post.poll.options && (
                                                        <ul className="mt-2 space-y-1">
                                                            {post.poll.options.map((option, index) => (
                                                                <li key={index} className="text-xs text-gray-600">
                                                                    {option}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            )}

                                            {/* Document Section */}
                                            {post.document && (
                                                <div className="bg-gray-50 rounded-md p-3 mb-4">
                                                    <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                                                        <FileText className="w-4 h-4 mr-1" /> Document
                                                    </h4>
                                                    <a
                                                        href={post.document.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-blue-600 hover:underline flex items-center"
                                                    >
                                                        <FileText className="w-4 h-4 mr-1" />
                                                        {post.document.title || 'View Document'}
                                                    </a>
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                                                {/* Like Button */}
                                                <button
                                                    onClick={toggleLike}
                                                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs transition-colors ${post.likes.isLiked ? 'bg-pink-100 text-pink-600' : 'hover:bg-gray-100 text-gray-700'
                                                        }`}
                                                >
                                                    <ThumbsUp
                                                        size={14}
                                                        className={`transition-colors ${post.likes.isLiked ? 'text-pink-500 fill-current' : 'text-gray-500'
                                                            }`}
                                                    />
                                                    <span>{likes.isLiked ? 'Liked' : 'Like'}</span>
                                                    <span className="text-gray-500">({post.likes.length})</span>
                                                </button>

                                                {/* Comment Button */}
                                                <button className="flex items-center gap-1 px-3 py-1 rounded-full text-xs hover:bg-gray-100 text-gray-700">
                                                    <MessageCircle size={14} />
                                                    <span>Comment</span>
                                                    <span className="text-gray-500">({post.comments.length})</span>
                                                </button>

                                                {/* Share Button */}
                                                <button className="flex items-center gap-1 px-3 py-1 rounded-full text-xs hover:bg-gray-100 text-gray-700">
                                                    <Share2 size={14} />
                                                    <span>Share</span>
                                                </button>
                                            </div>
                                        </div>
                                        {/* Comments section */}


                                        <div className="mt-4 bg-white rounded-lg border border-gray-200 p-4">
                                            <h3 className="text-sm font-semibold text-gray-900 mb-3">Comments</h3>
                                            <div className="space-y-3 max-h-80 overflow-y-auto">
                                                {post.comments.map((comment) => {
                                                    return (
                                                        <div key={comment._id} className="border-b border-gray-100 pb-2">
                                                            <p className="text-sm text-gray-800 mb-1">{comment.text}</p>
                                                            <p className="text-sm text-gray-800 mb-1">
                                                                {comment.user?.profile?.fullname || 'Anonymous User'}
                                                            </p>
                                                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                                                <button
                                                                    onClick={() =>
                                                                        setReply({
                                                                            commentId: comment._id,
                                                                            text: '',
                                                                            postId: post._id,
                                                                        })
                                                                    }
                                                                    className="hover:text-gray-700"
                                                                >
                                                                    Reply
                                                                </button>
                                                                <span>{moment(comment.createdAt).fromNow()}</span>
                                                            </div>

                                                            {/* Replies */}
                                                            {comment.replies.map((reply) => (
                                                                <div key={reply._id} className="ml-4 mt-1 p-2 bg-gray-50 rounded-md">
                                                                    <p className="text-xs text-gray-800">{reply.text}</p>
                                                                    <span className="text-xs text-gray-500">
                                                                        {moment(reply.createdAt).fromNow()}
                                                                    </span>
                                                                </div>
                                                            ))}

                                                            {/* Reply Input */}
                                                            {reply.commentId === comment._id && (
                                                                <div className="mt-2 flex gap-2">
                                                                    <input
                                                                        value={reply.text}
                                                                        onChange={(e) =>
                                                                            setReply({
                                                                                ...reply,
                                                                                text: e.target.value,
                                                                                postId: post._id,
                                                                            })
                                                                        }
                                                                        className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
                                                                        placeholder="Write a reply..."
                                                                    />
                                                                    <button
                                                                        onClick={() =>
                                                                            replyToComment(reply.postId, reply.commentId, reply.text)
                                                                        }
                                                                        className="px-2 py-1 text-xs bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
                                                                    >
                                                                        Reply
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Add Comment */}
                                            <div className="mt-3 flex gap-2">
                                                <input
                                                    value={newComment}
                                                    onChange={(e) => setNewComment(e.target.value)}
                                                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
                                                    placeholder="Add a comment..."
                                                />
                                                <button
                                                    onClick={() => addComment(post._id, newComment)} // Pass post._id for the current post
                                                    className="px-3 py-2 bg-gray-800 text-white text-sm rounded-md hover:bg-gray-700 transition-colors"
                                                >
                                                    <Send size={14} />
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-700 text-center py-8">No posts available</p>
                            )}
                        </div>

                        {/* Right Sidebar */}
                        <div className="hidden lg:block lg:col-span-3">
                            <div className="sticky top-10">
                                <RandomSuggestedProfiles />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <LoginModal isOpen={showModal} onClose={() => setShowModal(false)} />
        <Footer/>
        </div>
        
    );
};

export default PostPage;
