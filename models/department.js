import mongoose from "mongoose";

const Schema = mongoose.Schema;

const departmentSchema = new Schema({
    department: { type: String, required: true },
    departmentImage: { type: String, required: true },
    coverImage: { type: String, required: true }, 
  });

export default mongoose.model('department', departmentSchema);