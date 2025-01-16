import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MARKETER_API_END_POINT } from "@/utils/constant";
import RandomSuggestedProfiles from '../RandomSuggestedProfiles';
import { ThumbsUp, MessageCircle, Share2, Send, Calendar, MapPin, Briefcase, X, BarChart2, FileText, TrendingUpIcon as Trending, Palette, Smile, PenTool, Megaphone, ChevronRight } from 'lucide-react'
import { TrendingUp, Scale, DollarSign, Image, Users, Wrench, Lightbulb, Clock, Upload } from 'lucide-react';
import moment from 'moment';
import Footer from '@/components/shared/Footer';
import Navbar from '@/components/shared/Navbar';
import { formatDistanceToNow } from 'date-fns';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";


const PostPage = () => {
    const [posts, setPosts] = useState([]);
    const [visibleCommentPostId, setVisibleCommentPostId] = useState(null); // Track the post ID for the visible comments section
    const [isExpanded, setIsExpanded] = useState(false)
    const [postCategory, setPostCategory] = useState('');
    const [userProfilePhoto, setUserProfilePhoto] = useState('');
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

    const handleVote = async (postId, option) => {
        try {
            // Make the POST request using axios
            const response = await axios.post(`${MARKETER_API_END_POINT}/posts/vote`, {
                postId,
                option,
            });
    
            // Check if the response indicates success
            const data = response.data; // Axios automatically parses JSON responses
            if (data.success) {
                alert('Vote submitted successfully!');
            } else {
                alert(data.message || 'Unknown error occurred.');
            }
        } catch (error) {
            // Handle errors
            if (error.response) {
                // The request was made, and the server responded with a status code outside of the 2xx range
                console.error('Server Error:', error.response.data);
                alert(`Error: ${error.response.status} - ${error.response.data.message || 'Something went wrong'}`);
            } else if (error.request) {
                // The request was made, but no response was received
                console.error('No response received:', error.request);
                alert('No response from the server. Please try again later.');
            } else {
                // Something happened while setting up the request
                console.error('Error:', error.message);
                alert('An error occurred while submitting your vote.');
            }
        }
    };
        

    const PostTimestamp = ({ createdAt }) => {
        const formattedTime = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

        return (
            <div className="flex ml-10 items-center text-gray-500 text-xs whitespace-nowrap">
                <Clock className="w-4 h-4 mr-1" />
                <span>{formattedTime}</span>
            </div>
        );
    };
    const ExpandableText = ({ text, maxLength = 100 }) => {
        const [isExpanded, setIsExpanded] = useState(false);
        const contentRef = useRef(null);

        const toggleExpand = () => {
            setIsExpanded(!isExpanded);
        };

        return (
            <div>
                <div
                    ref={contentRef}
                    className={`overflow-hidden transition-all duration-300`}
                    style={{
                        maxHeight: isExpanded ? `${contentRef.current?.scrollHeight}px` : '40px',
                    }}
                >
                    <p className="text-gray-700 text-sm mb-4">
                        {text}
                    </p>
                </div>
                {text.length > maxLength && (
                    <button
                        onClick={toggleExpand}
                        className="text-blue-500 text-sm font-medium hover:underline focus:outline-none"
                    >
                        {isExpanded ? 'Read Less' : 'Read More'}
                    </button>
                )}
            </div>
        );
    };
    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files || []);
        setMedia((prev) => ({
            ...prev,
            images: [...prev.images, ...selectedFiles],
        }));
    };
    const toggleComments = (postId) => {
        setVisibleCommentPostId((prevId) => (prevId === postId ? null : postId));
    };

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
            window.location.reload();
            console.log('Post state updated successfully');
        } catch (error) {
            console.error('Error toggling like:', error);
            console.error('Error response:', error.response?.data || 'No error response from server');
            console.error('Error config:', error.config);
        }
    }; const categories = [
        { name: 'Trending', icon: TrendingUp, href: '/trending' },
        { name: 'Startup Essentials', icon: Briefcase, href: '/category/startup-essentials' },
        { name: 'Marketing & Branding', icon: Megaphone, href: '/category/marketing-branding' },
        { name: 'Legal & Compliance', icon: Scale, href: '/category/legal-compliance' },
        { name: 'Finance & Investment', icon: DollarSign, href: '/category/finance-investment' },
        { name: 'Sales & Customer Acquisition', icon: Users, href: '/category/sales-customer-acquisition' },
        { name: 'Technology & Tools', icon: Wrench, href: '/category/technology-tools' },
        { name: 'Inspirations', icon: Lightbulb, href: '/category/inspirations' },
        // { name: 'Brand Strategy & Identity', icon: Palette, href: '/category/brand-strategy-identity' },
        // { name: 'Memes & Marketing Fun', icon: Smile, href: '/category/memes-marketing-fun' },
        // { name: 'Content Creation & Design', icon: PenTool, href: '/category/content-creation-design' },
        // { name: 'Digital Marketing', icon: Megaphone, href: '/category/digital-marketing' },
    ]
    const categories2 = [
        { name: 'Startup Essentials', icon: Briefcase, href: '/category/startup-essentials' },
        { name: 'Marketing & Branding', icon: Megaphone, href: '/category/marketing-branding' },
        { name: 'Legal & Compliance', icon: Scale, href: '/category/legal-compliance' },
        { name: 'Finance & Investment', icon: DollarSign, href: '/category/finance-investment' },
        { name: 'Sales & Customer Acquisition', icon: Users, href: '/category/sales-customer-acquisition' },
        { name: 'Technology & Tools', icon: Wrench, href: '/category/technology-tools' },
        { name: 'Inspirations', icon: Lightbulb, href: '/category/inspirations' },
        // { name: 'Brand Strategy & Identity', icon: Palette, href: '/category/brand-strategy-identity' },
        // { name: 'Memes & Marketing Fun', icon: Smile, href: '/category/memes-marketing-fun' },
        // { name: 'Content Creation & Design', icon: PenTool, href: '/category/content-creation-design' },
        // { name: 'Digital Marketing', icon: Megaphone, href: '/category/digital-marketing' },
    ]
    const postTypes = [
        { value: "text", label: "Text Only", icon: FileText },
        { value: "media", label: "Media", icon: Image },
        { value: "event", label: "Event", icon: Calendar },
        { value: "occasion", label: "Occasion", icon: Calendar },
        { value: "jobOpening", label: "Job Opening", icon: Briefcase },
        { value: "poll", label: "Poll", icon: BarChart2 },
        { value: "document", label: "Document", icon: FileText },
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
            setUserProfilePhoto(response.data.userProfilePhoto);
            console.log('User Profile Photo:', response.data.userProfilePhoto);
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
        const inputClass = "w-full p-2 bg-white text-gray-800 placeholder-gray-400 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
        const labelClass = "block text-sm font-medium text-gray-700 mb-1"

        switch (postType) {
            case 'media':
                return (
                    <div className="space-y-4">
                        <label className="text-gray-700 font-medium">Images (Max 10):</label>
                        <div className="flex items-center justify-center w-full">
                            <label
                                htmlFor="dropzone-file"
                                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-10 h-10 mb-3 text-gray-400" />
                                    <p className="mb-2 text-sm text-gray-500">
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                                </div>
                                <input
                                    id="dropzone-file"
                                    type="file"
                                    className="hidden"
                                    name="images"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>
                        {/* Preview Section */}
                        <div className="flex flex-wrap gap-4 mt-4">
                            {media.images.map((image, index) => (
                                <div key={index} className="relative w-24 h-24">
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )
            case 'event':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className={labelClass}>Event Title:</label>
                            <input
                                type="text"
                                className={inputClass}
                                onChange={(e) => {
                                    setAdditionalData((prev) => ({
                                        ...prev,
                                        event: { ...prev.event, title: e.target.value },
                                    }))
                                }}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Description:</label>
                            <textarea
                                className={inputClass}
                                rows={3}
                                onChange={(e) => {
                                    setAdditionalData((prev) => ({
                                        ...prev,
                                        event: { ...prev.event, description: e.target.value },
                                    }))
                                }}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Date:</label>
                            <input
                                type="date"
                                className={inputClass}
                                onChange={(e) => {
                                    setAdditionalData((prev) => ({
                                        ...prev,
                                        event: { ...prev.event, date: e.target.value },
                                    }))
                                }}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Location:</label>
                            <input
                                type="text"
                                className={inputClass}
                                onChange={(e) => {
                                    setAdditionalData((prev) => ({
                                        ...prev,
                                        event: { ...prev.event, location: e.target.value },
                                    }))
                                }}
                            />
                        </div>
                    </div>
                )
            case 'occasion':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className={labelClass}>Occasion Title:</label>
                            <input
                                type="text"
                                className={inputClass}
                                onChange={(e) => {
                                    setAdditionalData((prev) => ({
                                        ...prev,
                                        occasion: { ...prev.occasion, title: e.target.value },
                                    }))
                                }}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Description:</label>
                            <textarea
                                className={inputClass}
                                rows={3}
                                onChange={(e) => {
                                    setAdditionalData((prev) => ({
                                        ...prev,
                                        occasion: { ...prev.occasion, description: e.target.value },
                                    }))
                                }}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Date:</label>
                            <input
                                type="date"
                                className={inputClass}
                                onChange={(e) => {
                                    setAdditionalData((prev) => ({
                                        ...prev,
                                        occasion: { ...prev.occasion, date: e.target.value },
                                    }))
                                }}
                            />
                        </div>
                    </div>
                )
            case 'jobOpening':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className={labelClass}>Job Title:</label>
                            <input
                                type="text"
                                className={inputClass}
                                onChange={(e) => {
                                    setAdditionalData((prev) => ({
                                        ...prev,
                                        jobOpening: { ...prev.jobOpening, title: e.target.value },
                                    }))
                                }}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Description:</label>
                            <textarea
                                className={inputClass}
                                rows={3}
                                onChange={(e) => {
                                    setAdditionalData((prev) => ({
                                        ...prev,
                                        jobOpening: { ...prev.jobOpening, description: e.target.value },
                                    }))
                                }}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Location:</label>
                            <input
                                type="text"
                                className={inputClass}
                                onChange={(e) => {
                                    setAdditionalData((prev) => ({
                                        ...prev,
                                        jobOpening: { ...prev.jobOpening, location: e.target.value },
                                    }))
                                }}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Salary Range:</label>
                            <input
                                type="text"
                                className={inputClass}
                                onChange={(e) => {
                                    setAdditionalData((prev) => ({
                                        ...prev,
                                        jobOpening: { ...prev.jobOpening, salaryRange: e.target.value },
                                    }))
                                }}
                            />
                        </div>
                    </div>
                )
            case 'poll':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className={labelClass}>Question:</label>
                            <input
                                type="text"
                                className={inputClass}
                                onChange={(e) => {
                                    setAdditionalData((prev) => ({
                                        ...prev,
                                        poll: { ...prev.poll, question: e.target.value },
                                    }))
                                }}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Options (Max 4):</label>
                            {[1, 2, 3, 4].map((num) => (
                                <input
                                    key={num}
                                    type="text"
                                    className={`${inputClass} mt-2`}
                                    placeholder={`Option ${num}`}
                                    onChange={(e) => {
                                        setAdditionalData((prev) => ({
                                            ...prev,
                                            poll: {
                                                ...prev.poll,
                                                options: [
                                                    ...(prev.poll?.options?.slice(0, num - 1) || []),
                                                    e.target.value,
                                                    ...(prev.poll?.options?.slice(num) || []),
                                                ],
                                            },
                                        }))
                                    }}
                                />
                            ))}
                        </div>
                        <div>
                            <label className={labelClass}>End Date:</label>
                            <input
                                type="date"
                                className={inputClass}
                                onChange={(e) => {
                                    setAdditionalData((prev) => ({
                                        ...prev,
                                        poll: { ...prev.poll, endDate: e.target.value },
                                    }))
                                }}
                            />
                        </div>
                    </div>
                )
            case 'document':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className={labelClass}>Document Name:</label>
                            <input
                                type="text"
                                className={inputClass}
                                onChange={(e) => {
                                    setAdditionalData((prev) => ({
                                        ...prev,
                                        document: { ...prev.document, name: e.target.value },
                                    }))
                                }}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Document URL:</label>
                            <input
                                type="text"
                                className={inputClass}
                                onChange={(e) => {
                                    setAdditionalData((prev) => ({
                                        ...prev,
                                        document: { ...prev.document, url: e.target.value },
                                    }))
                                }}
                            />
                        </div>
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div>
            <Navbar />
            <div>
                <div className="bg-gray-100 min-h-screen">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Left Sidebar */}
                            <div className="lg:col-span-3">
                                <div className="bg-white border border-[1px] rounded-lg overflow-hidden sticky top-8">
                                    <h2 className="text-lg font-semibold text-gray-900 p-4 border-b border-gray-200">Categories</h2>
                                    <nav className="flex flex-col">
                                        {categories.map((category, index) => (
                                            <a
                                                key={index}
                                                href={category.href}
                                                className="flex items-center px-4 py-6 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                                            >
                                                <category.icon className="h-5 w-5 mr-3 text-gray-400" />
                                                <span>{category.name}</span>
                                                <ChevronRight className="h-5 w-5 ml-auto text-gray-400" />
                                            </a>
                                        ))}
                                    </nav>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="lg:col-span-6">
                                <div className="bg-white mb-5 rounded-xl max-w-2xl mx-auto border border-gray-200">
                                    {!isExpanded ? (
                                        <button
                                            onClick={() => setIsExpanded(true)}
                                            className="w-full p-4 text-left text-gray-600 hover:text-gray-800 transition-colors duration-150 ease-in-out focus:outline-none flex items-center space-x-4"
                                        >
                                            <div className="user-profile">
                                                {userProfilePhoto && (
                                                    <img
                                                        src={userProfilePhoto}
                                                        alt="Logged-in User Profile"
                                                        className="w-8 h-8 rounded-full border border-gray-300"
                                                    />
                                                )}
                                            </div>
                                            <span>Create a new post...</span>
                                        </button>
                                    ) : (
                                        <div className="space-y-4 p-4">

                                            <div className="flex justify-between items-center">
                                                <h2 className="text-xl font-semibold text-gray-800">Create a New Post</h2>
                                                <button
                                                    onClick={() => setIsExpanded(false)}
                                                    className="text-gray-400 hover:text-gray-600 transition-colors duration-150 ease-in-out"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                {currentStep === 1 && (
                                                    <>
                                                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Select Post Category</h3>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {categories2.map((category) => (
                                                                <button
                                                                    key={category.name}
                                                                    onClick={() => {
                                                                        setPostCategory(category.name)
                                                                        setCurrentStep(2)
                                                                    }}
                                                                    className={`flex items-center justify-between p-2 rounded-md text-sm transition-colors duration-150 ease-in-out ${postCategory === category.name
                                                                        ? 'bg-gray-200 text-gray-800'
                                                                        : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                                                                        }`}
                                                                >
                                                                    <span className="flex items-center">
                                                                        <category.icon className="w-4 h-4 mr-2" />
                                                                        {category.name}
                                                                    </span>
                                                                    <ChevronRight className="w-4 h-4" />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </>
                                                )}
                                                {currentStep === 2 && (
                                                    <>
                                                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Select Post Type</h3>
                                                        <div className="grid grid-cols-3 gap-2">
                                                            {postTypes.map((type) => (
                                                                <button
                                                                    key={type.value}
                                                                    onClick={() => {
                                                                        setPostType(type.value)
                                                                        setCurrentStep(3)
                                                                    }}
                                                                    className={`flex flex-col items-center justify-center p-2 rounded-md text-xs transition-colors duration-150 ease-in-out ${postType === type.value
                                                                        ? 'bg-gray-200 text-gray-800'
                                                                        : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                                                                        }`}
                                                                >
                                                                    <type.icon className="w-6 h-6 mb-1" />
                                                                    {type.label}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </>
                                                )}
                                                {currentStep === 3 && (
                                                    <form onSubmit={handleSubmit} className="space-y-4">
                                                        <div>
                                                            <label htmlFor="post-text" className="block text-sm font-medium text-gray-700 mb-1">
                                                                Post Text
                                                            </label>
                                                            <textarea
                                                                id="post-text"
                                                                value={postText}
                                                                onChange={(e) => setPostText(e.target.value)}
                                                                placeholder="Write your post"
                                                                required
                                                                className="w-full p-2 bg-white text-gray-800 placeholder-gray-400 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                                                rows={3}
                                                            />
                                                        </div>
                                                        {renderPostTypeFields()}
                                                        <div className="flex justify-end">
                                                            <button
                                                                type="submit"
                                                                className="px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-md hover:bg-gray-700 transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500"
                                                            >
                                                                Create Post
                                                            </button>
                                                        </div>
                                                    </form>
                                                )}
                                            </div>
                                            {currentStep > 1 && (
                                                <button
                                                    onClick={() => setCurrentStep(currentStep - 1)}
                                                    className="text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors duration-150 ease-in-out"
                                                >
                                                    ← Back
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {posts.length > 0 ? (
                                    posts.map((post) => (
                                        <div key={post._id} className="bg-white border border-[1px] rounded-lg overflow-hidden mb-6">
                                            <div className="p-4">
                                                <div className="flex items-center justify-between mb-4">
                                                    {/* Author Profile */}
                                                    {post.author?.profile && (
                                                        <div className="flex items-center">
                                                            {post.author.profile.profilePhoto && (
                                                                <img
                                                                    src={post.author.profile.profilePhoto || "/placeholder.svg"}
                                                                    alt={post.author.profile.fullname}
                                                                    className="w-10 h-10 rounded-full mr-3"
                                                                />
                                                            )}
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900">
                                                                    {post.author.profile.fullname}
                                                                    {post.category && (
                                                                        <> | <span className="text-gray-700">{post.category}</span></>
                                                                    )}
                                                                </p>
                                                                <p className="text-xs text-gray-500">{post?.author?.profile?.agencyName}</p>
                                                            </div>

                                                        </div>
                                                    )}
                                                    <PostTimestamp createdAt={post.createdAt} />
                                                </div>
                                                {post.text && <ExpandableText text={post.text} maxLength={100} />}                                                {/* Media Section */}
                                                {post.media?.photos?.length > 0 && (
                                                    <div className="mb-4">
                                                        <Swiper
                                                            modules={[Navigation, Pagination]} // Add navigation and pagination modules
                                                            spaceBetween={10}
                                                            slidesPerView={1} // Show one slide at a time
                                                            navigation // Enable next/prev buttons
                                                            pagination={{ clickable: true }} // Enable pagination dots
                                                        >
                                                            {post.media.photos.map((photo, index) => (
                                                                <SwiperSlide key={index}>
                                                                    <img
                                                                        src={photo.url || "/placeholder.svg"}
                                                                        alt={`Photo ${index + 1}`}
                                                                        className="w-full h-auto object-contain rounded-md"
                                                                    />
                                                                </SwiperSlide>
                                                            ))}
                                                        </Swiper>
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
                                                {post.poll && post.poll.question && (
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
                                                {post.poll && post.poll.question && (
                                                    <div className="bg-gray-50 rounded-md p-3 mb-4">
                                                        <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                                                            Poll: {post.poll.question}
                                                        </h4>
                                                        {post.poll.options.map((option, index) => (
                                                            <button
                                                                key={index}
                                                                className="text-sm text-gray-600 bg-blue-50 px-4 py-2 rounded-md m-2 hover:bg-blue-100"
                                                                onClick={() => handleVote(post._id, option)}
                                                            >
                                                                {option}
                                                            </button>
                                                        ))}
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
                                                        onClick={() => toggleLike(post._id)} // Pass post._id to toggleLike
                                                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs transition-colors ${post.likes.isLiked ? 'bg-pink-100 text-pink-600' : 'hover:bg-gray-100 text-gray-700'
                                                            }`}
                                                    >
                                                        <ThumbsUp
                                                            size={14}
                                                            className={`transition-colors ${post.likes.isLiked ? 'text-pink-500 fill-current' : 'text-gray-500'
                                                                }`}
                                                        />
                                                        <span>{post.likes.isLiked ? 'Liked' : 'Like'}</span>
                                                        <span className="text-gray-500">({post.likes.length})</span>
                                                    </button>


                                                    {/* Comment Button */}
                                                    <button
                                                        onClick={() => toggleComments(post._id)} // Pass the post ID to toggle
                                                        className="flex items-center gap-1 px-3 py-1 rounded-full text-xs hover:bg-gray-100 text-gray-700"
                                                    >
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
                                            {visibleCommentPostId === post._id && ( // Only show if this post's ID matches the visibleCommentPostId
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
                                                                        <div
                                                                            key={reply._id}
                                                                            className="ml-4 mt-1 p-2 bg-gray-50 rounded-md"
                                                                        >
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
                                                                                    replyToComment(
                                                                                        reply.postId,
                                                                                        reply.commentId,
                                                                                        reply.text
                                                                                    )
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
                                            )}
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
            <Footer />
        </div >
    );
};

export default PostPage;
