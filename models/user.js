import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    fatherName: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobileNumber: { type: String, required: true },
    alternateMobileNumber : { type: String, required: true },
    adhaarNumber: { type: String, required: true, unique: true },
    voterId: { type: String, required: true, },
    district: { type: String, required: true },
    constituency: { type: String, required: true },
    address: { type: String, required: true },
    referralId: { type: String, required: true },
    referredBy: { type: String },
    referredPeoples: { type: Array },
    familyMembers : { type: String, required: true },
    voters : { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('User', UserSchema);
