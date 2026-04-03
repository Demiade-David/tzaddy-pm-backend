const mongoose = require("mongoose");

const efsSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true, trim: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
    taxHead: {
      type: String,
      enum: ["CIT", "VAT", "PAYE", "WHT", "CGT", "EDT", "Tertiary Education Tax"],
      required: true,
    },
    filingPeriod: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Draft", "Under Review", "Approved", "Submitted", "Confirmed"],
      default: "Draft",
    },
    preparedBy: { type: String, default: "" },
    reviewedBy: { type: String, default: "" },
    approvedBy: { type: String, default: "" },
    submissionRef: { type: String, default: "" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EFS", efsSchema);
