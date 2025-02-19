import express from "express";
import {
  allPurchaseHandler,
  handleEditPurchase,
  makePurchaseHandler,
} from "../controller/purchase.controller.js";
import { authenticateAccessToken } from "../middleware/authenticateToken.js";

const router = express.Router();

router.get("/allPurchase", authenticateAccessToken, allPurchaseHandler);
router.post("/makePurchase", authenticateAccessToken, makePurchaseHandler);
router.post("/editPurchase", authenticateAccessToken, handleEditPurchase);
router.post("/deletePurchase", authenticateAccessToken, handleEditPurchase);

export default router;
