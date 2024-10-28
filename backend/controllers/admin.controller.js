import User from '../models/user.model.js';
import Job from '../models/job.model.js';
import { Application } from "../models/application.model.js";
import { Company } from "../models/company.model.js";
import { Message } from "../models/message.model.js";

export const getAdminDashboard = async (req, res) => {
    try {
        console.log("Admin dashboard request initiated");
        console.log("Request User:", req.user); 

        
        // Fetch platform statistics
        const [
            totalUsers,
            totalCompanies,
            totalJobSeekers,
            totalJobs,
            totalApplications,
            totalMessages // Assuming messages are managed through another model not shown here
        ] = await Promise.all([
            User.countDocuments({}), // Total users
            Company.countDocuments({}), // Total companies
            User.countDocuments({ role: 'student' }), // Total job seekers
            Job.countDocuments({}), // Total jobs
            Application.countDocuments({}), // Total applications
            // Message.countDocuments({}) // Uncomment if you have a Message model defined
        ]);

        // Fetch recent activities
        const recentUsers = await User.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .select('fullname email role createdAt');

        const recentJobs = await Job.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .select('title company createdAt')
            .populate('company', 'name');

      

        const recentMessages = await Message.find({}) // Assuming messages are managed through another model not shown here
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('sender', 'fullname email');

        // Detailed stats for job applications by job
        const jobsWithApplicationCount = await Job.aggregate([
            {
                $lookup: {
                    from: 'applications',
                    localField: '_id',
                    foreignField: 'job',
                    as: 'applications',
                },
            },
            {
                $addFields: {
                    applicationCount: { $size: '$applications' },
                },
            },
            {
                $sort: { applicationCount: -1 },
            },
            {
                $limit: 5, // Fetch top 5 jobs by application count
            },
            {
                $project: {
                    title: 1,
                    company: 1,
                    applicationCount: 1,
                },
            },
        ]);

        // Detailed list of top companies by job postings
        const companiesWithJobCount = await Company.aggregate([
            {
                $lookup: {
                    from: 'jobs',
                    localField: '_id',
                    foreignField: 'company',
                    as: 'jobs',
                },
            },
            {
                $addFields: {
                    jobCount: { $size: '$jobs' },
                },
            },
            {
                $sort: { jobCount: -1 },
            },
            {
                $limit: 5, // Fetch top 5 companies by job postings
            },
            {
                $project: {
                    name: 1,
                    jobCount: 1,
                },
            },
        ]);

        // Send admin dashboard response
        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalCompanies,
                totalJobSeekers,
                totalJobs,
                totalApplications,
                totalMessages, // Uncomment if messages are managed through another model
            },
            recentActivity: {
                recentUsers,
                recentJobs,
                recentMessages, // Uncomment if messages are managed through another model
            },
            detailedStats: {
                topJobsByApplications: jobsWithApplicationCount,
                topCompaniesByJobCount: companiesWithJobCount,
            },
        });

        console.log("Admin dashboard response sent successfully");
    } catch (error) {
        console.error("Error in admin dashboard:", error);
        res.status(500).json({
            success: false,
            message: "Server error.",
        });
    }
};
