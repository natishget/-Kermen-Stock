import express from "express";
import {
  allSalesHandler,
  handleDeleteSales,
  handleEditSales,
  makeSalesHandler,
} from "../controller/sales.controller.js";
import { authenticateAccessToken } from "../middleware/authenticateToken.js";

const router = express.Router();

router.get("/allSales", authenticateAccessToken, allSalesHandler);
router.post("/makeSales", authenticateAccessToken, makeSalesHandler);
router.post("/updateSales", authenticateAccessToken, handleEditSales);
router.post("/deleteSales", authenticateAccessToken, handleDeleteSales);

export default router;
