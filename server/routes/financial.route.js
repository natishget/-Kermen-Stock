import express from "express";
import { authenticateAccessToken } from "../middleware/authenticateToken.js";
import { calculateCOGSAndProfit } from "../controller/financial.controller.js";

const router = express.Router();

router.get("/financialData", calculateCOGSAndProfit);

export default router;
