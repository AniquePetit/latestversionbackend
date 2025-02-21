import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import * as Sentry from "@sentry/node";

// Importeer de routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import hostRoutes from "./routes/hostRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import amenityRoutes from "./routes/amenityRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

// Importeer de middleware voor authenticatie
import { authenticate } from "./middleware/authMiddleware.js";

dotenv.config(); // Laadt de omgevingsvariabelen

const app = express();

// Initialiseer Sentry voor foutopsporing
Sentry.init({ dsn: process.env.SENTRY_DSN });

// Middleware voor Sentry error handling
app.use(Sentry.Handlers.requestHandler());

// Algemene middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json()); // Zorgt ervoor dat de server JSON-data kan ontvangen

// Openbare routes (authenticatie route voor login)
app.use("/api", authRoutes);  // POST /api/login

// Beveiligde routes
app.use("/api/users", authenticate, userRoutes); 
app.use("/api/hosts", authenticate, hostRoutes);
app.use("/api/properties", authenticate, propertyRoutes);
app.use("/api/amenities", authenticate, amenityRoutes);
app.use("/api/bookings", authenticate, bookingRoutes);
app.use("/api/reviews", authenticate, reviewRoutes);

// Algemene statuscode route
app.get("/api/status", (req, res) => res.json({ status: "OK" }));

// Sentry foutafhandelingsmiddleware
app.use(Sentry.Handlers.errorHandler());

// Algemene foutafhandeling (voor als er iets misgaat in de server)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Fallback voor ongeldige routes (404)
app.use((req, res) => res.status(404).json({ error: "Route not found" }));

// Start de server op de aangegeven poort
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
