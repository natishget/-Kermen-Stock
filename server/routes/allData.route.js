import express from "express";
import getAllDataHandler from "../controller/allData.controller.js";
import { authenticateAccessToken } from "../middleware/authenticateToken.js";

const router = express.Router();

router.get("/allData", authenticateAccessToken, getAllDataHandler);

export default router;
