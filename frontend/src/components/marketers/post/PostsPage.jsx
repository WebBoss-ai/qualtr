import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MARKETER_API_END_POINT } from "@/utils/constant";

const PostPage = () => {
    const [posts, setPosts] = useState([]);
    const [postCategory, setPostCategory] = useState('');
    const [postType, setPostType] = useState('');
    const [postText, setPostText] = useState('');
    const [media, setMedia] = useState({ images: [], videos: [] });
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
                            {post.category && <h3>{post.category}</h3>}
                            {post.text && <p>{post.text}</p>}
                            {post.author && post.author.profile && post.author.profile.fullname && (
                                <p>Author: {post.author.profile.fullname}</p>
                            )}
                            {post.author && post.author.profile && post.author.profile.profilePhoto && (
                                <div>
                                    <img
                                        src={post.author.profile.profilePhoto}
                                        alt={post.author.profile.fullname}
                                        style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                                    />
                                </div>
                            )}
                            {post.media && post.media.photos && post.media.photos.length > 0 && (
                                <div>
                                    <h4>Photos:</h4>
                                    {post.media.photos.map((photo, index) => (
                                        <img key={index} src={photo.url} alt={`Photo ${index + 1}`} style={{ width: '100px', height: '100px' }} />
                                    ))}
                                </div>
                            )}
                            {post.media && post.media.videos && post.media.videos.length > 0 && (
                                <div>
                                    <h4>Videos:</h4>
                                    {post.media.videos.map((video, index) => (
                                        <video key={index} width="300" controls>
                                            <source src={video.url} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    ))}
                                </div>
                            )}
                            {post.event && post.event.title && (
                                <div>
                                    <h4>Event:</h4>
                                    <p>{post.event.title}</p>
                                    {post.event.description && <p>{post.event.description}</p>}
                                    {post.event.date && <p>{new Date(post.event.date).toLocaleDateString()}</p>}
                                    {post.event.location && <p>{post.event.location}</p>}
                                </div>
                            )}
                            {post.occasion && post.occasion.title && (
                                <div>
                                    <h4>Occasion:</h4>
                                    <p>{post.occasion.title}</p>
                                    {post.occasion.description && <p>{post.occasion.description}</p>}
                                    {post.occasion.date && <p>{new Date(post.occasion.date).toLocaleDateString()}</p>}
                                </div>
                            )}
                            {post.jobOpening && post.jobOpening.title && (
                                <div>
                                    <h4>Job Opening:</h4>
                                    <p>{post.jobOpening.title}</p>
                                    {post.jobOpening.description && <p>{post.jobOpening.description}</p>}
                                    {post.jobOpening.location && <p>{post.jobOpening.location}</p>}
                                    {post.jobOpening.salaryRange && <p>{post.jobOpening.salaryRange}</p>}
                                </div>
                            )}
                            {post.poll && post.poll.question && (
                                <div>
                                    <h4>Poll:</h4>
                                    <p>{post.poll.question}</p>
                                    {post.poll.options && post.poll.options.length > 0 && (
                                        <ul>
                                            {post.poll.options.map((option, index) => (
                                                <li key={index}>{option}</li>
                                            ))}
                                        </ul>
                                    )}
                                    {post.poll.endDate && <p>Ends on: {new Date(post.poll.endDate).toLocaleDateString()}</p>}
                                </div>
                            )}
                            {post.document && post.document.name && (
                                <div>
                                    <h4>Document:</h4>
                                    <p>{post.document.name}</p>
                                    {post.document.url && <a href={post.document.url} target="_blank" rel="noopener noreferrer">Download</a>}
                                </div>
                            )}
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
