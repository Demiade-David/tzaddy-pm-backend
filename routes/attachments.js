const express = require("express");
const router = express.Router();
const Attachment = require("../models/Attachment");

// GET /api/attachments?refType=engagement&refId=abc123
// GET /api/attachments?clientId=xyz  (all docs for a client)
router.get("/", async (req, res) => {
  try {
    const { refType, refId, clientId } = req.query;
    const filter = {};
    if (refType) filter.refType = refType;
    if (refId) filter.refId = refId;
    if (clientId) filter.clientId = clientId;
    const items = await Attachment.find(filter).sort({ attachedAt: -1 }).lean();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/attachments/:refType/:refId — single attachment
router.get("/:refType/:refId", async (req, res) => {
  try {
    const item = await Attachment.findOne({
      refType: req.params.refType,
      refId: req.params.refId,
    }).lean();
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/attachments — upsert (create or replace)
// Body: { refType, refId, clientId, name, size, data, attachedAt }
router.post("/", async (req, res) => {
  try {
    const { refType, refId } = req.body;
    if (!refType || !refId) {
      return res.status(400).json({ error: "refType and refId are required" });
    }

    // Validate base64 size — reject anything over ~6MB base64 string
    const dataStr = req.body.data || "";
    const approxBytes = (dataStr.length * 3) / 4;
    if (approxBytes > 6 * 1024 * 1024) {
      return res.status(413).json({ error: "File too large. Maximum is approximately 4.5 MB." });
    }

    const item = await Attachment.findOneAndUpdate(
      { refType, refId },
      { ...req.body, attachedAt: Date.now() },
      { upsert: true, new: true, runValidators: true }
    );
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/attachments/:refType/:refId
router.delete("/:refType/:refId", async (req, res) => {
  try {
    const item = await Attachment.findOneAndDelete({
      refType: req.params.refType,
      refId: req.params.refId,
    });
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/attachments/client/:clientId — remove all docs when client is deleted
router.delete("/client/:clientId", async (req, res) => {
  try {
    const result = await Attachment.deleteMany({ clientId: req.params.clientId });
    res.json({ deleted: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
