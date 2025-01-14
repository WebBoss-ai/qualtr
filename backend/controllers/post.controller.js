import { Post } from '../models/Post.js';
import { uploadPostMedia, deletePostMedia, generatePostImageUrl, generatePostVideoUrl } from '../utils/aws.js'; // Helper functions for AWS S3
import moment from 'moment'; // Add moment to handle time formatting

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
  
      // Check if fields are strings before parsing
      const parseField = (field) => {
        return typeof field === 'string' ? JSON.parse(field) : field;
      };
  
      const newPost = new Post({
        author: userId,
        category,
        text,
        media: uploadedMedia,
        event: event ? parseField(event) : undefined,
        occasion: occasion ? parseField(occasion) : undefined,
        jobOpening: jobOpening ? parseField(jobOpening) : undefined,
        poll: poll ? parseField(poll) : undefined,
        document: document ? parseField(document) : undefined,
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
      const posts = await Post.find()
        .populate('author', 'profile.fullname profile.profilePicture')
        .sort({ createdAt: -1 });
  
      const postsWithMediaUrls = await Promise.all(
        posts.map(async post => {
          if (post.media) {
            if (post.media.photos?.length > 0) {
              post.media.photos = await Promise.all(
                post.media.photos
                  .filter(photo => photo && photo.url)
                  .map(async photo => {
                    const s3Key = photo.url.split("amazonaws.com/")[1];
                    return {
                      ...photo,
                      url: await generatePostImageUrl(s3Key),
                    };
                  })
              );
            }
  
            if (post.media.videos?.length > 0) {
              post.media.videos = await Promise.all(
                post.media.videos
                  .filter(video => video && video.url)
                  .map(async video => {
                    const s3Key = video.url.split("amazonaws.com/")[1];
                    return {
                      ...video,
                      url: await generatePostVideoUrl(s3Key),
                    };
                  })
              );
            }
          }
          return post;
        })
      );
  
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

export const getPostById = async (req, res) => {
  const { id } = req.params;

  try {
      // Increment impressions by 1
      const post = await Post.findByIdAndUpdate(
          id,
          { $inc: { impressions: 1 } }, // Increment impressions by 1
          { new: true } // Return the updated document
      )
          .populate('author', 'profile.fullname profile.profilePicture')
          .lean();

      if (!post) {
          return res.status(404).json({
              message: 'Post not found.',
              success: false,
          });
      }

      if (post.media) {
          if (post.media.photos?.length > 0) {
              post.media.photos = await Promise.all(
                  post.media.photos.map(async (photo) => {
                      const s3Key = photo.url.split("amazonaws.com/")[1];
                      return {
                          ...photo,
                          url: await generatePostImageUrl(s3Key),
                      };
                  })
              );
          }

          if (post.media.videos?.length > 0) {
              post.media.videos = await Promise.all(
                  post.media.videos.map(async (video) => {
                      const s3Key = video.url.split("amazonaws.com/")[1];
                      return {
                          ...video,
                          url: await generatePostVideoUrl(s3Key),
                      };
                  })
              );
          }
      }

      return res.status(200).json({
          message: 'Post retrieved successfully.',
          success: true,
          post,
      });
  } catch (error) {
      console.error('Error retrieving post by ID:', error);
      return res.status(500).json({
          message: 'Internal server error.',
          success: false,
      });
  }
};

export const getTrendingPosts = async (req, res) => {
  try {
    const trendingPosts = await Post.find({ trending: true })
      .populate('author', 'profile.fullname profile.agencyName profile.profilePicture');

    // Shuffle the posts array
    const shuffledPosts = trendingPosts.sort(() => Math.random() - 0.5);

    const postsWithMediaUrls = await Promise.all(
      shuffledPosts.map(async (post) => {
        // Format the time posted
        const timeAgo = moment(post.createdAt).fromNow();

        return {
          ...post.toObject(),
          timeAgo, // Adding formatted time
          profileLink: `/marketer-profile/${post.author._id}`, // Link to author's profile
        };
      })
    );

    return res.status(200).json({
      message: 'Trending posts retrieved successfully.',
      success: true,
      posts: postsWithMediaUrls,
    });
  } catch (error) {
    console.error('Error retrieving trending posts:', error);
    return res.status(500).json({
      message: 'Internal server error.',
      success: false,
    });
  }
};

export const toggleTrendingStatus = async (req, res) => {
  try {
    const { postId, trending } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: 'Post not found.',
        success: false,
      });
    }

    post.trending = trending;
    await post.save();

    return res.status(200).json({
      message: `Post trending status updated successfully.`,
      success: true,
      post,
    });
  } catch (error) {
    console.error('Error toggling post trending status:', error);
    return res.status(500).json({
      message: 'Internal server error.',
      success: false,
    });
  }
};

export const toggleLike = async (req, res) => {
  const { postId } = req.params;
  const userId = req.id;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      post.likes = post.likes.filter((like) => like.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json({
      success: true,
      message: isLiked ? 'Like removed' : 'Post liked',
      likesCount: post.likes.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const addComment = async (req, res) => {
  const { postId } = req.params;
  const { text, taggedUsers } = req.body;
  const userId = req.id;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({ user: userId, text, taggedUsers });
    await post.save();

    res.status(200).json({ success: true, message: 'Comment added', post });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const replyToComment = async (req, res) => {
  const { postId, commentId } = req.params;
  const { text, taggedUsers } = req.body;
  const userId = req.id;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    comment.replies.push({ user: userId, text, taggedUsers });
    await post.save();

    res.status(200).json({ success: true, message: 'Reply added', post });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
