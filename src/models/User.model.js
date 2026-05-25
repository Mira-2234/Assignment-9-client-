import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name:     { type: String, required: true },
        email:    { type: String, required: true, unique: true, lowercase: true },
        image:    { type: String, default: "" },
        password: { type: String, default: "" }, // Google login এ empty থাকবে
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);