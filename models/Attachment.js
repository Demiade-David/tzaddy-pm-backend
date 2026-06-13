const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema(
  {
    // What this PDF belongs to
    refType: {
      type: String,
      enum: ["engagement", "payment"],
      required: true,
    },
    refId: {
      type: String,
      required: true, // client-side uid — not a MongoDB ObjectId
      index: true,
    },
    clientId: {
      type: String,
      default: "",
      index: true,
    },

    // File data
    name: { type: String, required: true, trim: true },
    size: { type: String, default: "" }, // human-readable e.g. "234 KB"
    data: { type: String, required: true }, // base64 data URL
    attachedAt: { type: Number, default: () => Date.now() },
  },
  { timestamps: true }
);

// One attachment per ref — replace on re-upload
attachmentSchema.index({ refType: 1, refId: 1 }, { unique: true });

module.exports = mongoose.model("Attachment", attachmentSchema);
