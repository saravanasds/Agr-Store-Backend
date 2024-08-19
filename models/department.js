import mongoose from "mongoose";

const Schema = mongoose.Schema;

const departmentSchema = new Schema(
    {
        department: { type: String, require: true },
        departmentImage: { type: String, require: true }
    }
)

export default mongoose.model('department', departmentSchema);