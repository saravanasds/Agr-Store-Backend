import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    email: { type: String, require: true },
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, require: true },
            productCode: { type: String, require: true },
            vendorCommission: { type: String, require: true },
            productName: { type: String, require: true },
            vendorEmail: { type: String, require: true },
            shopName: { type: String, require: true },
            productImage: { type: String, require: true },
            quantity: { type: String, require: true },
            actualPrice: { type: String, require: true },
            price: { type: String, require: true },
            commissionAmount: { type: Number, require: true },
            balance: { type: Number, require: true },
            total: { type: Number, require: true },
            orderStatus: { type: String, default: 'Processing' },
            createdAt: { type: Date, default: Date.now },
        },
    ],
    name: { type: String, require: true },
    address: { type: String, require: true },
    mobileNumber: { type: String, require: true },
    pincode: { type: String, require: true },
    totalAmount: { type: Number, require: true },
    discount: { type: Number, default:0 },
    orderStatus: { type: String, default: 'Processing' },
    razorpayPaymentId: { type: String },
    razorpayOrderId: { type: String },
    razorpaySignature: { type: String },
    paymentMethod: { type: String, require: true },
    totalCommission: { type: Number, require: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Order', orderSchema);