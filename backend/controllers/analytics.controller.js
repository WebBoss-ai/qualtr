import Job from "../models/job.model.js";
import User from "../models/user.model.js";

export const getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalRequirements = await Job.countDocuments({ createdBy: userId });
    const activeBids = await Job.find({ 
      createdBy: userId, 
      applications: { $exists: true, $ne: [] } 
    }).countDocuments();
    const agenciesContacted = await User.find({ 
      role: "recruiter", 
      createdBy: userId 
    }).countDocuments();

    const jobsWithApplications = await Job.find({ 
      createdBy: userId, 
      applications: { $exists: true, $ne: [] } 
    });
    const totalBidAmounts = jobsWithApplications.reduce((acc, job) => acc + job.salary, 0);
    const averageBidAmount = jobsWithApplications.length ? totalBidAmounts / jobsWithApplications.length : 0;

    res.status(200).json({
      totalRequirements,
      activeBids,
      agenciesContacted,
      averageBidAmount: Math.round(averageBidAmount),
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
