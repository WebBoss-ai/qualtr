// controllers/jobController.js
import User from '../models/user.model.js';
import Job from '../models/job.model.js';

// Save job for later
export const saveJobForLater = async (req, res) => {
  const { jobId } = req.params;
  const userId = req.id;
  try {
    const user = await User.findById(userId);
    // Check if job already saved
    if (user.savedJobs.includes(jobId)) {
      return res.status(400).json({ message: "Proect already saved." });
    }
    // Add job to savedJobs
    user.savedJobs.push(jobId);
    await user.save();

    res.status(200).json({ message: "Project saved successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Remove saved job
export const removeSavedJob = async (req, res) => {
  const { jobId } = req.params;
  const userId = req.id;
  try {
    const user = await User.findById(userId);

    // Remove job from savedJobs
    user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
    await user.save();

    res.status(200).json({ message: "Project removed from saved jobs." });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getSavedJobs = async (req, res) => {
  const userId = req.id;
  try {
    // Find the user and populate savedJobs, including company details
    const user = await User.findById(userId).populate({
      path: 'savedJobs',
      select: 'title company salary category createdAt description', // Add fields you need
      populate: {
        path: 'company', // Populate the company field within each job
        select: 'name logo', // Select only the name and logo of the company
      },
    });

    // If user doesn't exist
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user's saved jobs
    res.status(200).json(user.savedJobs);
  } catch (error) {
    console.error('Error fetching saved jobs:', error);
    res.status(500).json({ message: "Server error" });
  }
};

