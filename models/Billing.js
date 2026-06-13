const mongoose = require("mongoose");

const billingSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true, trim: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
    engagement: { type: String, default: "" },
    date: { type: Date, required: true },
    hours: { type: Number, default: 0, min: 0 },
    rate: { type: Number, default: 0, min: 0 },
    description: { type: String, default: "" },
    invoiced: { type: Boolean, default: false },
    paid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Billing", billingSchema);
