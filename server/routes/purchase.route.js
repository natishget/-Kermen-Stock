import express from "express";
import { allPurchaseHandler } from "../controller/purchase.controller.js";

const router = express.Router();

router.get("/allPurchase", allPurchaseHandler);

export default router;
