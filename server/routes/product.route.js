import express from "express";
import {
  addNewProduct,
  getProducts,
  // handleFileRead,
} from "../controller/product.controller.js";

import { authenticateAccessToken } from "../middleware/authenticateToken.js";

const router = express.Router();

router.post("/newProduct", authenticateAccessToken, addNewProduct);
router.get("/getProducts", authenticateAccessToken, getProducts);
// router.get("/readFile", handleFileRead);

export default router;
