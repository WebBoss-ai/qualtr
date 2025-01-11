import { Post } from '../models/Post.js';
import { uploadPostMedia, deletePostMedia, generatePostImageUrl, generatePostVideoUrl } from '../utils/aws.js'; // Helper functions for AWS S3

// Create a new post
export const createPost = async (req, res) => {
    try {
      const { category, text, event, occasion, jobOpening, poll, document } = req.body;
      const userId = req.id;
      const files = req.files || [];
  
      const uploadedMedia = {
        photos: [],
        videos: [],
      };
  
      const photos = files.filter((file) => file.mimetype.startsWith('image/'));
      const videos = files.filter((file) => file.mimetype.startsWith('video/'));
  
      // Upload photos
      if (photos.length) {
        uploadedMedia.photos = await Promise.all(
          photos.map(async (file) => {
            const { url, key } = await uploadPostMedia(file);
            return { url, key }; // Save Key for accurate URL generation
          })
        );
      }
  
      // Upload videos
      if (videos.length) {
        uploadedMedia.videos = await Promise.all(
          videos.map(async (file) => {
            const { url, key } = await uploadPostMedia(file, 'videos');
            return { url, key };
          })
        );
      }
  
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
      return res.status(201).json({ message: "Post created successfully.", success: true, post: newPost });
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
      console.log("Fetching posts...");
      const posts = await Post.find()
        .populate('author', 'profile.fullname profile.profilePicture')
        .sort({ createdAt: -1 });
  
      console.log("Posts fetched successfully:", posts);
  
      const postsWithMediaUrls = posts.map(post => {
        console.log("Processing post:", post._id);
  
        if (post.media) {
          // Process photos
          if (post.media.photos?.length > 0) {
            console.log("Found photos for post:", post._id);
            post.media.photos = post.media.photos
              .filter(photo => photo && photo.url) // Ensure `photo.url` exists
              .map(photo => {
                const s3Key = photo.url.split("amazonaws.com/")[1]; // Extract S3 key from URL
                console.log("Generating signed URL for photo key:", s3Key);
                return {
                  ...photo,
                  url: generatePostImageUrl(s3Key), // Generate signed URL for photo
                };
              });
            console.log("Photos after URL generation:", post.media.photos);
          }
  
          // Process videos
          if (post.media.videos?.length > 0) {
            console.log("Found videos for post:", post._id);
            post.media.videos = post.media.videos
              .filter(video => video && video.url) // Ensure `video.url` exists
              .map(video => {
                const s3Key = video.url.split("amazonaws.com/")[1]; // Extract S3 key from URL
                console.log("Generating signed URL for video key:", s3Key);
                return {
                  ...video,
                  url: generatePostVideoUrl(s3Key), // Generate signed URL for video
                };
              });
            console.log("Videos after URL generation:", post.media.videos);
          }
        }
        return post;
      });
  
      console.log("Posts with media URLs processed:", postsWithMediaUrls);
  
      return res.status(200).json({
        message: 'Posts retrieved successfully.',
        success: true,
        posts: postsWithMediaUrls,
      });
    } catch (error) {
      console.error('Error retrieving posts:', error);
      return res.status(500).json({
        message: 'Internal server error.',
        success: false,
      });
    }
  };  