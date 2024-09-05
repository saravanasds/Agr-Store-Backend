import mongoose from "mongoose";


const CommissionSummarySchema = new mongoose.Schema({
    totalCommission: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('CommissionSummary', CommissionSummarySchema);