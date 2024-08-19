import mongoose from "mongoose";

const Schema = mongoose.Schema;

const categorySchema = new Schema(
    {
        category: { type: String, require: true },
        department: { type: String, required: true },
        categoryImage: { type: String, require: true }
    }
)

export default mongoose.model('category', categorySchema);