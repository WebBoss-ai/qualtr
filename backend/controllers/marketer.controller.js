import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { DigitalMarketer } from '../models/DigitalMarketer.js';
import { uploadMarketerProfilePhoto, uploadCampaignImages, getObjectURL, deleteCampaignImage } from '../utils/aws.js';
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

        return res.status(200)
            .cookie("token", token, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' })
            .json({
                message: 'Login successful.',
                success: true,
                token,
                _id: user._id,
            });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error.',
            success: false
        });
    }
};

// Update user profile
export const updateProfile = async (req, res) => {
    try {
        const userId = req.id; // Assuming user ID is provided via authentication middleware
        const { fullname, phoneNumber, agencyName, bio, skills, location } = req.body;
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

        console.log('New Campaign:', newCampaign); // Debugging log

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
        console.error('Error adding campaign:', error);
        return res.status(500).json({ message: 'Internal server error.', success: false });
    }
};
export const editCampaign = async (req, res) => {
    try {
        console.log("Edit campaign API hit");
        console.log("Request body:", req.body);

        const userId = req.id;
        const { campaignId, title, description, replaceImages } = req.body;
        const images = req.files;

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

        if (title) campaign.title = title;
        if (description) campaign.description = description;

        let imageUrls = [];
        if (images && images.length > 0) {
            const uploadResponses = await Promise.all(images.map((file) => uploadCampaignImages(file)));
            imageUrls = uploadResponses.map((response) => response.Location);

            if (replaceImages === 'true') {
                if (campaign.images && campaign.images.length > 0) {
                    await Promise.all(campaign.images.map((existingImage) => deleteCampaignImage(existingImage)));
                }
                campaign.images = imageUrls;
            } else {
                campaign.images = [...campaign.images, ...imageUrls].slice(0, 10);
            }
        }

        await user.save();

        return res.status(200).json({
            message: 'Campaign updated successfully.',
            success: true,
            campaigns: user.campaigns,
        });
    } catch (error) {
        console.error('Error editing campaign:', error);
        return res.status(500).json({
            message: 'Internal server error. Please try again later.',
            success: false,
        });
    }
};
export const deleteCampaign = async (req, res) => {
    try {
        const userId = req.id;
        const { campaignId } = req.params;

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
        console.error(error);
        return res.status(500).json({ message: 'Internal server error.', success: false });
    }
};
export const listAllCampaigns = async (req, res) => {
    try {
        // Fetch all users with their campaigns
        const users = await DigitalMarketer.find({}, 'campaigns'); // Only fetch campaigns field

        // Extract and format all campaigns
        const allCampaigns = [];
        for (const user of users) {
            for (const campaign of user.campaigns) {
                const imageUrls = await Promise.all(
                    campaign.images.map((imageKey) => getObjectURL(imageKey)) // Generate presigned URLs
                );

                allCampaigns.push({
                    id: campaign._id,
                    title: campaign.title,
                    description: campaign.description,
                    images: imageUrls, // Replace S3 keys with presigned URLs
                    createdAt: campaign.createdAt,
                    updatedAt: campaign.updatedAt,
                });
            }
        }

        return res.status(200).json({
            message: 'All campaigns retrieved successfully.',
            success: true,
            campaigns: allCampaigns,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error.',
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
        const users = await DigitalMarketer.find().select('-password'); // Exclude password from response

        return res.status(200).json({
            message: 'All profiles retrieved successfully.',
            success: true,
            profiles: users.map(user => ({
                id: user._id,
                fullname: user.profile.fullname,
                agencyName: user.profile.agencyName,
                location: user.profile.location
            }))
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error.',
            success: false
        });
    }
};
