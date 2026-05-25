import mongoose from "mongoose";

const PetSchema = new mongoose.Schema(
  {
    // দুটো field naming support করে
    name:              { type: String },
    petName:           { type: String },
    species:           { type: String },
    breed:             { type: String },
    age:               { type: Number },
    gender:            { type: String },
    image:             { type: String },
    imageUrl:          { type: String },
    healthStatus:      { type: String },
    vaccinationStatus: { type: String },
    location:          { type: String },
    adoptionFee:       { type: Number },
    description:       { type: String },
    ownerEmail:        { type: String },
    ownerName:         { type: String },
    status:            { type: String, default: "available" },
  },
  { timestamps: true }
);

export default mongoose.models.Pet
  ? mongoose.model("Pet")
  : mongoose.model("Pet", PetSchema);