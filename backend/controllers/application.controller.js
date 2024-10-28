import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { uploadFileToS3, getObjectURL } from '../utils/aws.js'; // Import the AWS S3 upload function

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;  // Assuming this comes from a decoded token or session
        const jobId = req.params.id;
        const { whyYou, budget } = req.body;  // Extract whyYou and budget from the request body
        const proposalFile = req.file;  // Multer adds the file to the request

        if (!jobId) {
            return res.status(400).json({
                message: "Project ID is required.",
                success: false
            });
        }

        if (!whyYou) {
            return res.status(400).json({
                message: "Why you? field is required.",
                success: false
            });
        }

        if (!budget) {
            return res.status(400).json({
                message: "Budget is required.",
                success: false
            });
        }

        // Check if the user has already applied for the job
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job.",
                success: false
            });
        }

        // Check if the job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Project not found.",
                success: false
            });
        }

        // Upload the proposal file to AWS S3 if a file is provided
        let uploadedProposalUrl = null;
        let uploadedProposalKey = null;
        if (proposalFile) {
            // Upload the file to S3
            const s3Response = await uploadFileToS3(proposalFile);
            uploadedProposalKey = `requirement_docs/${proposalFile.originalname}`; // Store only the key, not the full URL
        }

        // Create a new application with the S3 file URL and the new fields
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
            whyYou,
            budget,
            proposal: uploadedProposalKey || null  // Store the key instead of the full URL
        });

        // Add application reference to the job
        job.applications.push(newApplication._id);
        await job.save();

        return res.status(201).json({
            message: "Bid placed successfully.",
            success: true,
            application: newApplication
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const application = await Application.find({ applicant: userId }).sort({ createdAt: -1 }).populate({
            path: 'job',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'company',
                options: { sort: { createdAt: -1 } },
            }
        });
        if (!application) {
            return res.status(404).json({
                message: "No Applications",
                success: false
            })
        };
        return res.status(200).json({
            application,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
// admin dekhega kitna user ne apply kiya hai
export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: 'applications',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'applicant',
            },
        });

        if (!job) {
            return res.status(404).json({
                message: 'Job not found.',
                success: false,
            });
        }

        // Loop through each application to generate the presigned URL for the proposal
        const applicationsWithProposalURL = await Promise.all(
            job.applications.map(async (application) => {
                if (application.proposal) {
                    // Pass only the key to getObjectURL (e.g., 'requirement_docs/your_file.pdf')
                    const proposalUrl = await getObjectURL(application.proposal);
                    return { ...application.toObject(), proposalUrl };
                }
                return application.toObject();
            })
        );


        return res.status(200).json({
            job: { ...job.toObject(), applications: applicationsWithProposalURL },
            success: true,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server error',
            success: false,
        });
    }
};


export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;
        if (!status) {
            return res.status(400).json({
                message: 'status is required',
                success: false
            })
        };

        // find the application by applicantion id
        const application = await Application.findOne({ _id: applicationId });
        if (!application) {
            return res.status(404).json({
                message: "Application not found.",
                success: false
            })
        };

        // update the status
        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message: "Status updated successfully.",
            success: true
        });

    } catch (error) {
        console.log(error);
    }
}