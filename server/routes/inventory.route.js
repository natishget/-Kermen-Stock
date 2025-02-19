import express from "express";
import { handleInventoryLevel } from "../controller/inventory.controller.js";
import { authenticateAccessToken } from "../middleware/authenticateToken.js";

const router = express.Router();

router.get("/inventoryLevel", authenticateAccessToken, handleInventoryLevel);

export default router;
