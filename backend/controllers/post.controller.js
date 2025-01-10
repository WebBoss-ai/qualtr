import { Post } from '../models/Post.js';
import { uploadPostMedia, deletePostMedia } from '../utils/aws.js'; // Helper functions for AWS S3

// Create a new post
export const createPost = async (req, res) => {
    try {
        const { category, text, event, occasion, jobOpening, poll, document } = req.body;
        const userId = req.id; // Assuming user ID is available from middleware

        // Media files uploaded via Multer
        const photos = req.files?.photos || [];
        const videos = req.files?.videos || [];
        const uploadedMedia = {};

        // Log the media received in the request
        console.log("Received photos:", photos);
        console.log("Received videos:", videos);

        // Upload photos to S3
        if (photos.length) {
            console.log(`Uploading ${photos.length} photos...`);
            uploadedMedia.photos = await Promise.all(
                photos.map((file, index) => {
                    console.log(`Uploading photo ${index + 1}:`, file.originalname);
                    return uploadPostMedia(file);
                })
            );
            console.log("Photos uploaded:", uploadedMedia.photos);
        } else {
            console.log("No photos to upload.");
        }

        // Upload videos to S3
        if (videos.length) {
            console.log(`Uploading ${videos.length} videos...`);
            uploadedMedia.videos = await Promise.all(
                videos.map((file, index) => {
                    console.log(`Uploading video ${index + 1}:`, file.originalname);
                    return uploadPostMedia(file);
                })
            );
            console.log("Videos uploaded:", uploadedMedia.videos);
        } else {
            console.log("No videos to upload.");
        }

        // Create the post
        const newPost = new Post({
            author: userId,
            category,
            text,
            media: uploadedMedia,
            event: event ? JSON.parse(event) : undefined,
            occasion: occasion ? JSON.parse(occasion) : undefined,
            jobOpening: jobOpening ? JSON.parse(jobOpening) : undefined,
            poll: poll ? JSON.parse(poll) : undefined,
            document: document ? JSON.parse(document) : undefined,
        });

        await newPost.save();

        return res.status(201).json({
            message: 'Post created successfully.',
            success: true,
            post: newPost,
        });
    } catch (error) {
        console.error("Error creating post:", error);
        return res.status(500).json({ message: 'Internal server error.', success: false });
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
            .populate('author', 'profile.fullname') // Populate author's fullname
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
