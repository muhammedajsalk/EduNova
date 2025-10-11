const { default: mongoose } = require("mongoose");
const instructorModel = require("../../models/instructorModel");
const mentorshipModel = require("../../models/mentorshipModel");
const paymentModel = require("../../models/paymentModel");
const PayoutModel = require("../../models/payOutModel");


/**
 * @desc    Get all aggregated data for the instructor earnings page
 * @route   GET /api/earnings/summary
 * @access  Private (Instructor)
 */
exports.getEarningsSummary = async (req, res) => {
  try {
    const instructorId = new mongoose.Types.ObjectId(req.instructor?.id);

    // --- 1. Fetch Core Instructor Data ---
    const instructor = await instructorModel.findById(instructorId).lean();
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found.' });
    }

    // --- 2. Perform Financial Calculations in Parallel ---
    const [
      earningsData,
      blockedAmountData,
      pendingPayoutData,
      revenueTrendData,
      recentPayouts
    ] = await Promise.all([
      // Calculate total earnings and breakdown by type
      paymentModel.aggregate([
        { $match: { instructorId: instructorId, status: 'paid' } },
        { $group: { _id: '$itemType', total: { $sum: '$amount' } } },
      ]),
      // Calculate blocked amount from scheduled mentorships
      mentorshipModel.aggregate([
          { $match: { instructorId: instructorId, status: 'scheduled' } },
          { $group: { _id: null, total: { $sum: '$programFee' } } }
      ]),
      // Calculate pending payouts
      PayoutModel.aggregate([
        { $match: { instructorId: instructorId, status: { $in: ['pending', 'processing'] } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      // Get revenue trend for the last 6 months
      paymentModel.aggregate([
        { $match: { 
            instructorId: instructorId, 
            status: 'paid',
            createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) }
        }},
        { $group: {
            _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
            revenue: { $sum: '$amount' }
        }},
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]),
      // Get recent completed payouts
      PayoutModel.find({ instructorId: instructorId, status: 'completed' }).sort({ createdAt: -1 }).limit(3).lean()
    ]);

    // --- 3. Process the Aggregated Data ---
    const courseEarnings = earningsData.find(e => e._id === 'course')?.total || 0;
    const mentoringEarnings = earningsData.find(e => e._id === 'mentorship')?.total || 0;
    const directEarnings = courseEarnings + mentoringEarnings;
    
    // In a real application, this data would come from a pre-calculated monthly job.
    // We are mocking it here for demonstration.
    const MOCKED_POOL_EARNINGS = 1125.00;
    const totalEarnings = directEarnings + MOCKED_POOL_EARNINGS;
    
    const blockedAmount = blockedAmountData[0]?.total || 0;
    const pendingPayout = pendingPayoutData[0]?.total || 0;
    
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const chartData = revenueTrendData.map(item => ({
        month: monthNames[item._id.month - 1],
        revenue: item.revenue
    }));

    // --- 4. Assemble the Final JSON Response ---
    // This structure matches the `InstructorEarningsPage.jsx` component
    const summary = {
      stats: [
        { name: 'Total Earnings', value: `$${totalEarnings.toFixed(2)}` },
        { name: 'Pool Earnings', value: `$${MOCKED_POOL_EARNINGS.toFixed(2)}` },
        { name: 'Direct Earnings', value: `$${directEarnings.toFixed(2)}` },
        { name: 'Blocked Amount', value: `$${blockedAmount.toFixed(2)}` },
        { name: 'Pending Payout', value: `$${pendingPayout.toFixed(2)}` },
      ],
      chartData: chartData,
      breakdown: [
        { source: 'Course Sales', amount: `$${courseEarnings.toFixed(2)}`, percentage: totalEarnings > 0 ? Math.round((courseEarnings / totalEarnings) * 100) : 0 },
        { source: 'Pool Revenue', amount: `$${MOCKED_POOL_EARNINGS.toFixed(2)}`, percentage: totalEarnings > 0 ? Math.round((MOCKED_POOL_EARNINGS / totalEarnings) * 100) : 0 },
        { source: 'Mentoring', amount: `$${mentoringEarnings.toFixed(2)}`, percentage: totalEarnings > 0 ? Math.round((mentoringEarnings / totalEarnings) * 100) : 0 },
      ],
      payoutInfo: {
        availableBalance: instructor.earnings || 0, // This should be the current balance field in the instructor model
        minimumPayout: 100.00, // This could be a config value
        paymentMethods: instructor.payoutMethods,
        recentPayouts: recentPayouts,
      },
      // You would fetch these from their respective collections
      blockedSessions: await mentorshipModel.find({ instructorId: instructorId, status: 'scheduled' }).limit(5).lean(),
    };

    res.status(200).json(summary);

  } catch (error) {
    console.error("Error fetching earnings summary:", error);
    res.status(500).json({ message: 'Server error fetching earnings summary.' });
  }
};


/**
 * @desc    Get paginated transaction history
 * @route   GET /api/earnings/transactions
 * @access  Private (Instructor)
 */
exports.getTransactions = async (req, res) => {
    try {
        const instructorId = new mongoose.Types.ObjectId(req.instructor.id);
        const { page = 1, limit = 10, filter, search } = req.query;

        const query = { instructorId };

        if (filter && filter !== 'all') {
            query.itemType = filter; // 'course', 'mentorship' etc.
        }

        if (search) {
            // This assumes your payment model has a 'notes' field with item names
            query['notes.itemName'] = { $regex: search, $options: 'i' };
        }

        const transactions = await paymentModel
            .find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .lean();
        
        const total = await paymentModel.countDocuments(query);

        res.status(200).json({
            transactions,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalResults: total
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error fetching transactions.' });
    }
};