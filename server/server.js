import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import linkRoutes from "./routes/links.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

function getMongoUri() {
  const configuredUri = process.env.MONGODB_URI?.trim();

  if (configuredUri) {
    if (configuredUri.includes("username:password@cluster.mongodb.net")) {
      throw new Error(
        "MONGODB_URI is still using the example placeholder. Set a real MongoDB Atlas connection string in your deployment environment.",
      );
    }

    return configuredUri;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "MONGODB_URI is not set. Add your real MongoDB connection string to the deployment environment.",
    );
  }

  return "mongodb://127.0.0.1:27017/linksave";
}

function describeMongoUri(uri) {
  try {
    const parsed = new URL(uri);
    return `${parsed.protocol}//${parsed.hostname}${parsed.pathname}`;
  } catch {
    return "configured";
  }
}

let MONGODB_URI;

try {
  MONGODB_URI = getMongoUri();
} catch (error) {
  console.error("✗ MongoDB configuration error:", error.message);
  process.exit(1);
}

// ============================================
// MIDDLEWARE
// ============================================

// CORS Configuration - Allow requests from your Next.js frontend
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000", // Update with your frontend URL in production
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type"],
  }),
);

// JSON Parser Middleware
app.use(express.json());

// ============================================
// ROUTES
// ============================================

// Health check endpoint
app.get("/health", (req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;

  res.status(200).json({
    success: true,
    message: "Server is running",
    database: databaseConnected ? "connected" : "disconnected",
  });
});

// Link API routes
app.use("/api/links", linkRoutes);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ============================================
// START SERVER
// ============================================

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("✓ Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`
╔═══════════════════════════════════════╗
║     Link Vault API Server Running     ║
╚═══════════════════════════════════════╝
Port: ${PORT}
Database: ${describeMongoUri(MONGODB_URI)}
Environment: ${process.env.NODE_ENV || "development"}
  `);
    });
  } catch (error) {
    console.error("✗ MongoDB connection error:", error.message);
    process.exit(1);
  }
}

startServer();

export default app;
