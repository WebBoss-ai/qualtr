import { Post } from '../models/Post.js';
import { uploadPostMedia, deletePostMedia, getObjectURL, generatePostImageUrl, generatePostVideoUrl } from '../utils/aws.js'; // Helper functions for AWS S3
import moment from 'moment'; // Add moment to handle time formatting
import { DigitalMarketer } from '../models/DigitalMarketer.js';

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
    // Check if the logged-in user belongs to the DigitalMarketer model
    const digitalMarketer = await DigitalMarketer.findOne({ user: req._id });

    if (!digitalMarketer) {
      return res.status(403).json({
        message: 'You must be a Digital Marketer to access this resource.',
        success: false,
      });
    }

    console.log('Logged-in user is a Digital Marketer:', digitalMarketer);

    const posts = await Post.find()
      .populate('author', 'profile') // Populate the full profile object
      .sort({ createdAt: -1 })
      .lean(); // Use lean for better performance since no modifications are needed to the Mongoose document

    // Process logged-in user's profile photo
    let loggedInUserProfilePhoto = null;
    if (digitalMarketer) {
      loggedInUserProfilePhoto = await getObjectURL(digitalMarketer.profile.profilePhoto); // Generate a presigned URL for the user's profile picture
    } else {
      console.log('No profile photo for logged-in user');
    }

    const postsWithMediaAndAuthorData = await Promise.all(
      posts.map(async (post) => {
        // Process author profile photo URL
        if (post.author?.profile?.profilePhoto) {
          const profilePhotoURL = await getObjectURL(post.author.profile.profilePhoto);
          post.author.profile.profilePhoto = profilePhotoURL;
        }

        // Process media (photos and videos)
        if (post.media) {
          if (post.media.photos?.length > 0) {
            post.media.photos = await Promise.all(
              post.media.photos
                .filter((photo) => photo && photo.url)
                .map(async (photo) => {
                  const s3Key = photo.url.split('amazonaws.com/')[1];
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
                .filter((video) => video && video.url)
                .map(async (video) => {
                  const s3Key = video.url.split('amazonaws.com/')[1];
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
      posts: postsWithMediaAndAuthorData,
      userProfilePhoto: loggedInUserProfilePhoto, // Include the logged-in user's profile photo URL
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
          .populate('author', 'profile') // Populate the entire profile object
          .lean();

      if (!post) {
          return res.status(404).json({
              message: 'Post not found.',
              success: false,
          });
      }

      // Fetch and update the author's profile photo URL
      if (post.author?.profile?.profilePhoto) {
          const profilePhotoURL = await getObjectURL(post.author.profile.profilePhoto); // Generate a presigned URL for the profile picture
          post.author.profile.profilePhoto = profilePhotoURL; // Replace with the generated URL
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
      .populate('author', 'profile.fullname profile.agencyName profile.profilePhoto');

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
      isLiked: isLiked,
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

    const digitalMarketer = await DigitalMarketer.findById(userId);
    if (!digitalMarketer) {
      return res.status(404).json({ message: 'Digital marketer not found' });
    }

    const profilePhotoURL = digitalMarketer.profile.profilePhoto
    ? await getObjectURL(digitalMarketer.profile.profilePhoto)
    : '/default-avatar.png';

    const profileData = {
      fullname: digitalMarketer.profile.fullname,
      profilePhoto: profilePhotoURL,
      agencyName: digitalMarketer.profile.agencyName,
      location: digitalMarketer.profile.location,
    };

    post.comments.push({
      user: userId,
      text,
      taggedUsers,
      profile: profileData,
    });
    await post.save();

    res.status(200).json({ success: true, message: 'Comment added', post });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
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

    const digitalMarketer = await DigitalMarketer.findById(userId);
    if (!digitalMarketer) {
      return res.status(404).json({ message: 'Digital marketer not found' });
    }

    const profilePhotoURL = digitalMarketer.profile.profilePhoto
    ? await getObjectURL(digitalMarketer.profile.profilePhoto)
    : '/default-avatar.png';

    const profileData = {
      fullname: digitalMarketer.profile.fullname,
      profilePhoto: profilePhotoURL,
      agencyName: digitalMarketer.profile.agencyName,
      location: digitalMarketer.profile.location,
      createdAt: new Date(),
    };

    comment.replies.push({
      user: userId,
      text,
      taggedUsers,
      profile: profileData,
    });
    await post.save();

    res.status(200).json({ success: true, message: 'Reply added', post });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

export const voteOnPoll = async (req, res) => {
  const { postId } = req.params;
  const { option } = req.body;
  const userId = req.id; // Assuming user ID is available in `req.id`

  try {
      const post = await Post.findById(postId);

      if (!post || !post.poll) {
          return res.status(404).json({
              message: 'Post or poll not found.',
              success: false,
          });
      }

      // If the poll has ended, return results
      if (new Date() > new Date(post.poll.endDate)) {
          return res.status(400).json({
              message: 'Poll voting has ended.',
              success: false,
              poll: {
                  question: post.poll.question,
                  options: post.poll.options,
                  votes: Object.fromEntries(post.poll.votes), // Convert Map to plain object
              },
          });
      }

      // Check if the user has already voted
      if (post.poll.voters.includes(userId)) {
          return res.status(200).json({
              message: 'You have already voted.',
              success: true,
              poll: {
                  question: post.poll.question,
                  options: post.poll.options,
                  votes: Object.fromEntries(post.poll.votes), // Convert Map to plain object
              },
          });
      }

      // If user has not voted, record their vote
      if (!post.poll.options.includes(option)) {
          return res.status(400).json({
              message: 'Invalid option.',
              success: false,
          });
      }

      // Increment the vote count
      if (!post.poll.votes.has(option)) {
          post.poll.votes.set(option, 0);
      }
      post.poll.votes.set(option, post.poll.votes.get(option) + 1);

      // Add the user to the voters list
      post.poll.voters.push(userId);

      // Save the poll
      await post.save();

      return res.status(200).json({
          message: 'Vote submitted successfully.',
          success: true,
          poll: {
              question: post.poll.question,
              options: post.poll.options,
              votes: Object.fromEntries(post.poll.votes), // Convert Map to plain object
          },
      });
  } catch (error) {
      console.error('Error voting on poll:', error);
      return res.status(500).json({
          message: 'Internal server error.',
          success: false,
      });
  }
};

export const getPostWithPoll = async (req, res) => {
  const { postId } = req.params;
  const userId = req.id;

  try {
      const post = await Post.findById(postId);

      if (!post || !post.poll) {
          return res.status(404).json({
              message: 'Post or poll not found.',
              success: false,
          });
      }

      const hasVoted = post.poll.voters.includes(userId);

      return res.status(200).json({
          success: true,
          post: {
              ...post.toObject(),
              poll: {
                  ...post.poll,
                  votes: Object.fromEntries(post.poll.votes), // Convert Map to plain object
                  hasVoted, // Add hasVoted field
              },
          },
      });
  } catch (error) {
      console.error('Error fetching post with poll:', error);
      return res.status(500).json({
          message: 'Internal server error.',
          success: false,
      });
  }
};
