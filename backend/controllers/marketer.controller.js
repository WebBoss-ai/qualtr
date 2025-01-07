import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { DigitalMarketer } from '../models/DigitalMarketer.js';
import { uploadMarketerProfilePhoto, getObjectURL } from '../utils/aws.js';

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

        console.log("Debug: Received userId:", userId);
        console.log("Debug: Received experiences:", JSON.stringify(experiences, null, 2));

        if (!userId) {
            console.error("Debug: User ID is missing in the request.");
            return res.status(400).json({ message: 'User ID is required.', success: false });
        }

        if (!experiences) {
            console.error("Debug: Experiences are missing in the request.");
            return res.status(400).json({ message: 'Experiences data is required.', success: false });
        }

        const user = await DigitalMarketer.findById(userId);
        if (!user) {
            console.error(`Debug: User with ID ${userId} not found.`);
            return res.status(404).json({ message: 'User not found.', success: false });
        }

        console.log("Debug: Existing user data before update:", JSON.stringify(user, null, 2));

        // Handle experiences
        const existingExperiences = user.experiences || [];
        console.log("Debug: Existing experiences:", JSON.stringify(existingExperiences, null, 2));

        // Update existing or add new experiences
        experiences.forEach((exp) => {
            if (exp._id) {
                // Update existing experience
                const index = existingExperiences.findIndex((e) => e._id.toString() === exp._id);
                if (index !== -1) {
                    console.log(`Debug: Updating experience with ID ${exp._id}`);
                    existingExperiences[index] = { ...existingExperiences[index], ...exp };
                } else {
                    console.warn(`Debug: Experience ID ${exp._id} not found in existing experiences.`);
                }
            } else {
                // Add new experience
                console.log("Debug: Adding new experience:", JSON.stringify(exp, null, 2));
                existingExperiences.push(exp);
            }
        });

        // Remove deleted experiences
        const incomingIds = experiences.filter((exp) => exp._id).map((exp) => exp._id.toString());
        console.log("Debug: Incoming experience IDs:", incomingIds);

        user.experiences = existingExperiences.filter((e) =>
            incomingIds.includes(e._id?.toString())
        );

        console.log("Debug: Final experiences to save:", JSON.stringify(user.experiences, null, 2));

        await user.save();

        console.log("Debug: Updated user data after save:", JSON.stringify(user, null, 2));

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
