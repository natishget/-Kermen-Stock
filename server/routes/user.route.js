import express from "express";
import { allUsers } from "../controller/user.controller.js";
import { authenticateAccessToken } from "../middleware/authenticateToken.js";

const router = express.Router();

router.get("/getAllUsers", authenticateAccessToken, allUsers);

export default router;
