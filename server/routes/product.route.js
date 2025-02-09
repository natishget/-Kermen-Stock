import express from "express";
import {
  addNewProduct,
  getProducts,
} from "../controller/product.controller.js";

import { authenticateAccessToken } from "../middleware/authenticateToken.js";

const router = express.Router();

router.post("/newProduct", authenticateAccessToken, addNewProduct);
router.get("/getProducts", authenticateAccessToken, getProducts);

export default router;
