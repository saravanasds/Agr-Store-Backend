import mongoose from 'mongoose';

const payHistorySchema = new mongoose.Schema({
    vendorEmail: { type: String, require: true },
    shopName: { type: String, require: true },
    paymentAmount: { type: Number, require: true },
    transactionId: { type: String, require: true },
},
{ timestamps: true }
)

export default mongoose.model('PayHistory', payHistorySchema);