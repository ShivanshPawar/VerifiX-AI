const UserScan = require("../models/userScan.model");


exports.getDashboard = async (req, res) => {

    try {
        const userId = req.user.id;

        // Total scans
        const totalScans = await UserScan.countDocuments({ user: userId });

        // Unique images
        const uniqueImages = await UserScan.distinct("imageHash", {
            user: userId
        })

        // Verdict breakdown 
        const verdictStats = await UserScan.aggregate([
            { $match: { user: req.user.id } },

            {
                $lookup: {
                    from: "imageanalyses",
                    localField: "analysis",
                    foreignField: "_id",
                    as: "analysis"
                }
            },
            { $unwind: "$analysis" },
            {
                $group: {
                    _id: "$analysis.verdict",
                    count: { $sum: 1 }
                }
            }
        ]);

        let authentic = 0;
        let manipulated = 0;
        let inconclusive = 0;

        verdictStats.forEach(stat => {
            if (stat._id === "AUTHENTIC") authentic = stat.count;
            if (stat._id === "MANIPULATED") manipulated = stat.count;
            if (stat._id === "INCONCLUSIVE") inconclusive = stat.count;
        })

        // Recent Activity
        const recentActivity = await UserScan.find({ user: userId })
            .sort({ scannedAt: -1 })
            .limit(5)
            .populate("analysis");

        const formattedRecent = recentActivity.map(scan => ({
            scanId: scan._id,
            verdict: scan.analysis.verdict,
            confidence: scan.analysis.score,
            scannedAt: scan.scannedAt,
            title: scan.title,
            thumbnail: scan.thumbnail,

        }));

        // Shared response
        res.status(200).json({
            stats: {
                total_scans: totalScans,
                unique_image: uniqueImages.length,
                authentic,
                manipulated,
                inconclusive
            },
            recentActivity: formattedRecent
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to load dashboard",
            error: error.message
        });
    }
};