import express from "express";
import {
  allPurchaseHandler,
  handleDeletePurchase,
  handleEditPurchase,
  makePurchaseHandler,
} from "../controller/purchase.controller.js";
import { authenticateAccessToken } from "../middleware/authenticateToken.js";

const router = express.Router();

router.get("/allPurchase", authenticateAccessToken, allPurchaseHandler);
router.post("/makePurchase", authenticateAccessToken, makePurchaseHandler);
router.post("/editPurchase", authenticateAccessToken, handleEditPurchase);
router.post("/deletePurchase", authenticateAccessToken, handleDeletePurchase);

export default router;
