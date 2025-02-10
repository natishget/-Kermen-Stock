import express from "express";
import {
  allPurchaseHandler,
  handleEditPurchase,
  makePurchaseHandler,
} from "../controller/purchase.controller.js";

const router = express.Router();

router.get("/allPurchase", allPurchaseHandler);
router.post("/makePurchase", makePurchaseHandler);
router.post("/editPurchase", handleEditPurchase);
router.post("/deletePurchase", handleEditPurchase);

export default router;
