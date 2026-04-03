# Tzaddy Practice Manager v2.0
## MongoDB-backed Practice Management System

A full-stack practice management system for Nigerian tax consulting firms, aligned to NTAA 2025 accreditation requirements.

### Six PMS Modules
1. **Client Lifecycle** – Onboarding to off-boarding with TIN/KYC tracking
2. **Compliance Tracking** – Deadline monitoring across CIT, VAT, PAYE, WHT, CGT, EDT
3. **EFS Workflow** – Internal review chain: Draft → Under Review → Approved → Submitted → Confirmed
4. **Document Management** – Organised by six compliant engagement file categories
5. **Communication Logging** – Date-stamped records with channel tracking
6. **Billing & Time Tracking** – Hours, rates, invoiced/paid status

---

## SETUP INSTRUCTIONS

### Step 1: Get MongoDB Atlas (Free)
1. Go to https://www.mongodb.com/atlas and sign up (free tier is fine)
2. Create a new cluster (choose the FREE shared tier)
3. Under "Database Access", create a database user (save the username and password)
4. Under "Network Access", add your IP address (or 0.0.0.0/0 for access from anywhere)
5. Click "Connect" on your cluster → "Connect your application"
6. Copy the connection string. It looks like:
   `mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
7. Replace USERNAME and PASSWORD with your actual credentials
8. Add the database name before the `?`:
   `mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/tzaddy-pm?retryWrites=true&w=majority`

### Step 2: Install Node.js
1. Go to https://nodejs.org and download the LTS version
2. Install it (just click Next through the installer)

### Step 3: Set Up the App
1. Unzip this project folder
2. Open a terminal/command prompt in the project folder
3. Create a file called `.env` (just `.env`, no name before the dot) with this content:
   ```
   MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/tzaddy-pm?retryWrites=true&w=majority
   PORT=3000
   ```
   Replace the connection string with yours from Step 1.

4. Run these commands:
   ```
   npm install
   npm start
   ```

5. Open your browser and go to: http://localhost:3000

You should see the Practice Manager with "Connected to MongoDB" in the header.

### Step 4: Deploy Online (Optional)
To access from any device (phone, other computers):

**Option A: Render.com (Free)**
1. Push the project to a GitHub repository
2. Go to https://render.com and sign up
3. Create a new "Web Service" and connect your GitHub repo
4. Set environment variable: `MONGODB_URI` = your connection string
5. Deploy. Render gives you a public URL.

**Option B: Railway.app**
1. Go to https://railway.app and sign up
2. Create new project → Deploy from GitHub
3. Add environment variable: `MONGODB_URI` = your connection string
4. Deploy. Railway gives you a public URL.

---

## Project Structure
```
tzaddy-pm/
├── server.js           ← Express server (API + static file serving)
├── package.json        ← Dependencies
├── .env.example        ← Environment variable template
├── models/
│   ├── Client.js       ← Client schema
│   ├── Compliance.js   ← Compliance deadline schema
│   ├── EFS.js          ← EFS workflow schema
│   ├── Document.js     ← Document registry schema
│   ├── Communication.js← Communication log schema
│   └── Billing.js      ← Billing/time entry schema
├── routes/
│   ├── crud.js         ← Reusable CRUD route factory
│   ├── clients.js
│   ├── compliance.js
│   ├── efs.js
│   ├── documents.js
│   ├── communications.js
│   └── billing.js
└── public/
    └── index.html      ← Frontend (React app)
```

## Troubleshooting
- **"Cannot connect to server"** → Make sure `npm start` is running in the terminal
- **"MongoDB connection error"** → Check your `.env` file has the correct connection string
- **"Network Access" error** → Go to MongoDB Atlas > Network Access and add your IP
- **Port already in use** → Change PORT=3001 in your .env file

## Security Notes
- Never share your `.env` file or MongoDB credentials
- The `.env` file is gitignored by default (add a `.gitignore` with `.env` in it)
- For production, add authentication to the app (this version has none)
