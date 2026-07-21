import { Router } from "express";

import { register, login, profile } from "../controllers/auth.controller.js";

import {
  registerValidator,
  loginValidator,
} from "../validators/auth.validator.js";

import { validateFields } from "../middlewares/validation.middleware.js";
import { authenticateMiddleware } from "../middlewares/auth.middleware.js";
import { authLimiter } from "../middlewares/rateLimit.middleware.js";

const router = Router();

router.post("/register", registerValidator, authLimiter, validateFields, register);
router.post("/login", loginValidator, authLimiter, validateFields, login);
router.get("/me", authenticateMiddleware, profile);

export default router;
