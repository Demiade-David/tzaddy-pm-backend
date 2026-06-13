const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    clientName: { type: String, trim: true, default: "" },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
    category: {
      type: String,
      enum: [
        "Engagement Documentation",
        "Client Tax Records",
        "Work Papers",
        "Correspondence Files",
        "Approval & Review Trails",
        "Disclosure Documentation",
      ],
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    fileRef: { type: String, default: "" },
    retentionDate: { type: Date },
    accessLog: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", documentSchema);
