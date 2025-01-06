import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { DigitalMarketer } from '../models/DigitalMarketer.js';

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
        const { fullname, phoneNumber, agencyName, bio, skills, location, profilePhoto } = req.body;
        const userId = req.id; // Assuming user ID is provided via authentication middleware
        console.log(userId)
        // Find user by ID
        const user = await DigitalMarketer.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
                success: false
            });
        }

        // Update user profile
        user.profile.fullname = fullname || user.profile.fullname;
        user.profile.phoneNumber = phoneNumber || user.profile.phoneNumber;
        user.profile.agencyName = agencyName || user.profile.agencyName;
        user.profile.bio = bio || user.profile.bio;
        user.profile.skills = skills || user.profile.skills;
        user.profile.location = location || user.profile.location;
        user.profile.profilePhoto = profilePhoto || user.profile.profilePhoto;

        user.isProfileComplete = true;
        await user.save();

        return res.status(200).json({
            message: 'Profile updated successfully.',
            success: true,
            profile: user.profile
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error.',
            success: false
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
                success: false
            });
        }

        return res.status(200).json({
            message: 'Profile retrieved successfully.',
            success: true,
            profile: user.profile
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error.',
            success: false
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
