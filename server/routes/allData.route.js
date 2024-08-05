import express from "express";
import getAllDataHandler from "../controller/allData.controller.js";

const router = express.Router();

router.get("/allData", getAllDataHandler);

export default router;
