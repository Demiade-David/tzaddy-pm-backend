const mongoose = require("mongoose");

const complianceSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true, trim: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
    taxHead: {
      type: String,
      enum: ["CIT", "VAT", "PAYE", "WHT", "CGT", "EDT", "Tertiary Education Tax"],
      required: true,
    },
    description: { type: String, default: "" },
    dueDate: { type: Date, required: true },
    filed: { type: Boolean, default: false },
    filedDate: { type: Date },
    reference: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Compliance", complianceSchema);
