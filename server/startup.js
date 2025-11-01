// startup.js
import dotenv from "dotenv";
dotenv.config();

// Dynamically import and run the main server file
import("./server.js");
