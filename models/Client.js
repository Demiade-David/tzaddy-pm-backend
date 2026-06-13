const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    tin: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ["Prospect", "Onboarding", "Active", "Inactive", "Off-boarded"],
      default: "Prospect",
    },
    contactPerson: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    email: { type: String, trim: true, default: "" },
    address: { type: String, trim: true, default: "" },
    kycComplete: { type: Boolean, default: false },
    onboardDate: { type: Date },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Client", clientSchema);
