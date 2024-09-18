import mongoose from 'mongoose';

const SoldProductSchema = new mongoose.Schema({
    productCode: { type: String, required: true },
    productName: { type: String, required: true },
    shopName: { type: String, required: true },
    vendorEmail: { type: String, required: true },
    quantity: { type: Number, required: true },
    total: { type: Number, required: true },
    commissionAmount: { type: Number, require: true },
    balance: { type: Number, required: true },
    offered: { type: String },
    soldAt: { type: Date, default: Date.now }
});

export default mongoose.model('SoldProduct', SoldProductSchema);
