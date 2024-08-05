import express from "express";
import cors from "cors";
import authRoute from "./routes/auth.route.js";
import salesRoute from "./routes/sales.route.js";
import purchaseRoute from "./routes/purchase.route.js";
import inventoryRoute from "./routes/inventory.route.js";
import allDataRoute from "./routes/allData.route.js";

import bcrypt from "bcrypt";

const app = express();

// Middleware, routes, etc.
// For example, you can use express.json() to parse JSON bodies
app.use(express.json());
app.use(
  cors({
    origin: true, // Allows any origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allows any method
    credentials: true, // Allows cookies and other credentials
  })
);
app.use("/api/auth", authRoute);
app.use("/api/sales", salesRoute);
app.use("/api/purchase", purchaseRoute);
app.use("/api/inventory", inventoryRoute);
app.use("/api/getData", allDataRoute);

app.listen(8800, () => {
  console.log("Connected to backend on port 8800.");
});

console.log("server is running");

// console.log(await bcrypt.hash("123456", 10));
