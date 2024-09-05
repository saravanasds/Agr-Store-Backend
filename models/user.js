import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobileNumber: { type: String, required: true },
    referralId: { type: String },
    referredBy: { type: String },
    referredPeoples: { type: Array },
    password: { type: String, required: true },
    userShare: { type: Number, default: 0 },
    randomString: String,
    randomStringExpires: Date,
  },
  { timestamps: true }
);

export default mongoose.model('User', UserSchema);
