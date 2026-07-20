import { Router } from "express";

import { register, login } from "../controllers/auth.controller.js";

import {
  registerValidator,
  loginValidator,
} from "../validators/auth.validator.js";

import { validateFields } from "../middlewares/validation.middleware.js";

const router = Router();

router.post("/register", registerValidator, validateFields, register);
router.post("/login", loginValidator, validateFields, login);

export default router;
