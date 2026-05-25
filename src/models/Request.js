import mongoose from "mongoose";

const RequestSchema = new mongoose.Schema(
    {
        petId:          { type: String, required: true },
        petName:        { type: String, default: "" },
        petImage:       { type: String, default: "" },
        requesterName:  { type: String, default: "" },
        requesterEmail: { type: String, required: true },
        ownerEmail:     { type: String, default: "" },
        pickupDate:     { type: String, default: "" },
        message:        { type: String, default: "" },
        status:         { type: String, default: "pending", enum: ["pending", "approved", "rejected"] },
    },
    { timestamps: true }
);

export default mongoose.models.Request ||
    mongoose.model("Request", RequestSchema);