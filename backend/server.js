import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import authRoutes from "./src/routes/auth.js";
import orderRoutes from "./src/routes/orders.js";
import paymentRoutes from "./src/routes/payments.js";
import adminRoutes from "./src/routes/admin.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ======================================================
// ✅ CORS CONFIGURATION (FIXED FOR Orderion PRODUCTION)
// ======================================================
const allowedOrigins = [
  "http://localhost:5173",          // Local dev
  "https://orderion.github.io"      // Production frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow server-to-server requests (Postman, curl, health checks)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS blocked: ${origin} not allowed`),
        false
      );
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ======================================================
// MIDDLEWARE
// ======================================================
app.use(express.json());
app.use(cookieParser());

// ======================================================
// HEALTH CHECK
// ======================================================
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Orderion API",
    timestamp: new Date().toISOString(),
  });
});

// ======================================================
// ROUTES
// ======================================================
app.use("/auth", authRoutes);
app.use("/orders", orderRoutes);
app.use("/payments", paymentRoutes);
app.use("/admin", adminRoutes);

// ======================================================
// ERROR HANDLER
// ======================================================
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.message);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

// ======================================================
// 404 HANDLER
// ======================================================
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ======================================================
// START SERVER
// ======================================================
app.listen(PORT, () => {
  console.log(`🚀 Orderion backend running on port ${PORT}`);
});
