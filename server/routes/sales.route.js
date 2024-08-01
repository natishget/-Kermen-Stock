import express from "express";
import {
  allSalesHandler,
  makeSalesHandler,
} from "../controller/sales.controller.js";
const router = express.Router();

router.get("/allSales", allSalesHandler);
router.post("/makeSales", makeSalesHandler);

export default router;
