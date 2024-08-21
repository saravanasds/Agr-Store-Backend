import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    email: { type: String, require: true },
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, require: true },
            quantity: { type: String, require: true },
            price: { type: String, require: true },
            total: { type: String, require: true },
        },
    ],
    address: { type: String, require: true },
    mobileNumber: { type: String, require: true },
    pincode: { type: String, require: true },
    totalAmount: { type: String, require: true },
});

export default mongoose.model('Order', orderSchema);