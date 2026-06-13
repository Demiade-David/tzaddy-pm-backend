const express = require("express");

/**
 * Creates standard CRUD routes for a Mongoose model.
 * @param {mongoose.Model} Model
 * @param {Object} options - { sortField, sortOrder }
 */
function createCrudRouter(Model, options = {}) {
  const router = express.Router();
  const { sortField = "createdAt", sortOrder = -1 } = options;

  // GET all
  router.get("/", async (req, res) => {
    try {
      const items = await Model.find().sort({ [sortField]: sortOrder }).lean();
      res.json(items);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET one
  router.get("/:id", async (req, res) => {
    try {
      const item = await Model.findById(req.params.id).lean();
      if (!item) return res.status(404).json({ error: "Not found" });
      res.json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST create
  router.post("/", async (req, res) => {
    try {
      const item = new Model(req.body);
      await item.save();
      res.status(201).json(item);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // PUT update
  router.put("/:id", async (req, res) => {
    try {
      const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!item) return res.status(404).json({ error: "Not found" });
      res.json(item);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // PATCH partial update (for toggling fields like filed, invoiced, paid)
  router.patch("/:id", async (req, res) => {
    try {
      const item = await Model.findByIdAndUpdate(req.params.id, { $set: req.body }, {
        new: true,
        runValidators: true,
      });
      if (!item) return res.status(404).json({ error: "Not found" });
      res.json(item);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // DELETE
  router.delete("/:id", async (req, res) => {
    try {
      const item = await Model.findByIdAndDelete(req.params.id);
      if (!item) return res.status(404).json({ error: "Not found" });
      res.json({ message: "Deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}

module.exports = createCrudRouter;
