import mongoose from 'mongoose';


const CartSchema = new mongoose.Schema({
    email: { type: String, ref: 'User', required: true },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, default: 1 },
        unit: { type: String, require: true },
        price: { type: Number, require: true },
        productImage: { type: String, require: true }
      },
    ],
  });
  

  export default mongoose.model('Cart', CartSchema);