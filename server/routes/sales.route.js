import express from "express";
import {
  allSalesHandler,
  handleDeleteSales,
  handleEditSales,
  makeSalesHandler,
} from "../controller/sales.controller.js";
const router = express.Router();

router.get("/allSales", allSalesHandler);
router.post("/makeSales", makeSalesHandler);
router.post("/updateSales", handleEditSales);
router.post("/deleteSales", handleDeleteSales);

export default router;
