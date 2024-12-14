import Job from "../models/job.model.js";
import User from "../models/user.model.js";
import CompareList from "../models/CompareList.js";
import Message from "../models/message.model.js";
import moment from "moment";

export const getAnalytics = async (req, res) => {
  try {
    const userId = req.id; 

    // Get the start of the current and previous month
    const startOfCurrentMonth = moment().startOf('month').toDate();
    const startOfLastMonth = moment().subtract(1, 'month').startOf('month').toDate();
    const endOfLastMonth = moment().subtract(1, 'month').endOf('month').toDate();

    // Fetch analytics data for the logged-in user for the current month
    const totalRequirements = await Job.countDocuments({ 
      createdBy: userId,
      createdAt: { $gte: startOfCurrentMonth }
    });
    const activeBids = await Job.find({ 
      createdBy: userId, 
      applications: { $exists: true, $ne: [] },
      createdAt: { $gte: startOfCurrentMonth }
    }).countDocuments();
    const agenciesContacted = await User.find({ 
      role: "recruiter", 
      createdBy: userId,
      createdAt: { $gte: startOfCurrentMonth }
    }).countDocuments();

    // Compared Agencies (Current Month)
    const compareList = await CompareList.findOne({ userId });
    const comparedAgenciesCount = compareList ? compareList.agencies.length : 0;

    // Messages / Meeting Requested (Current Month)
    const messages = await Message.find({ 
      sender: userId, 
      createdAt: { $gte: startOfCurrentMonth }
    });
    const messagesRequestedCount = messages.length;

    const jobsWithApplications = await Job.find({ 
      createdBy: userId, 
      applications: { $exists: true, $ne: [] },
      createdAt: { $gte: startOfCurrentMonth }
    });
    const totalBidAmounts = jobsWithApplications.reduce((acc, job) => acc + job.salary, 0);
    const averageBidAmount = jobsWithApplications.length ? totalBidAmounts / jobsWithApplications.length : 0;

    // Fetch analytics data for the logged-in user for the previous month
    const totalRequirementsPastMonth = await Job.countDocuments({
      createdBy: userId,
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    });
    const activeBidsPastMonth = await Job.find({
      createdBy: userId,
      applications: { $exists: true, $ne: [] },
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    }).countDocuments();
    const agenciesContactedPastMonth = await User.find({
      role: "recruiter",
      createdBy: userId,
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    }).countDocuments();

    // Compared Agencies (Past Month)
    const compareListPastMonth = await CompareList.findOne({ userId });
    const comparedAgenciesCountPastMonth = compareListPastMonth ? compareListPastMonth.agencies.length : 0;

    // Messages / Meeting Requested (Past Month)
    const messagesPastMonth = await Message.find({ 
      sender: userId,
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    });
    const messagesRequestedCountPastMonth = messagesPastMonth.length;

    const jobsWithApplicationsPastMonth = await Job.find({ 
      createdBy: userId, 
      applications: { $exists: true, $ne: [] },
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    });
    const totalBidAmountsPastMonth = jobsWithApplicationsPastMonth.reduce((acc, job) => acc + job.salary, 0);
    const averageBidAmountPastMonth = jobsWithApplicationsPastMonth.length ? totalBidAmountsPastMonth / jobsWithApplicationsPastMonth.length : 0;

    // Calculate percent change for each field
    const calculatePercentChange = (current, past) => {
      if (past === 0) return current === 0 ? 0 : 100;
      return ((current - past) / past) * 100;
    };

    const percentChangeRequirements = calculatePercentChange(totalRequirements, totalRequirementsPastMonth);
    const percentChangeActiveBids = calculatePercentChange(activeBids, activeBidsPastMonth);
    const percentChangeAgenciesContacted = calculatePercentChange(agenciesContacted, agenciesContactedPastMonth);
    const percentChangeComparedAgencies = calculatePercentChange(comparedAgenciesCount, comparedAgenciesCountPastMonth);
    const percentChangeMessagesRequested = calculatePercentChange(messagesRequestedCount, messagesRequestedCountPastMonth);
    const percentChangeAverageBidAmount = calculatePercentChange(averageBidAmount, averageBidAmountPastMonth);

    res.status(200).json({
      totalRequirements,
      activeBids,
      agenciesContacted,
      comparedAgencies: comparedAgenciesCount,
      messagesRequested: messagesRequestedCount,
      averageBidAmount: Math.round(averageBidAmount),
      percentChangeRequirements,
      percentChangeActiveBids,
      percentChangeAgenciesContacted,
      percentChangeComparedAgencies,
      percentChangeMessagesRequested,
      percentChangeAverageBidAmount: Math.round(percentChangeAverageBidAmount),
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
