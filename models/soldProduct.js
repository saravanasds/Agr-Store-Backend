import mongoose from 'mongoose';

const SoldProductSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, required: true },
    productCode: { type: String, required: true },
    productName: { type: String, required: true },
    shopName: { type: String, required: true },
    vendorEmail: { type: String, required: true },
    quantity: { type: Number, required: true },
    total: { type: Number, required: true },
    commissionAmount: { type: Number, require: true },
    balance: { type: Number, required: true },
    // orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    soldAt: { type: Date, default: Date.now }
});

export default mongoose.model('SoldProduct', SoldProductSchema);
