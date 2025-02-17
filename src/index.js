// Import required dependencies
// import "../instrument.js";  // Ensure instrument.js is compatible with ES modules
import express from "express";
// import * as Sentry from "@sentry/node";
import userRoutes from "./routes/userRoutes.js";  // Ensure the path is correct

const app = express();
app.use(express.json()); // Middleware to parse JSON request body

// Initialize Sentry with your DSN (Data Source Name)
// Sentry.init({ dsn: process.env.SENTRY_DSN });

// Sentry error handler (must be registered early in the middleware stack)
// app.use(Sentry.Handlers.requestHandler());
// app.use(Sentry.Handlers.errorHandler());

// Define routes
app.use("/users", userRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Hello world!");
});

// Fallback error handler
app.use((err, req, res, next) => {
//   res.status(500).send(res.sentry + "\n");
	console.log("res error:", res)
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});