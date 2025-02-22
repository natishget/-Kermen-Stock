import express from "express";
import {
  getAdminInfo,
  loginHandler,
  logoutHandler,
  createUserHandler,
} from "../controller/auth.controller.js";
import { authenticateAccessToken } from "../middleware/authenticateToken.js";

const router = express.Router();

router.post("/login", loginHandler);
router.get("/logout", logoutHandler);
router.get("/protectedRoute", authenticateAccessToken, getAdminInfo);
router.post("/createUser", authenticateAccessToken, createUserHandler);

export default router;
