import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { DigitalMarketer } from '../models/DigitalMarketer.js';
import { uploadMarketerProfilePhoto, uploadCampaignImages, getObjectURL, getObjectURL2, deleteCampaignImage } from '../utils/aws.js';
import mongoose from 'mongoose';

export const register = async (req, res) => {
    try {
        console.log('Request received at /register');
        console.log('Request body:', req.body);

        const { email, password, confirmPassword } = req.body;

        if (!email || !password || !confirmPassword) {
            console.log('Missing required fields:', { email, password, confirmPassword });
            return res.status(400).json({
                message: 'Email, password, and confirm password are required.',
                success: false
            });
        }

        if (password !== confirmPassword) {
            console.log('Passwords do not match.');
            return res.status(400).json({
                message: 'Passwords do not match.',
                success: false
            });
        }

        console.log('Checking if user exists...');
        let user = await DigitalMarketer.findOne({ email });
        if (user) {
            console.log('User already exists.');
            return res.status(400).json({
                message: 'User already exists.',
                success: false
            });
        }

        console.log('Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Password hashed successfully.');

        console.log('Creating new user...');
        user = await DigitalMarketer.create({
            email,
            password: hashedPassword,
            profile: {
                fullname: '',
                phoneNumber: '',
                agencyName: ''
            }
        });

        console.log('User created successfully.');
        return res.status(201).json({
            message: 'User registered successfully. Please login.',
            success: true
        });
    } catch (error) {
        console.error('Error occurred during registration:', error.message);
        if (error.errors) {
            console.error('Validation Errors:', error.errors);
        }
        return res.status(500).json({
            message: 'Internal server error.',
            success: false
        });
    }
};

// Login a user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required.',
                success: false
            });
        }

        // Check if user exists
        const user = await DigitalMarketer.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: 'Invalid credentials.',
                success: false
            });
        }

        // Compare password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: 'Invalid credentials.',
                success: false
            });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        // Determine redirection path based on profile completion
        const redirectPath = user.isProfileComplete ? '/posts' : '/founder-profile/update';

        return res.status(200)
            .cookie("token", token, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' })
            .json({
                message: 'Login successful.',
                success: true,
                token,
                _id: user._id,
                redirectPath, // Send the redirection path
            });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error.',
            success: false
        });
    }
};

export const logout = async (req, res) => {
    try {
        // Clear the token cookie
        res.clearCookie("token", { httpOnly: true, sameSite: 'strict' });

        return res.status(200).json({
            message: 'Logout successful.',
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error.',
            success: false,
        });
    }
};

export const checkAuthStatus = (req, res) => {
    try {
        // Check if the token exists in cookies
        const token = req.cookies.token;

        if (!token) {
            return res.status(200).json({ loggedIn: false, message: "Not authenticated." });
        }

        // Verify the JWT token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(200).json({ loggedIn: false, message: "Invalid token." });
            }

            // If token is valid, return success response
            return res.status(200).json({ loggedIn: true, userId: decoded.userId });
        });
    } catch (error) {
        console.error("Error checking authentication status:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

// Update user profile
export const updateProfile = async (req, res) => {
    try {
        const userId = req.id; // Assuming user ID is provided via authentication middleware
        const { fullname, phoneNumber, agencyName, bio, skills, location, website } = req.body;
        const profilePhoto = req.file; // Multer will handle the file upload

        // Find user by ID
        const user = await DigitalMarketer.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
                success: false,
            });
        }

        // Upload profile photo to S3 if provided
        let uploadedProfilePhotoKey = user.profile.profilePhoto; // Use the existing photo if no new photo is uploaded
        if (profilePhoto) {
            const s3Response = await uploadMarketerProfilePhoto(profilePhoto);
            uploadedProfilePhotoKey = `marketer_profile_photos/${profilePhoto.originalname}`; // Store the S3 key
        }

        // Update user profile fields
        user.profile.fullname = fullname || user.profile.fullname;
        user.profile.phoneNumber = phoneNumber || user.profile.phoneNumber;
        user.profile.agencyName = agencyName || user.profile.agencyName;
        user.profile.bio = bio || user.profile.bio;
        user.profile.skills = skills || user.profile.skills;
        user.profile.location = location || user.profile.location;
        user.profile.profilePhoto = uploadedProfilePhotoKey;
        user.profile.website = website || user.profile.website;

        user.isProfileComplete = true;
        await user.save();

        return res.status(200).json({
            message: 'Profile updated successfully.',
            success: true,
            profile: user.profile,
            experiences: user.experiences,
            education: user.education,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error.',
            success: false,
        });
    }
};

export const updateExperiences = async (req, res) => {
    try {
        const userId = req.id; // User ID from authentication middleware
        const { experiences } = req.body;

        console.log("Received userId:", userId);
        console.log("Received experiences:", experiences);

        if (!userId) {
            console.error("User ID is missing in the request.");
            return res.status(400).json({ message: 'User ID is required.', success: false });
        }

        if (!experiences || !Array.isArray(experiences)) {
            console.error("Invalid experiences data in the request.");
            return res.status(400).json({ message: 'Valid experiences data is required.', success: false });
        }

        const user = await DigitalMarketer.findById(userId);
        if (!user) {
            console.error(`User with ID ${userId} not found.`);
            return res.status(404).json({ message: 'User not found.', success: false });
        }

        console.log(`Found user with ID: ${userId}`);

        // Loop through incoming experiences data
        experiences.forEach((exp) => {
            if (exp._id) {
                // Update existing experience entry
                const existingExpIndex = user.experiences.findIndex((e) => e._id.toString() === exp._id);
                if (existingExpIndex !== -1) {
                    user.experiences[existingExpIndex] = { ...user.experiences[existingExpIndex], ...exp };
                }
            } else {
                // Add new experience entry
                user.experiences.push(exp);
            }
        });

        await user.save();

        console.log("Updated experiences:", user.experiences);

        return res.status(200).json({
            message: 'Experiences updated successfully.',
            success: true,
            experiences: user.experiences,
        });
    } catch (error) {
        console.error("Error occurred during the update process:", error);
        return res.status(500).json({
            message: 'Internal server error.',
            success: false,
        });
    }
};
export const editExperience = async (req, res) => {
    try {
        const userId = req.id; // User ID from authentication middleware
        const { experienceId, updatedExperience } = req.body;

        console.log("Received userId:", userId);
        console.log("Experience to edit:", updatedExperience);

        if (!userId) {
            console.error("User ID is missing in the request.");
            return res.status(400).json({ message: 'User ID is required.', success: false });
        }

        if (!experienceId || !updatedExperience) {
            console.error("Invalid experience ID or updated data.");
            return res.status(400).json({ message: 'Valid experience ID and data are required.', success: false });
        }

        const user = await DigitalMarketer.findById(userId);
        if (!user) {
            console.error(`User with ID ${userId} not found.`);
            return res.status(404).json({ message: 'User not found.', success: false });
        }

        console.log(`Found user with ID: ${userId}`);

        const experienceIndex = user.experiences.findIndex((e) => e._id.toString() === experienceId);
        if (experienceIndex === -1) {
            console.error(`Experience with ID ${experienceId} not found.`);
            return res.status(404).json({ message: 'Experience not found.', success: false });
        }

        // Update the experience
        user.experiences[experienceIndex] = { ...user.experiences[experienceIndex]._doc, ...updatedExperience };

        await user.save();

        console.log("Edited experiences:", user.experiences);

        return res.status(200).json({
            message: 'Experience updated successfully.',
            success: true,
            experiences: user.experiences,
        });
    } catch (error) {
        console.error("Error occurred during the edit process:", error);
        return res.status(500).json({
            message: 'Internal server error.',
            success: false,
        });
    }
};
export const deleteExperience = async (req, res) => {
    try {
        const userId = req.id;
        const experienceId = req.params.id;

        const user = await DigitalMarketer.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        user.experiences = user.experiences.filter((exp) => exp._id.toString() !== experienceId);
        await user.save();

        res.status(200).json({ message: 'Experience deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};
export const updateEducation = async (req, res) => {
    try {
        const userId = req.id; // User ID from authentication middleware
        const { education } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required.', success: false });
        }

        if (!education || !Array.isArray(education)) {
            return res.status(400).json({ message: 'Valid education data is required.', success: false });
        }

        const user = await DigitalMarketer.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.', success: false });
        }

        // Loop through incoming education data
        education.forEach((edu) => {
            if (edu._id) {
                // Update existing education entry
                const existingEduIndex = user.education.findIndex((e) => e._id.toString() === edu._id);
                if (existingEduIndex !== -1) {
                    user.education[existingEduIndex] = { ...user.education[existingEduIndex], ...edu };
                }
            } else {
                // Add new education entry
                user.education.push(edu);
            }
        });

        await user.save();

        return res.status(200).json({
            message: 'Education updated successfully.',
            success: true,
            education: user.education,
        });
    } catch (error) {
        console.error("Error occurred during the update process:", error);
        return res.status(500).json({
            message: 'Internal server error.',
            success: false,
        });
    }
};
export const editEducation = async (req, res) => {
    try {
        const userId = req.id; // User ID from authentication middleware
        const { educationId, updatedEducation } = req.body;

        console.log("Received userId:", userId);
        console.log("Education to edit:", updatedEducation);

        if (!userId) {
            console.error("User ID is missing in the request.");
            return res.status(400).json({ message: 'User ID is required.', success: false });
        }

        if (!educationId || !updatedEducation) {
            console.error("Invalid education ID or updated data.");
            return res.status(400).json({ message: 'Valid education ID and data are required.', success: false });
        }

        const user = await DigitalMarketer.findById(userId);
        if (!user) {
            console.error(`User with ID ${userId} not found.`);
            return res.status(404).json({ message: 'User not found.', success: false });
        }

        console.log(`Found user with ID: ${userId}`);

        const educationIndex = user.education.findIndex((e) => e._id.toString() === educationId);
        if (educationIndex === -1) {
            console.error(`Education with ID ${educationId} not found.`);
            return res.status(404).json({ message: 'Education not found.', success: false });
        }

        // Update the education
        user.education[educationIndex] = { ...user.education[educationIndex]._doc, ...updatedEducation };

        await user.save();

        console.log("Edited education:", user.education);

        return res.status(200).json({
            message: 'Education updated successfully.',
            success: true,
            education: user.education,
        });
    } catch (error) {
        console.error("Error occurred during the edit process:", error);
        return res.status(500).json({
            message: 'Internal server error.',
            success: false,
        });
    }
};
export const deleteEducation = async (req, res) => {
    try {
        const userId = req.id;
        const educationId = req.params.id;

        const user = await DigitalMarketer.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        user.education = user.education.filter((edu) => edu._id.toString() !== educationId);
        await user.save();

        res.status(200).json({ message: 'Education deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// Add Campaign
export const addCampaign = async (req, res) => {
    try {
        const userId = req.id; // User ID from authentication middleware
        const { title, description } = req.body;
        const images = req.files; // Multer handles multiple file uploads

        // Validate title and description
        if (!title || !description) {
            return res.status(400).json({ message: 'Title and description are required.', success: false });
        }

        // Upload images to S3
        let imageUrls = [];
        if (images && images.length > 0) {
            const uploadResponses = await Promise.all(images.map((file) => uploadCampaignImages(file)));
            // Extract only the Location (URL) from each response
            imageUrls = uploadResponses.map((response) => response.Location);
        }

        // Find the user and validate
        const user = await DigitalMarketer.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.', success: false });
        }

        // Create the new campaign object
        const newCampaign = {
            title,
            description,
            images: imageUrls, // Ensure only URLs are stored
        };

        // Add the new campaign to the user's campaigns array
        user.campaigns.push(newCampaign);

        // Save the updated user
        await user.save();

        // Respond with success
        return res.status(201).json({
            message: 'Campaign added successfully.',
            success: true,
            campaigns: user.campaigns,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error.', success: false });
    }
};
export const editCampaign = async (req, res) => {
    try {
        const userId = req.id;
        const { campaignId, title, description, replaceImages, removedImages } = req.body;

        const images = req.files;

        // Validate campaignId
        if (!campaignId || !mongoose.Types.ObjectId.isValid(campaignId)) {
            return res.status(400).json({ message: 'Valid campaign ID is required.', success: false });
        }

        const user = await DigitalMarketer.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.', success: false });
        }

        const campaign = user.campaigns.id(campaignId);
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found.', success: false });
        }

        // Update title and description
        if (title) campaign.title = title;
        if (description) campaign.description = description;

        // Handle removed images
        if (removedImages && Array.isArray(removedImages)) {
            const removedImageUrls = new Set(removedImages);

            // Filter out removed images from campaign
            campaign.images = campaign.images.filter((img) => !removedImageUrls.has(img));

            // Delete the images from S3
            await Promise.all(removedImages.map((imgUrl) => deleteCampaignImage(imgUrl)));
        }

        // Handle new images
        let imageUrls = [];
        if (images && images.length > 0) {
            const uploadResponses = await Promise.all(images.map((file) => uploadCampaignImages(file)));
            imageUrls = uploadResponses.map((response) => response.Location);

            if (replaceImages) {
                campaign.images = [...imageUrls];
            } else {
                campaign.images.push(...imageUrls);
            }
        }

        // Save the updated campaign
        await user.save();

        res.status(200).json({ message: 'Campaign updated successfully.', success: true });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.', success: false });
    }
};
export const deleteCampaign = async (req, res) => {
    try {
        const userId = req.id;
        const { campaignId } = req.body;

        const user = await DigitalMarketer.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.', success: false });
        }

        user.campaigns = user.campaigns.filter((campaign) => campaign._id.toString() !== campaignId);

        await user.save();

        return res.status(200).json({
            message: 'Campaign deleted successfully.',
            success: true,
            campaigns: user.campaigns,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error.', success: false });
    }
};
const sanitizeKey = (key) => {
    if (typeof key !== "string" || !key.trim()) {
        console.warn(`Skipping invalid key: ${key}`);
        return null;
    }
    return key.trim();
};

export const listAllCampaigns = async (req, res) => {
    try {
        console.log("Fetching users and their campaigns...");

        const users = await DigitalMarketer.find({}, "campaigns");
        console.log(`Retrieved ${users.length} users with campaigns.`);

        const allCampaigns = await Promise.all(
            users.map(async (user) => {
                console.log(`Processing user with ID: ${user._id}`);
                const campaigns = user.campaigns || [];
                console.log(`Found ${campaigns.length} campaigns for user ${user._id}.`);

                return await Promise.all(
                    campaigns.map(async (campaign) => {
                        console.log(`Processing campaign with ID: ${campaign._id}`);

                        const imageKeys = campaign.images || [];
                        console.log(`Found ${imageKeys.length} images for campaign ${campaign._id}.`);

                        // Sanitize and filter invalid keys
                        const sanitizedKeys = imageKeys.map(sanitizeKey).filter(Boolean);
                        console.log(`Sanitized image keys. Valid keys: ${sanitizedKeys.length}`);

                        // Generate presigned URLs for valid keys
                        const imageUrls = await Promise.all(
                            sanitizedKeys.map(async (imageKey) => {
                                try {
                                    console.log(`Generating presigned URL for image key: ${imageKey}`);
                                    return await getObjectURL2(imageKey);
                                } catch (error) {
                                    console.error(`Error generating URL for image ${imageKey}:`, error);
                                    return null;
                                }
                            })
                        );
                        console.log(`Generated URLs for ${imageUrls.filter(Boolean).length} valid images.`);

                        return {
                            id: campaign._id,
                            title: campaign.title,
                            description: campaign.description,
                            images: imageUrls.filter(Boolean), // Exclude failed URLs
                            createdAt: campaign.createdAt,
                            updatedAt: campaign.updatedAt,
                        };
                    })
                );
            })
        );

        const flattenedCampaigns = allCampaigns.flat();
        console.log(`Total campaigns retrieved: ${flattenedCampaigns.length}`);

        return res.status(200).json({
            message: "All campaigns retrieved successfully.",
            success: true,
            campaigns: flattenedCampaigns,
        });
    } catch (error) {
        console.error("Error in listAllCampaigns:", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
        });
    }
};
// View individual profile
export const viewProfile = async (req, res) => {
    try {
        const userId = req.params.id; // Assuming user ID is passed as a route parameter

        const user = await DigitalMarketer.findById(userId).select('-password'); // Exclude password from response
        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
                success: false,
            });
        }

        const profilePhotoURL = user.profile.profilePhoto
            ? await getObjectURL(user.profile.profilePhoto) // Generate a presigned URL
            : null;

        return res.status(200).json({
            message: 'Profile retrieved successfully.',
            success: true,
            profile: {
                ...user.profile,
                profilePhoto: profilePhotoURL,
                experiences: user.experiences,
                education: user.education,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error.',
            success: false,
        });
    }
};
// Get all profiles
export const getAllProfiles = async (req, res) => {
    try {
        const { fullname, location, website, agencyName } = req.query;
        const filters = {};

        if (fullname) filters['profile.fullname'] = { $regex: fullname, $options: 'i' };
        if (location) filters['profile.location'] = { $regex: location, $options: 'i' };
        if (website) filters['profile.website'] = { $regex: website, $options: 'i' };
        if (agencyName) filters['profile.agencyName'] = { $regex: agencyName, $options: 'i' };

        const loggedInUserId = req.id;
        const users = await DigitalMarketer.find(filters).select('-password');

        // Fetch profile photos in parallel to reduce waiting time
        const profilePromises = users.map(async (user) => {
            const profilePhotoURL = user.profile.profilePhoto
                ? await getObjectURL(user.profile.profilePhoto)
                : null;

            return {
                id: user._id,
                fullname: user.profile.fullname,
                agencyName: user.profile.agencyName,
                location: user.profile.location,
                website: user.profile.website,
                followers: user.followers.length,
                following: user.following.length,
                isFollowing: loggedInUserId ? user.followers.includes(loggedInUserId) : false,
                profilePhoto: profilePhotoURL,
            };
        });

        const profiles = await Promise.all(profilePromises);

        // Separate profiles with and without photos
        let profilesWithPhoto = profiles.filter(p => p.profilePhoto);
        let profilesWithoutPhoto = profiles.filter(p => !p.profilePhoto);

        // Shuffle both arrays randomly
        const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);
        profilesWithPhoto = shuffleArray(profilesWithPhoto);
        profilesWithoutPhoto = shuffleArray(profilesWithoutPhoto);

        // Merge lists: first profiles with photos, then without
        const sortedProfiles = [...profilesWithPhoto, ...profilesWithoutPhoto];

        res.status(200).json({
            success: true,
            message: 'Profiles retrieved successfully.',
            profiles: sortedProfiles,
        });
    } catch (error) {
        console.error('Error fetching profiles:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};
export const getAllEmailsAdmin = async (req, res) => {
    try {
        const users = await DigitalMarketer.find().select('email');
        const emails = users.map(user => user.email).filter(email => email);
        return res.status(200).json({
            success: true,
            message: 'Emails retrieved successfully.',
            emails
        });
    } catch (error) {
        console.error('Error fetching emails:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
};
export const getRandomSuggestedProfiles = async (req, res) => {
    try {
        // Fetch users with 'profile.suggested' set to true
        const users = await DigitalMarketer.find({ 'profile.suggested': true }).select('-password');
        if (!users || !Array.isArray(users)) {
            return res.status(404).json({
                message: 'No suggested profiles found.',
                success: false,
            });
        }

        let selectedUsers;
        if (users.length <= 5) {
            // If there are 5 or fewer profiles, return all without randomizing
            selectedUsers = users;
        } else {
            // If more than 5 profiles, shuffle and select 5
            selectedUsers = users.sort(() => 0.5 - Math.random()).slice(0, 5);
        }

        // Format the response with profile photo logic
        const profiles = await Promise.all(selectedUsers.map(async (user) => {
            const profilePhotoURL = user.profile?.profilePhoto
                ? await getObjectURL(user.profile.profilePhoto)
                : 'default.jpg'; // Fallback to default photo if none exists

            return {
                id: user._id,
                fullname: user.profile?.fullname || 'N/A',
                agencyName: user.profile?.agencyName || 'N/A',
                location: user.profile?.location || 'N/A',
                profilePhoto: profilePhotoURL,
            };
        }));

        return res.status(200).json({
            message: 'Suggested profiles retrieved successfully.',
            success: true,
            profiles,
        });
    } catch (error) {
        // Handle CastError specifically
        if (error.name === 'CastError') {
            return res.status(400).json({
                message: `Invalid ID format: ${error.stringValue}`,
                success: false,
            });
        }

        // Generic server error
        return res.status(500).json({
            message: 'Internal server error.',
            success: false,
        });
    }
};

export const getAllProfilesAdmin = async (req, res) => {
    try {
        const users = await DigitalMarketer.find().select('-password');

        // Calculate analytics
        const totalUsers = users.length;
        const totalAgencies = new Set(users.map(user => user.profile.agencyName)).size;
        const suggestedCount = users.filter(user => user.profile.suggested).length;
        const totalFollowers = users.reduce((sum, user) => sum + user.followers.length, 0);
        const totalFollowing = users.reduce((sum, user) => sum + user.following.length, 0);

        // Get top locations
        const locationCount = users.reduce((acc, user) => {
            acc[user.profile.location] = (acc[user.profile.location] || 0) + 1;
            return acc;
        }, {});
        const topLocations = Object.entries(locationCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([location, count]) => ({ location, count }));

        return res.status(200).json({
            message: 'All profiles retrieved successfully.',
            success: true,
            analytics: {
                totalUsers,
                totalAgencies,
                suggestedCount,
                totalFollowers,
                totalFollowing,
                topLocations
            },
            profiles: users.map(user => ({
                id: user._id,
                fullname: user.profile.fullname,
                agencyName: user.profile.agencyName,
                location: user.profile.location,
                suggested: user.profile.suggested,
                email: user.email
            })),
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error.',
            success: false,
        });
    }
};

export const updateSuggestedStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await DigitalMarketer.findById(id);

        if (!user) {
            return res.status(404).json({
                message: 'Profile not found.',
                success: false,
            });
        }

        user.profile.suggested = !user.profile.suggested; // Toggle the status
        await user.save();

        return res.status(200).json({
            message: 'Suggested status updated successfully.',
            success: true,
            suggested: user.profile.suggested,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error.',
            success: false,
        });
    }
};

export const followUser = async (req, res) => {
    try {
        const { userId, followId } = req.body;

        if (!userId || !followId) {
            return res.status(400).json({
                message: 'Invalid request. User IDs are required.',
                success: false,
            });
        }

        const user = await DigitalMarketer.findById(userId);
        const followUser = await DigitalMarketer.findById(followId);

        if (!user || !followUser) {
            return res.status(404).json({
                message: 'User not found.',
                success: false,
            });
        }

        // Use atomic operations to update both documents
        const userUpdate = DigitalMarketer.updateOne(
            { _id: userId },
            { $addToSet: { following: followId } }
        );

        const followUserUpdate = DigitalMarketer.updateOne(
            { _id: followId },
            { $addToSet: { followers: userId } }
        );

        await Promise.all([userUpdate, followUserUpdate]);

        return res.status(200).json({
            message: 'User followed successfully.',
            success: true,
        });
    } catch (error) {
        console.error('Error in followUser:', error);
        return res.status(500).json({
            message: 'Internal server error.',
            success: false,
        });
    }
};

export const getFollowers = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await DigitalMarketer.findById(userId).populate('followers', 'profile.fullname profile.agencyName profile.location');

        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
                success: false,
            });
        }

        return res.status(200).json({
            message: 'Followers retrieved successfully.',
            success: true,
            followers: user.followers.map(follower => ({
                id: follower._id,
                fullname: follower.profile.fullname,
                agencyName: follower.profile.agencyName,
                location: follower.profile.location,
            })),
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error.',
            success: false,
        });
    }
};