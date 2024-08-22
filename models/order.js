import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    email: { type: String, require: true },
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, require: true },
            productName: { type: String, require: true },
            vendorEmail: { type: String, require: true },
            productImage: { type: String, require: true },
            quantity: { type: String, require: true },
            price: { type: String, require: true },
            total: { type: String, require: true },
            orderStatus: { type: String, default: 'Processing' },
        },
    ],
    name: { type: String, require: true },
    address: { type: String, require: true },
    mobileNumber: { type: String, require: true },
    pincode: { type: String, require: true },
    totalAmount: { type: String, require: true },
    orderStatus: { type: String, default: 'Processing' },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Order', orderSchema);