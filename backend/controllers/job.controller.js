import { Job } from "../models/job.model.js";
import cloudinary from "../utils/cloudinary.js"; // Import the cloudinary setup
import { uploadFileToCompaniesDoc, getObjectURL } from '../utils/aws.js';
// admin post krega job
export const postJob = async (req, res) => {
    try {
        const { title, description, category, salary, timeline, companyId } = req.body;

        // Debugging userId extraction
        const userId = req.id;
        console.log("Extracted userId:", userId); // Log the extracted user ID to check if it's being set

        // Debug input values
        console.log("Request Body:", req.body);
        console.log("File Received:", req.file); // Check if the file is properly received
        console.log("Company ID:", companyId);

        // Check if any required field is missing
        if (!title || !description || !category || !salary || !timeline || !req.file || !companyId) {
            console.log("Missing Fields"); // Log missing fields
            return res.status(400).json({
                message: "Something is missing.",
                success: false
            });
        };

        // Upload the file to AWS S3 and get the file key
        console.log("Uploading file to AWS S3...");
        const s3Response = await uploadFileToCompaniesDoc(req.file);  // Use the S3 upload function

        // Get only the key (e.g., "companies_doc/filename.pdf") from S3 response
        const uploadedFileKey = `companies_doc/${req.file.originalname}`;

        // Creating the job
        console.log("Creating the Project Document...");
        const job = await Job.create({
            title,
            description,
            category: category.split(","), // Split category into an array
            salary: Number(salary), // Ensure salary is a number
            timeline,
            requirement_doc: uploadedFileKey,  // Save only the S3 key in the database
            company: companyId,
            created_by: userId // User ID is essential for created_by
        });

        console.log("Project Created Successfully:", job); // Log the created job details

        return res.status(201).json({
            message: "New Project created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.log("Error during project creation:", error); // Log the error in the console for debugging
        return res.status(500).json({ message: "Server error", success: false });
    }
};



// Other functions remain the same

// student k liye
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };
        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({ createdAt: -1 });
        if (!jobs) {
            return res.status(404).json({
                message: "Projects not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}


export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId)
            .populate({
                path: "applications"
            })
            .populate({
                path: "company",
                select: "name description location logo"
            });

        if (!job) {
            return res.status(404).json({
                message: "Project not found.",
                success: false
            });
        }

        // Generate a presigned URL for the requirement document
        const presignedUrl = await getObjectURL(job.requirement_doc);
        console.log(presignedUrl)
        return res.status(200).json({
            job,
            documentUrl: presignedUrl, // Include the presigned URL in the response
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

// admin kitne job create kra hai abhi tk
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path: 'company',
        });

        if (!jobs || jobs.length === 0) {
            return res.status(404).json({
                message: "Projects not found.",
                success: false
            });
        }

        const reversedJobs = jobs.reverse();

        return res.status(200).json({
            jobs: reversedJobs,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

export const getJobsByCategory = async (req, res) => {
    try {
        const { category } = req.query;  // Get the category from the query string
        if (!category) {
            return res.status(400).json({ success: false, message: "Category is required" });
        }

        const jobs = await Job.find({ category: { $in: [category] } }).populate('company');

        if (!jobs || jobs.length === 0) {
            return res.status(404).json({ success: false, message: "No projects found in this category" });
        }

        return res.status(200).json({ success: true, jobs });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error fetching projects by category", error });
    }
};