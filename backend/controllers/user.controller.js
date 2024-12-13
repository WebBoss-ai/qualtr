import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import CompareList from "../models/CompareList.js";

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
         
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        const file = req.file;
        if (!file) {
            return res.status(400).json({
                message: "Logo is required. Please upload an image.",
                success: false,
            });
        }
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exist with this email.',
                success: false,
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile:{
                profilePhoto:cloudResponse.secure_url,
            }
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false
            });
        }

        // Check if role matches
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            });
        }

        const tokenData = { userId: user._id };
        const token = await jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '30d' });

        // Prepare the user object for the response
        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        // Send the token in both the cookie and the response body
        return res.status(200)
            .cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' })
            .json({
                message: `Welcome back ${user.fullname}`,
                user,
                token, // Include the token in the response body
                success: true
            });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', success: false });
    }
};

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills, agencyName, slogan, location, overview, numberOfEmployees, yearFounded, servicesOffered, expertise, industries, pastClients } = req.body;

        const file = req.file;
        const fileUri = file ? getDataUri(file) : null;
        let cloudResponse = null;
        if (fileUri) {
            cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        }

        // If the values are already arrays, there's no need to split them.
        let skillsArray = Array.isArray(skills) ? skills : skills ? skills.split(",") : [];
        let servicesArray = Array.isArray(servicesOffered) ? servicesOffered : servicesOffered ? servicesOffered.split(",") : [];
        let expertiseArray = Array.isArray(expertise) ? expertise : expertise ? expertise.split(",") : [];
        let industriesArray = Array.isArray(industries) ? industries : industries ? industries.split(",") : [];
        let pastClientsArray = Array.isArray(pastClients) ? pastClients : pastClients ? pastClients.split(",") : [];

        const userId = req.id; // Assuming middleware sets the authenticated user ID
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            });
        }

        // Update fields if provided
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skillsArray.length > 0) user.profile.skills = skillsArray;
        if (agencyName) user.profile.agencyName = agencyName;
        if (slogan) user.profile.slogan = slogan;
        if (location) user.profile.location = location;
        if (overview) user.profile.overview = overview;
        if (numberOfEmployees) user.profile.numberOfEmployees = numberOfEmployees;
        if (yearFounded) user.profile.yearFounded = yearFounded;
        if (servicesArray.length > 0) user.profile.servicesOffered = servicesArray;
        if (expertiseArray.length > 0) user.profile.expertise = expertiseArray;
        if (industriesArray.length > 0) user.profile.industries = industriesArray;
        if (pastClientsArray.length > 0) user.profile.pastClients = pastClientsArray;

        // Resume upload handling
        if (cloudResponse) {
            user.profile.resume = cloudResponse.secure_url; // Save Cloudinary URL
            user.profile.resumeOriginalName = file.originalname; // Save original file name
        }

        await user.save();

        // Return updated user
        return res.status(200).json({
            message: "Profile updated successfully.",
            user: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
                profile: user.profile
            },
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};
// Get all agencies (users with role 'student')
export const getAllJobSeekers = async (req, res) => {
    try {
        // Debug: Log the start of the function
        console.log("Fetching agencies...");

        // Attempt to find agencies (users with role 'student')
        const jobSeekers = await User.find({ role: 'student' }).select('fullname email profile profilePhoto');
        
        // Debug: Check if the query returned anything
        console.log("agencies found:", jobSeekers);

        // If no agencies were found, log this and return a response
        if (!jobSeekers || jobSeekers.length === 0) {
            console.log("No agencies found.");
            return res.status(404).json({
                success: false,
                message: "No agencies found",
            });
        }

        // Success response with agencies
        res.status(200).json({
            success: true,
            jobSeekers,
        });

        // Debug: Confirm success response sent
        console.log("agencies successfully fetched and sent in response");

    } catch (error) {
        // Log the exact error encountered
        console.error("Error occurred while fetching agencies:", error);

        // Send error response
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// Get a single job seeker's profile by ID
export const getJobSeekerProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const jobSeeker = await User.findById(id).select('fullname email phoneNumber profile');
        if (!jobSeeker) {
            return res.status(404).json({
                success: false,
                message: "Agencies not found",
            });
        }
        res.status(200).json({
            success: true,
            jobSeeker,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

export const updateAgencyProfile = async (req, res) => {
    try {
        // Log the incoming request body
        console.log("Incoming request body:", req.body);
        // Destructure data from the request body
        const { fullname, email, phoneNumber, bio, skills, agencyName, slogan, location, overview, numberOfEmployees, budgetRangeMin, budgetRangeMax, servicesOffered, expertise, industries, portfolio, pastClients, awards, yearFounded } = req.body;
        const userId = req.id; // Get the user ID from middleware authentication
        console.log("Authenticated user ID:", userId);
        // Fetch user from the database
        let user = await User.findById(userId);
        console.log("Fetched user from DB:", user);
        // Check if the user exists
        if (!user) {
            console.log("User not found for ID:", userId);
            return res.status(400).json({
                message: "User not found.",
                success: false
            });
        }
        // Log each field update before applying it
        if (fullname) {
            console.log("Updating fullname:", fullname);
            user.fullname = fullname;
        }
        if (email) {
            console.log("Updating email:", email);
            user.email = email;
        }
        if (phoneNumber) {
            console.log("Updating phoneNumber:", phoneNumber);
            user.phoneNumber = phoneNumber;
        }
        if (bio) {
            console.log("Updating bio:", bio);
            user.profile.bio = bio;
        }
        if (skills) {
            console.log("Updating skills:", skills);
            user.profile.skills = skills.split(",");
        }

        // Updating agency-related fields
        if (agencyName) {
            console.log("Updating agencyName:", agencyName);
            user.profile.agencyName = agencyName;
        }
        if (slogan) {
            console.log("Updating slogan:", slogan);
            user.profile.slogan = slogan;
        }
        if (location) {
            console.log("Updating location:", location);
            user.profile.location = location;
        }
        if (overview) {
            console.log("Updating overview:", overview);
            user.profile.overview = overview;
        }
        if (numberOfEmployees) {
            console.log("Updating numberOfEmployees:", numberOfEmployees);
            user.profile.numberOfEmployees = numberOfEmployees;
        }
        if (budgetRangeMin && budgetRangeMax) {
            console.log("Updating budget range:", { min: budgetRangeMin, max: budgetRangeMax });
            user.profile.budgetRange = { min: budgetRangeMin, max: budgetRangeMax };
        }
        if (servicesOffered) {
            console.log("Updating servicesOffered:", servicesOffered);
            user.profile.servicesOffered = servicesOffered.split(",");
        }
        if (expertise) {
            console.log("Updating expertise:", expertise);
            user.profile.expertise = expertise.split(",").slice(0, 5); // Limit to 5 services
        }
        if (industries) {
            console.log("Updating industries:", industries);
            user.profile.industries = industries.split(",");
        }

        // Portfolio update (expects an array of objects)
        if (portfolio && Array.isArray(portfolio)) {
            console.log("Updating portfolio:", portfolio);
            user.profile.portfolio = portfolio;
        }

        // Past Clients update
        if (pastClients) {
            console.log("Updating pastClients:", pastClients);
            user.profile.pastClients = pastClients.split(",");
        }

        // Awards update (expects an array of award objects)
        if (awards && Array.isArray(awards)) {
            console.log("Updating awards:", awards);
            user.profile.awards = awards;
        }

        // Year Founded update
        if (yearFounded) {
            console.log("Updating yearFounded:", yearFounded);
            user.profile.yearFounded = yearFounded;
        }

        // Save the updated profile
        await user.save();
        console.log("Profile updated successfully for user ID:", userId);

        return res.status(200).json({
            message: "Agency profile updated successfully.",
            user,
            success: true
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({
            message: "An error occurred while updating the profile.",
            success: false,
            error: error.message // Return error message in response for further debugging
        });
    }
};


export const addPortfolio = async (req, res) => {
    try {
        const { userId, portfolio, editIndex } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // If editIndex is provided, update existing portfolio
        if (editIndex !== null && editIndex !== undefined) {
            user.profile.portfolio[editIndex] = portfolio;
        } else {
            // Else, add new portfolio
            user.profile.portfolio.push(portfolio);
        }

        await user.save();
        return res.status(200).json({ success: true, message: "Portfolio saved successfully", user });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error saving portfolio", error: error.message });
    }
};

// Delete Portfolio Controller
export const deletePortfolio = async (req, res) => {
    try {
        const { userId, portfolioIndex } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Remove portfolio at specified index
        user.profile.portfolio.splice(portfolioIndex, 1);
        await user.save();
        return res.status(200).json({ success: true, message: "Portfolio deleted successfully", user });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error deleting portfolio", error: error.message });
    }
};

export const getUsersByRole = async (req, res) => {
    try {
        const users = await User.find({ role: { $in: ['student', 'recruiter'] } })
            .select("fullname email phoneNumber role createdAt")
            .sort({ createdAt: -1 }); // Sort by joined date in descending order
        return res.status(200).json({
            success: true,
            users,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching users.",
        });
    }
};

export const addToCompare = async (req, res) => {
    const { agencyId } = req.body; // Only agencyId is needed
    const userId = req.id; // Retrieved from the middleware

    // Debugging: Check if userId is available
    console.log("User ID from token:", userId);

    try {
        // Check if agencyId is provided
        if (!agencyId) {
            console.log("Agency ID is missing in the request body");
            return res.status(400).json({ success: false, message: "Agency ID is required." });
        }

        // Fetch the current compare list for the user
        let compareList = await CompareList.findOne({ userId });

        // Debugging: Check if compareList is found
        console.log("Compare list found for user:", compareList);

        if (!compareList) {
            // If no compare list exists, create a new one
            console.log("No compare list found for user, creating new compare list.");
            compareList = new CompareList({ userId, agencies: [] });
        }

        // Debugging: Log the current agencies in the compare list
        console.log("Current agencies in compare list:", compareList.agencies);

        // Check if the agency is already in the compare list
        if (compareList.agencies.includes(agencyId)) {
            console.log("Agency already in compare list:", agencyId);
            return res.status(400).json({ success: false, message: "Agency already in compare list." });
        }

        // Add the agency to the compare list
        compareList.agencies.push(agencyId);

        // Save the updated compare list
        await compareList.save();

        // Debugging: Confirm the agency is added to the compare list
        console.log("Updated compare list:", compareList.agencies);

        res.status(200).json({ success: true, message: "Agency added to compare list." });
    } catch (error) {
        console.error("Error adding to compare list:", error);

        // Send a server error response if something fails
        res.status(500).json({ success: false, message: "Server error." });
    }
};


export const getCompareList = async (req, res) => {
    const userId = req.id; // Retrieved from the middleware

    try {
        const compareList = await CompareList.findOne({ userId }).populate("agencies", "fullname email profilePhoto profile");

        if (!compareList) {
            return res.status(404).json({ success: false, message: "Compare list not found." });
        }

        res.status(200).json({ success: true, compareList: compareList.agencies });
    } catch (error) {
        console.error("Error fetching compare list:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};
