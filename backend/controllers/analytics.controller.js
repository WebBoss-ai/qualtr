import Job from "../models/job.model.js";
import User from "../models/user.model.js";
import CompareList from "../models/CompareList.js";
import Message from "../models/message.model.js";
import moment from "moment";

export const getAnalytics = async (req, res) => {
  try {
    const userId = req.id;
    console.log("User ID:", userId);

    // Get the start of the current and previous month
    const startOfCurrentMonth = moment().startOf('month').toDate();
    const startOfLastMonth = moment().subtract(1, 'month').startOf('month').toDate();
    const endOfLastMonth = moment().subtract(1, 'month').endOf('month').toDate();

    console.log("Current Month Start:", startOfCurrentMonth);
    console.log("Last Month Start:", startOfLastMonth, "End:", endOfLastMonth);

    // Fetch analytics data for the logged-in user for the current month
    const totalRequirements = await Job.countDocuments({
      createdBy: userId,
      createdAt: { $gte: startOfCurrentMonth }
    });
    console.log("Total Requirements (Current Month):", totalRequirements);

    const activeBids = await Job.find({
      createdBy: userId,
      applications: { $exists: true, $ne: [] },
      createdAt: { $gte: startOfCurrentMonth }
    }).countDocuments();
    console.log("Active Bids (Current Month):", activeBids);

    const agenciesContacted = await User.find({
      role: "recruiter",
      createdBy: userId,
      createdAt: { $gte: startOfCurrentMonth }
    }).countDocuments();
    console.log("Agencies Contacted (Current Month):", agenciesContacted);

    const compareList = await CompareList.findOne({ userId });
    const comparedAgenciesCount = compareList ? compareList.agencies.length : 0;
    console.log("Compared Agencies (Current Month):", comparedAgenciesCount);

    const messages = await Message.find({
      sender: userId,
      createdAt: { $gte: startOfCurrentMonth }
    });
    const messagesRequestedCount = messages.length;
    console.log("Messages Requested (Current Month):", messagesRequestedCount);

    const jobsWithApplications = await Job.find({
      createdBy: userId,
      applications: { $exists: true, $ne: [] },
      createdAt: { $gte: startOfCurrentMonth }
    });
    console.log("Jobs With Applications (Current Month):", jobsWithApplications);

    const totalBidAmounts = jobsWithApplications.reduce((acc, job) => acc + job.salary, 0);
    const averageBidAmount = jobsWithApplications.length ? totalBidAmounts / jobsWithApplications.length : 0;
    console.log("Average Bid Amount (Current Month):", averageBidAmount);

    // Fetch analytics data for the logged-in user for the previous month
    const totalRequirementsPastMonth = await Job.countDocuments({
      createdBy: userId,
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    });
    console.log("Total Requirements (Last Month):", totalRequirementsPastMonth);

    const activeBidsPastMonth = await Job.find({
      createdBy: userId,
      applications: { $exists: true, $ne: [] },
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    }).countDocuments();
    console.log("Active Bids (Last Month):", activeBidsPastMonth);

    const agenciesContactedPastMonth = await User.find({
      role: "recruiter",
      createdBy: userId,
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    }).countDocuments();
    console.log("Agencies Contacted (Last Month):", agenciesContactedPastMonth);

    const compareListPastMonth = await CompareList.findOne({ userId });
    const comparedAgenciesCountPastMonth = compareListPastMonth ? compareListPastMonth.agencies.length : 0;
    console.log("Compared Agencies (Last Month):", comparedAgenciesCountPastMonth);

    const messagesPastMonth = await Message.find({
      sender: userId,
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    });
    const messagesRequestedCountPastMonth = messagesPastMonth.length;
    console.log("Messages Requested (Last Month):", messagesRequestedCountPastMonth);

    const jobsWithApplicationsPastMonth = await Job.find({
      createdBy: userId,
      applications: { $exists: true, $ne: [] },
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    });
    console.log("Jobs With Applications (Last Month):", jobsWithApplicationsPastMonth);

    const totalBidAmountsPastMonth = jobsWithApplicationsPastMonth.reduce((acc, job) => acc + job.salary, 0);
    const averageBidAmountPastMonth = jobsWithApplicationsPastMonth.length ? totalBidAmountsPastMonth / jobsWithApplicationsPastMonth.length : 0;
    console.log("Average Bid Amount (Last Month):", averageBidAmountPastMonth);

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

    console.log("Percent Change - Requirements:", percentChangeRequirements);
    console.log("Percent Change - Active Bids:", percentChangeActiveBids);
    console.log("Percent Change - Agencies Contacted:", percentChangeAgenciesContacted);
    console.log("Percent Change - Compared Agencies:", percentChangeComparedAgencies);
    console.log("Percent Change - Messages Requested:", percentChangeMessagesRequested);
    console.log("Percent Change - Average Bid Amount:", percentChangeAverageBidAmount);

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
    console.error("Error in getAnalytics:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};
