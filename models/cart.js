import mongoose from 'mongoose';


const CartSchema = new mongoose.Schema({
  email: { type: String, ref: 'User', required: true },
  products: [
    {
      productCode: { type: String, require: true },
      productName: { type: String, require: true },
      vendorEmail: { type: String, require: true },
      vendorCommission: { type: String, require: true },
      shopName: { type: String, require: true },
      quantity: { type: Number, default: 1 },
      unit: { type: String, require: true },
      actualPrice: { type: Number, require: true },
      price: { type: Number, require: true },
      balance: { type: Number, require: true },
      productImage: { type: String, require: true },
      offered: { type: String }
    },
  ],
});


export default mongoose.model('Cart', CartSchema);