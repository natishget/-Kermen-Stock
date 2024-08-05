import express from "express";
import {
  allPurchaseHandler,
  makePurchaseHandler,
} from "../controller/purchase.controller.js";

const router = express.Router();

router.get("/allPurchase", allPurchaseHandler);
router.post("/makePurchase", makePurchaseHandler);

export default router;
