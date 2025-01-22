import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { MARKETER_API_END_POINT } from '@/utils/constant'
import RandomSuggestedProfiles from '../RandomSuggestedProfiles'
import { ThumbsUp, MessageCircle, Share2, Send, Calendar, MapPin, Briefcase, BarChart2, FileText, X, ChevronRight, ChevronLeft } from 'lucide-react'
import moment from 'moment';
import Navbar from '@/components/shared/Navbar'
import Footer2 from '@/components/shared/Footer2'
import parse from 'html-react-parser'; // Import html-react-parser
import DOMPurify from 'dompurify';

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
const ExpandableText = ({ text, maxLength = 100, className = '' }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const isExpandable = text.length > maxLength;
    const displayedText = isExpanded ? text : text.slice(0, maxLength);

    // Function to modify links and sanitize text
    const modifyLinks = (rawText) => {
        // Match URLs but ensure that they are not followed immediately by </p>
        const urlRegex = /(\bhttps?:\/\/[^\s]+)(?=\s*(?!<\/p>))/g;

        // Replace plain URLs with anchor tags
        let withLinks = rawText.replace(urlRegex, (url) => {
            return `<a href="${url}" target="_blank" class="text-blue-500 hover:underline">${url}</a>`;
        });

        // Update existing <a> tags to include target="_blank" and styling
        const anchorRegex = /<a(.*?)href="(.*?)"(.*?)>/g;
        const enhancedLinks = withLinks.replace(anchorRegex, (match, p1, p2, p3) => {
            return `<a${p1}href="${p2}" target="_blank" class="text-blue-500 hover:underline"${p3}>`;
        });

        // Sanitize the final text to avoid rendering malicious or invalid HTML
        return DOMPurify.sanitize(enhancedLinks);
    };



    const modifiedText = modifyLinks(displayedText); // Apply link modifications and sanitize

    return (
        <div>
            <p className={`${className} inline`}>
                {/* Use html-react-parser to render sanitized and modified HTML */}
                {parse(modifiedText)}
                {!isExpanded && isExpandable && <span>...</span>}
            </p>
            {isExpandable && (
                <button
                    onClick={toggleExpand}
                    className="text-blue-500 text-sm font-medium hover:underline focus:outline-none inline ml-1"
                >
                    {isExpanded ? 'Read Less' : 'Read More'}
                </button>
            )}
        </div>
    );
};

const ImageGallery = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [dimension, setDimension] = useState(0);
    const containerRef = useRef(null);

    useEffect(() => {
        // Dynamically calculate the square size based on the width of the container
        const updateDimension = () => {
            if (containerRef.current) {
                const width = containerRef.current.offsetWidth;
                setDimension(width); // Set the square's dimension to the width
            }
        };

        updateDimension();
        window.addEventListener("resize", updateDimension); // Recalculate on window resize
        return () => {
            window.removeEventListener("resize", updateDimension);
        };
    }, []);

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    return (
        <div
            ref={containerRef}
            style={{ height: `${dimension}px` }} // Dynamically set height to match width
            className="relative w-[90vw] max-w-[500px] bg-black rounded-lg flex items-center justify-center overflow-hidden"
        >
            <img
                src={images[currentIndex]?.url || "/placeholder.svg"}
                alt={`Image ${currentIndex + 1}`}
                className="object-contain w-full h-full"
            />
            {images.length > 1 && (
                <>
                    <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
                    >
                        <ChevronRight size={24} />
                    </button>
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {images.map((_, index) => (
                            <div
                                key={index}
                                className={`w-3 h-3 rounded-full ${index === currentIndex ? "bg-white" : "bg-white/50"
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};


const PostDetails = () => {
    const { id } = useParams()
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [userId, setUserId] = useState(null)
    const [likes, setLikes] = useState({ isLiked: false, length: 0 })
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')
    const [reply, setReply] = useState({ commentId: null, text: '' })
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        const fetchPost = async () => {
            const storedUserId = localStorage.getItem('userId')
            setUserId(storedUserId)

            try {
                const response = await axios.get(`${MARKETER_API_END_POINT}/post/${id}`)
                const fetchedPost = response.data.post
                setPost(fetchedPost)

                const postLikes = Array.isArray(fetchedPost.likes) ? fetchedPost.likes : []
                setLikes({
                    isLiked: postLikes.includes(storedUserId),
                    length: postLikes.length,
                })

                setComments(fetchedPost.comments || [])
            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching post details')
            } finally {
                setLoading(false)
            }
        }
        fetchPost()
    }, [id])

    const toggleLike = async () => {
        if (!userId) {
            return setShowModal(true); // Show login modal if user is not logged in
        }

        try {
            // Send the request to the server to toggle the like
            const response = await axios.post(`${MARKETER_API_END_POINT}/posts/${post._id}/like`);

            // Update the state with the server response
            setLikes({
                isLiked: response.data.isLiked,
                length: response.data.likesCount,
            });
            window.location.reload();
        } catch (error) {
            console.error('Error toggling like:', error);
            // Optionally show an error notification or revert state
        }
    };


    const addComment = async () => {
        if (!userId) return setShowModal(true)
        try {
            const response = await axios.post(`${MARKETER_API_END_POINT}/posts/${post._id}/comment`, { text: newComment })
            setComments(response.data.post.comments)
            setNewComment('')
        } catch (error) {
            console.error('Error adding comment:', error)
        }
    }

    const replyToComment = async (commentId) => {
        if (!userId) return setShowModal(true)
        try {
            const response = await axios.post(`${MARKETER_API_END_POINT}/posts/${post._id}/comment/${commentId}/reply`, {
                text: reply.text,
            })
            setComments(response.data.post.comments)
            setReply({ commentId: null, text: '' })
        } catch (error) {
            console.error('Error replying to comment:', error)
        }
    }

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
        </div>
    )

    if (error) return <p className="text-red-500 text-center py-6 text-sm">{error}</p>

    return (
        <div>
            <Navbar />
            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-6xl mx-auto px-4 py-6">
                    <div className="lg:flex lg:gap-6">
                        {/* Main content - 70% */}
                        <div className="lg:flex-1">
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                                {/* Author info */}
                                <div className="flex items-center mb-3">
                                    {post?.author?.profile?.profilePhoto ? (
                                        <img
                                            src={post.author.profile.profilePhoto}
                                            alt={post.author.profile.fullname || "User"}
                                            className="w-10 h-10 rounded-full object-cover mr-3"
                                        />
                                    ) : (
                                        <img
                                            src="/placeholder.svg"
                                            alt="Default Profile"
                                            className="w-10 h-10 rounded-full object-cover mr-3"
                                        />
                                    )}

                                    <div>
                                        <h2 className="text-base font-semibold text-gray-900">{post?.author?.profile?.fullname || 'Unknown Author'}</h2>
                                        <p className="text-xs text-gray-500">{post?.author?.profile?.agencyName || 'Unknown Agency'}</p>
                                    </div>
                                </div>

                                {/* Post content */}
                                {post.text && (
                                    <ExpandableText
                                        className="text-gray-600 text-sm mb-4"
                                        text={post.text}
                                        maxLength={200}
                                    />
                                )}
                                {/* Media */}
                                {post?.media?.photos?.length > 0 && (
                                    <div className="mb-3 flex justify-center">
                                        <ImageGallery images={post.media.photos} />
                                    </div>
                                )}

                                {/* Event details */}
                                {post?.event && (
                                    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                                        <h3 className="font-bold text-lg text-gray-800 mb-2 flex items-center">
                                            <Calendar className="mr-2 text-gray-700" size={20} />
                                            Event Details
                                        </h3>
                                        <div className="space-y-2">
                                            <p className="text-sm text-gray-700">
                                                <span className="font-semibold text-gray-800">Title:</span> {post.event.title || 'N/A'}
                                            </p>
                                            <p className="text-sm text-gray-700">
                                                <span className="font-semibold text-gray-800">Date:</span>
                                                {new Date(post.event.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }) || 'N/A'}
                                            </p>
                                            <p className="text-sm text-gray-700 flex items-center">
                                                <MapPin className="mr-2 text-gray-700" size={16} />
                                                <span>
                                                    <span className="font-semibold text-gray-800">Location:</span> {post.event.location || 'N/A'}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Job Opening */}
                                {post?.jobOpening && (
                                    <div className="bg-gray-50 rounded-md p-3 mb-3 text-xs">
                                        <h3 className="font-semibold text-gray-900 mb-1 flex items-center">
                                            <Briefcase className="mr-1" size={14} />
                                            Job Opening
                                        </h3>
                                        <p><strong>Position:</strong> {post.jobOpening.position || 'N/A'}</p>
                                        <p><strong>Salary:</strong> {post.jobOpening.salary || 'N/A'}</p>
                                        <p className="flex items-center">
                                            <MapPin className="mr-1" size={12} />
                                            <span><strong>Location:</strong> {post.jobOpening.location || 'N/A'}</span>
                                        </p>
                                    </div>
                                )}

                                {/* Poll */}
                                {post?.poll && post?.poll?.question && (
                                    <div className="bg-gray-50 rounded-md p-3 mb-3 text-xs">
                                        <h3 className="font-semibold text-gray-900 mb-1 flex items-center">
                                            <BarChart2 className="mr-1" size={14} />
                                            Poll
                                        </h3>
                                        <p><strong>Question:</strong> {post.poll.question || 'N/A'}</p>
                                        <ul className="list-disc pl-4 mt-1">
                                            {post.poll.options?.map((option, index) => (
                                                <li key={index} className="text-gray-700">{option}</li>
                                            )) || <li>No options available</li>}
                                        </ul>
                                    </div>
                                )}

                                {/* Document */}
                                {post?.document && (
                                    <div className="bg-gray-50 rounded-md p-3 mb-3 text-xs">
                                        <h3 className="font-semibold text-gray-900 mb-1 flex items-center">
                                            <FileText className="mr-1" size={14} />
                                            Document
                                        </h3>
                                        <a
                                            href={post.document.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-700 hover:underline flex items-center"
                                        >
                                            <FileText className="mr-1" size={12} />
                                            {post.document.title || 'View Document'}
                                        </a>
                                    </div>
                                )}

                                {/* Interactions */}
                                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                                    {/* Like Button */}
                                    <button
                                        onClick={toggleLike}
                                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs transition-colors ${likes.isLiked ? 'bg-pink-100 text-pink-600' : 'hover:bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        <ThumbsUp
                                            size={14}
                                            className={`transition-colors ${likes.isLiked ? 'text-pink-500 fill-current' : 'text-gray-500'
                                                }`}
                                        />
                                        <span>{likes.isLiked ? 'Liked' : 'Like'}</span>
                                        <span className="text-gray-500">({likes.length})</span>
                                    </button>

                                    {/* Comment Button */}
                                    <button className="flex items-center gap-1 px-3 py-1 rounded-full text-xs hover:bg-gray-100 text-gray-700">
                                        <MessageCircle size={14} />
                                        <span>Comment</span>
                                        <span className="text-gray-500">({comments.length})</span>
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
                                    {comments.map((comment) => (
                                        <div key={comment._id} className="border-b border-gray-100 pb-2">
                                            <div className="flex items-start gap-2">
                                                <img
                                                    src={comment.profile?.profilePhoto || '/default-avatar.png'}
                                                    alt={comment.profile?.fullname || 'Anonymous User'}
                                                    className="w-8 h-8 rounded-full"
                                                />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">
                                                        {comment.profile?.fullname || 'Anonymous User'}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {comment.profile?.agencyName || ''}
                                                    </p>
                                                </div>
                                            </div>
                                            {comment.text && (
                                                <ExpandableText
                                                    text={comment.text}
                                                    maxLength={100}
                                                    className="text-sm text-gray-600 mt-2"
                                                />
                                            )}
                                            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                                <button
                                                    onClick={() => {
                                                        console.log("Setting reply state for comment ID:", comment._id); // Debugging reply state setting
                                                        setReply({ commentId: comment._id, text: '' });
                                                    }}
                                                    className="hover:text-gray-700"
                                                >
                                                    Reply
                                                </button>
                                                <span>{moment(comment.createdAt).fromNow()}</span>
                                            </div>

                                            {/* Replies */}
                                            {comment.replies.map((reply) => (
                                                <div key={reply._id} className="ml-4 mt-3 p-2 bg-gray-50 rounded-md">
                                                    <div className="flex items-start gap-2">
                                                        <img
                                                            src={reply.profile?.profilePhoto || '/default-avatar.png'}
                                                            alt={reply.profile?.fullname || 'Anonymous User'}
                                                            className="w-6 h-6 rounded-full"
                                                        />
                                                        <div>
                                                            <p className="text-xs font-medium text-gray-800">
                                                                {reply.profile?.fullname || 'Anonymous User'}
                                                            </p>
                                                            <p className="text-xs text-gray-500">{reply.profile?.agencyName || ''}</p>
                                                        </div>
                                                    </div>
                                                    {reply.text && (
                                                        <ExpandableText
                                                            text={reply.text}
                                                            maxLength={100}
                                                            className="text-sm text-gray-700 mt-1"
                                                        />
                                                    )}
                                                    <span className="text-xs text-gray-500">{moment(reply.createdAt).fromNow()}</span>
                                                </div>
                                            ))}

                                            {/* Reply Input */}
                                            {reply.commentId === comment._id && (
                                                <div className="mt-2 flex gap-2">
                                                    <input
                                                        value={reply.text}
                                                        onChange={(e) => {
                                                            console.log("Updating reply text for comment ID:", comment._id, "New text:", e.target.value); // Debugging input change
                                                            setReply({ ...reply, text: e.target.value });
                                                        }}
                                                        className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
                                                        placeholder="Write a reply..."
                                                    />
                                                    <button
                                                        onClick={() => {
                                                            console.log("Submitting reply for comment ID:", comment._id, "Reply text:", reply.text); // Debugging reply submission
                                                            replyToComment(comment._id);
                                                        }}
                                                        className="px-2 py-1 text-xs bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
                                                    >
                                                        Reply
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-3 flex gap-2">
                                    <input
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
                                        placeholder="Add a comment..."
                                    />
                                    <button
                                        onClick={addComment}
                                        className="px-3 py-2 bg-gray-800 text-white text-sm rounded-md hover:bg-gray-700 transition-colors"
                                    >
                                        <Send size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Suggested Profiles - 30% */}
                        <div className="hidden lg:block lg:w-72">
                            <div className="sticky top-20">
                                <RandomSuggestedProfiles />
                            </div>
                        </div>
                    </div>
                </div>
                <LoginModal isOpen={showModal} onClose={() => setShowModal(false)} />
            </div>
            <Footer2 />
        </div>

    )
}

export default PostDetails