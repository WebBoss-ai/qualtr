import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { MARKETER_API_END_POINT } from '@/utils/constant';

const PostDetails = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null); // State to store userId
    const [likes, setLikes] = useState([]);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [reply, setReply] = useState({ commentId: null, text: '' });

    const toggleLike = async () => {
        try {
            const response = await axios.post(`${MARKETER_API_END_POINT}/posts/${post._id}/like`);
            setLikes(response.data.likes);
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const addComment = async () => {
        try {
            const response = await axios.post(`${MARKETER_API_END_POINT}/posts/${post._id}/comment`, { text: newComment });
            setComments(response.data.post.comments);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const replyToComment = async (commentId) => {
        try {
            const response = await axios.post(`${MARKETER_API_END_POINT}/posts/${post._id}/comment/${commentId}/reply`, {
                text: reply.text,
            });
            setComments(response.data.post.comments);
            setReply({ commentId: null, text: '' });
        } catch (error) {
            console.error('Error replying to comment:', error);
        }
    };

    useEffect(() => {
        const fetchPost = async () => {
            const storedUserId = localStorage.getItem('userId'); // Retrieve userId from localStorage
            setUserId(storedUserId);
            try {
                const response = await axios.get(`${MARKETER_API_END_POINT}/post/${id}`);
                const fetchedPost = response.data.post;
                setPost(fetchedPost);
                setLikes(fetchedPost.likes || []);
                setComments(fetchedPost.comments || []);
            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching post details');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-4">
            <p className="text-2xl font-bold mb-4">{post?.text || 'No title available'}</p>

            {post?.category && <h3 className="text-lg font-semibold">Category: {post.category}</h3>}

            {post?.author?.profile?.fullname && (
                <p>
                    <strong>Author:</strong> {post.author.profile.fullname}
                </p>
            )}
            {post?.author?.profile?.profilePhoto && (
                <img
                    src={post.author.profile.profilePhoto}
                    alt={post.author.profile.fullname}
                    style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                />
            )}

            {post?.media?.photos?.length > 0 && (
                <div className="mt-4">
                    <h4 className="font-semibold">Photos:</h4>
                    <div className="grid grid-cols-3 gap-4">
                        {post.media.photos.map((photo, index) => (
                            <img
                                key={index}
                                src={photo.url}
                                alt={`Photo ${index + 1}`}
                                className="rounded-lg"
                                style={{ width: '100px', height: '100px' }}
                            />
                        ))}
                    </div>
                </div>
            )}

            {post?.media?.videos?.length > 0 && (
                <div className="mt-4">
                    <h4 className="font-semibold">Videos:</h4>
                    {post.media.videos.map((video, index) => (
                        <video key={index} width="300" controls>
                            <source src={video.url} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    ))}
                </div>
            )}

            {post?.event && (
                <div className="mt-4">
                    <h4 className="font-semibold">Event Details:</h4>
                    <p><strong>Title:</strong> {post.event.title || 'N/A'}</p>
                    <p><strong>Date:</strong> {post.event.date || 'N/A'}</p>
                    <p><strong>Location:</strong> {post.event.location || 'N/A'}</p>
                </div>
            )}

            {post?.occasion && (
                <div className="mt-4">
                    <h4 className="font-semibold">Occasion Details:</h4>
                    <p><strong>Occasion:</strong> {post.occasion.name || 'N/A'}</p>
                    <p><strong>Description:</strong> {post.occasion.description || 'N/A'}</p>
                </div>
            )}

            {post?.jobOpening && (
                <div className="mt-4">
                    <h4 className="font-semibold">Job Opening:</h4>
                    <p><strong>Position:</strong> {post.jobOpening.position || 'N/A'}</p>
                    <p><strong>Salary:</strong> {post.jobOpening.salary || 'N/A'}</p>
                    <p><strong>Location:</strong> {post.jobOpening.location || 'N/A'}</p>
                </div>
            )}

            {post?.poll && (
                <div className="mt-4">
                    <h4 className="font-semibold">Poll:</h4>
                    <p><strong>Question:</strong> {post.poll.question || 'N/A'}</p>
                    <ul className="list-disc pl-5">
                        {post.poll.options?.map((option, index) => (
                            <li key={index}>{option}</li>
                        )) || <li>No options available</li>}
                    </ul>
                </div>
            )}

            {post?.document && (
                <div className="mt-4">
                    <h4 className="font-semibold">Document:</h4>
                    <a
                        href={post.document.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                    >
                        {post.document.title || 'View Document'}
                    </a>
                </div>
            )}

            <div>
                <button onClick={toggleLike}>
                    {likes.includes(userId) ? 'Unlike' : 'Like'} ({likes.length})
                </button>

                <div>
                    <h3>Comments</h3>
                    <ul>
                        {comments.map((comment) => (
                            <li key={comment._id}>
                                <p>{comment.text}</p>
                                <button onClick={() => setReply({ commentId: comment._id, text: '' })}>Reply</button>

                                {comment.replies.map((reply) => (
                                    <p key={reply._id} style={{ marginLeft: '20px' }}>
                                        {reply.text}
                                    </p>
                                ))}

                                {reply.commentId === comment._id && (
                                    <div>
                                        <input
                                            value={reply.text}
                                            onChange={(e) => setReply({ ...reply, text: e.target.value })}
                                        />
                                        <button onClick={() => replyToComment(comment._id)}>Submit</button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>

                    <input
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment"
                    />
                    <button onClick={addComment}>Comment</button>
                </div>
            </div>
        </div>
    );

};

export default PostDetails;
