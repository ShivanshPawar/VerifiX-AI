const UserScan = require("../models/userScan.model");


/**
 * GET /api/v1/history
 * Returns paginated scan history for loggged-in user
 */
exports.getUserHistory = async (req, res) => {

    try {
        // Logged-in user ID (coming from auth middleware)
        const userId = req.user.id;

        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Calculate number of records to skip
        const skip = (page - 1) * limit;

        // Total number of scans for this user
        const total = await UserScan.countDocuments({ user: userId });

        // Fetch paginated scan history (latest first)
        const scans = await UserScan.find({ user: userId })
            .sort({ scannedAt: -1 })    // descending order (newest first) Like ChatGpt history sidebar 
            .skip(skip)
            .limit(limit)
            .populate("analysis");  // populate referenced analysis document

        // Format response to avoid sending unnecessary fields
        const formatted = scans.map(scan => ({
            scanId: scan._id,
            imageHash: scan.analysis.imageHash,
            verdict: scan.analysis.verdict,
            confidencePercent: scan.analysis.confidencePercent,
            scannedAt: scan.scannedAt,
            title: scan.title,
            thumbnail: scan.thumbnail,

        }))

        // Send paginated response
        res.status(200).json({
            total,
            page,
            limit,
            data: formatted
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch history",
            error: error.message
        });
    }
};


/**
 * GET /api/v1/history/:id
 * Get detailed scan result
 */
exports.getScanDetails = async (req, res) => {

    try {
        // Logged-in user ID
        const userId = req.user.id;

        // Scan ID from request params
        const scanId = req.params.id;

        // Find scan only if it belongs to this user
        const scan = await UserScan.findOne({
            _id: scanId,
            user: userId
        }).populate("analysis");

        // If scan not found or not authorized
        if (!scan) {
            return res.status(404).json({
                message: "Scan not found"
            });
        }

        // Return detailed scan information
        res.status(200).json({
            verdict: scan.analysis.verdict,
            confidencePercent: scan.analysis.confidencePercent,
            report: scan.analysis.report,
            scannedAt: scan.scannedAt
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch scan details",
            error: error.message
        });
    }
};

/**
 * DELETE /api/v1/history/:id
 * Delete the scan history
 */
exports.deleteHistory = async (req, res) => {

    try {
        // Logged-in user ID
        const userId = req.user.id;

        // Scan ID from request params
        const scanId = req.params.id;

        // Delete only if scan belongs to the user
        const deletedScan = await UserScan.findOneAndDelete({
            _id: scanId,
            user: userId
        });

        // If scan not found or user not authorized
        if (!deletedScan) {
            return res.status(404).json({
                message: "Scan not found or not authorized "
            });
        }

        // Successful deletion response
        return res.status(200).json({
            message: "History entry deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to delete history",
            error: error.message
        });
    }
};