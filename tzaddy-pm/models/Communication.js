const mongoose = require("mongoose");

const communicationSchema = new mongoose.Schema(
  {
    clientName: { type: String, trim: true, default: "" },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
    date: { type: Date, required: true },
    channel: {
      type: String,
      enum: ["Email", "Phone", "WhatsApp", "Letter", "In-person", "NRS Portal", "Other"],
      default: "Email",
    },
    direction: { type: String, enum: ["Outbound", "Inbound"], default: "Outbound" },
    subject: { type: String, required: true, trim: true },
    summary: { type: String, default: "" },
    parties: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Communication", communicationSchema);
