import { Post } from '../models/Post.js';
import { uploadPostMedia, deletePostMedia } from '../utils/aws.js'; // Helper functions for AWS S3

// Create a new post
export const createPost = async (req, res) => {
    try {
        const { category, text, event, occasion, jobOpening, poll, document } = req.body;
        const userId = req.id; // Assuming user ID is available from middleware
        const files = req.files || []; // Multer handles all uploaded files

        const uploadedMedia = {
            photos: [],
            videos: [],
        };

        // Filter files into photos and videos
        const photos = files.filter((file) => file.mimetype.startsWith('image/'));
        const videos = files.filter((file) => file.mimetype.startsWith('video/'));

        // Upload photos
        if (photos.length) {
            try {
                uploadedMedia.photos = await Promise.all(
                    photos.map(async (file) => {
                        const uploadResult = await uploadPostMedia(file); // Should return { url, metadata }
                        return {
                            url: uploadResult.url,
                            metadata: uploadResult.metadata,
                        };
                    })
                );
            } catch (error) {
                console.error("Error uploading photos:", error);
                return res
                    .status(500)
                    .json({ message: "Photo upload failed.", success: false });
            }
        }        

        // Upload videos
        if (videos.length) {
            try {
                uploadedMedia.videos = await Promise.all(
                    videos.map(async (file) => {
                        const uploadResult = await uploadPostMedia(file);
                        return {
                            url: uploadResult.url,
                            metadata: uploadResult.metadata,
                        };
                    })
                );
            } catch (error) {
                console.error("Error uploading videos:", error);
                return res
                    .status(500)
                    .json({ message: "Video upload failed.", success: false });
            }
        }

        // Parse optional fields safely
        const parseField = (field) => {
            try {
                return field ? JSON.parse(field) : undefined;
            } catch (error) {
                console.error(`Error parsing field ${field}:`, error);
                return undefined;
            }
        };

        const newPost = new Post({
            author: userId,
            category,
            text,
            media: uploadedMedia,
            event: parseField(event),
            occasion: parseField(occasion),
            jobOpening: parseField(jobOpening),
            poll: parseField(poll),
            document: parseField(document),
        });

        await newPost.save();

        return res.status(201).json({
            message: "Post created successfully.",
            success: true,
            post: newPost,
        });
    } catch (error) {
        console.error("Error creating post:", error);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};

// Edit a post
export const editPost = async (req, res) => {
    try {
        const { id } = req.params; // Post ID
        const { category, text, event, occasion, jobOpening, poll, document } = req.body;
        const userId = req.id; // Assuming user ID is available

        const post = await Post.findOne({ _id: id, author: userId });
        if (!post) {
            return res.status(404).json({ message: 'Post not found.', success: false });
        }

        post.category = category || post.category;
        post.text = text || post.text;
        post.event = event ? JSON.parse(event) : post.event;
        post.occasion = occasion ? JSON.parse(occasion) : post.occasion;
        post.jobOpening = jobOpening ? JSON.parse(jobOpening) : post.jobOpening;
        post.poll = poll ? JSON.parse(poll) : post.poll;
        post.document = document ? JSON.parse(document) : post.document;

        await post.save();

        return res.status(200).json({
            message: 'Post updated successfully.',
            success: true,
            post,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error.', success: false });
    }
};

// Delete a post
export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.id;

        const post = await Post.findOneAndDelete({ _id: id, author: userId });
        if (!post) {
            return res.status(404).json({ message: 'Post not found.', success: false });
        }

        // Delete media files from S3
        if (post.media?.photos) {
            await Promise.all(post.media.photos.map((key) => deletePostMedia(key)));
        }
        if (post.media?.videos) {
            await Promise.all(post.media.videos.map((key) => deletePostMedia(key)));
        }

        return res.status(200).json({
            message: 'Post deleted successfully.',
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error.', success: false });
    }
};

// Get all posts
export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'profile.fullname', 'profile.profilePicture') // Populate author's fullname
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: 'Posts retrieved successfully.',
            success: true,
            posts,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error.', success: false });
    }
};
