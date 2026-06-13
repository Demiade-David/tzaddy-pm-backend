require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" })); // raised from 5mb to handle base64 PDFs
app.use(express.static(path.join(__dirname, "build")));

// MongoDB connection
const mongoUri = process.env.MONGODB_URI && process.env.MONGODB_URI.trim();
let dbConnected = false;

if (!mongoUri) {
  console.error("MongoDB URI not configured. Set MONGODB_URI in environment variable.");
} else {
  mongoose
    .connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    })
    .then(() => {
      dbConnected = true;
      console.log("Connected to MongoDB Atlas");
    })
    .catch((err) => {
      dbConnected = false;
      console.error("MongoDB connection error:", err);
      if (err.reason) console.error("Reason:", err.reason);
    });
}

// Block API calls until DB is ready
app.use((req, res, next) => {
  if (req.path.startsWith("/api") && !dbConnected) {
    return res.status(503).json({ error: "Service unavailable: database not connected" });
  }
  next();
});

// Routes
app.use("/api/clients",        require("./tzaddy-pm/routes/clients"));
app.use("/api/compliance",     require("./tzaddy-pm/routes/compliance"));
app.use("/api/efs",            require("./tzaddy-pm/routes/efs"));
app.use("/api/documents",      require("./tzaddy-pm/routes/documents"));
app.use("/api/communications", require("./tzaddy-pm/routes/communications"));
app.use("/api/billing",        require("./tzaddy-pm/routes/billing"));
app.use("/api/attachments",    require("./tzaddy-pm/routes/attachments")); // NEW

// Dashboard summary
const Client     = require("./tzaddy-pm/models/Client");
const Compliance = require("./tzaddy-pm/models/Compliance");
const EFS        = require("./tzaddy-pm/models/EFS");
const Billing    = require("./tzaddy-pm/models/Billing");

app.get("/api/dashboard", async (req, res) => {
  try {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const fourteenDays = new Date(now);
    fourteenDays.setDate(fourteenDays.getDate() + 14);

    const [
      activeClients,
      pendingKyc,
      overdueCompliance,
      dueSoonCompliance,
      pendingEfs,
      billingRecords,
    ] = await Promise.all([
      Client.countDocuments({ status: "Active" }),
      Client.countDocuments({ kycComplete: false, status: { $ne: "Off-boarded" } }),
      Compliance.find({ filed: false, dueDate: { $lt: now } }).lean(),
      Compliance.find({ filed: false, dueDate: { $gte: now, $lte: fourteenDays } }).lean(),
      EFS.countDocuments({ status: { $ne: "Confirmed" } }),
      Billing.find({ paid: false }).lean(),
    ]);

    const unpaidAmount = billingRecords.reduce(
      (sum, b) => sum + (b.hours || 0) * (b.rate || 0),
      0
    );

    res.json({
      activeClients,
      pendingKyc,
      overdueCount: overdueCompliance.length,
      overdueItems: overdueCompliance,
      dueSoonCount: dueSoonCompliance.length,
      dueSoonItems: dueSoonCompliance,
      pendingEfs,
      unpaidAmount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reset endpoint
app.post("/api/reset", async (req, res) => {
  try {
    await Promise.all([
      Client.deleteMany({}),
      Compliance.deleteMany({}),
      EFS.deleteMany({}),
      require("./tzaddy-pm/models/Document").deleteMany({}),
      require("./tzaddy-pm/models/Communication").deleteMany({}),
      Billing.deleteMany({}),
      require("./tzaddy-pm/models/Attachment").deleteMany({}), // NEW
    ]);
    res.json({ message: "All data cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve frontend for all non-API routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
app.listen(PORT, () => {
  console.log(`Tzaddy Practice Manager running on port ${PORT}`);
});
