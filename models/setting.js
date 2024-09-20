import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
    {
        offerImage: { type: String },
        heroImages: { type: [String] },  // Array of strings to store multiple images
        offerHeading: { type: String },
        heroHeading: { type: String },
    }
);

export default mongoose.model("Setting", settingSchema);
