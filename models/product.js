import mongoose from "mongoose";

const Schema = mongoose.Schema;

const productSchema = new Schema(
    {
        productCode: { type: String, unique: true, required: true },
        vendorEmail: { type: String, require: true }, 
        department: { type: String, require: true }, 
        shopName: { type: String, require: true },
        productName: { type: String, require: true },
        category: { type: String, ref: 'category', require: true },
        description: { type: String, },
        unit: { type: String, require: true },
        price: { type: Number, require: true },
        productImage: { type: String, require: true }
    },
    { timestamps: true }
)

export default mongoose.model('Product', productSchema);