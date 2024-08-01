import express from "express";
import { handleInventoryLevel } from "../controller/inventory.controller.js";

const router = express.Router();

router.get("/inventoryLevel", handleInventoryLevel);

export default router;
