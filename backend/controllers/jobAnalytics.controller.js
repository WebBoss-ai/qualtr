import Job from "../models/job.model.js";

export const getActiveJobs = async (req, res) => {
  const limit = parseInt(req.query.limit) || 5; // Default to 5 if no limit is specified

  try {
    const activeJobs = await Job.find({ applications: { $exists: true, $ne: [] } })
      .limit(limit)
      .populate("company", "name"); // Populating company name

    res.status(200).json(activeJobs);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
