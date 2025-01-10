import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MARKETER_API_END_POINT } from "@/utils/constant";

const PostPage = () => {
    const [posts, setPosts] = useState([]);
    const [postCategory, setPostCategory] = useState('');
    const [postType, setPostType] = useState('');
    const [postText, setPostText] = useState('');
    const [media, setMedia] = useState({ photos: [], videos: [] });
    const [additionalData, setAdditionalData] = useState({});
    const [currentStep, setCurrentStep] = useState(1);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            console.log('Fetching posts...');
            const response = await axios.get(`${MARKETER_API_END_POINT}/posts`);
            console.log('Posts fetched successfully:', response.data);
            setPosts(response.data.posts || []);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
            setPosts([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submission started...');

        const formData = new FormData();
        formData.append('category', postCategory);
        formData.append('type', postType);
        formData.append('text', postText);

        // Append media files
        for (let file of media.photos) {
            console.log('Appending photo:', file.name);
            formData.append('photos', file);
        }
        for (let file of media.videos) {
            console.log('Appending video:', file.name);
            formData.append('videos', file);
        }

        // Append additional data
        console.log('Appending additional data:', additionalData);
        formData.append('additionalData', JSON.stringify(additionalData));

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
                        <label>Photos (Max 10):</label>
                        <input
                            type="file"
                            name='images'
                            accept="image/*"
                            multiple
                            onChange={(e) => {
                                console.log('Photos selected:', e.target.files);
                                setMedia((prev) => ({
                                    ...prev,
                                    photos: [...prev.photos, ...e.target.files],
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

            <div>
                <h2>All Posts</h2>
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <div key={post._id}>
                            <h3>{post.category}</h3>
                            <p>{post.text}</p>
                        </div>
                    ))
                ) : (
                    <p>No posts available</p>
                )}
            </div>
        </div>
    );
};

export default PostPage;
