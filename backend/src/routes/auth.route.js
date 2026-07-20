import { Router } from "express";

import { register } from "../controllers/auth.controller.js";

import { registerValidator } from "../validators/auth.validator.js";

import { validateFields } from "../middlewares/validation.middleware.js";

const router = Router();

router.post("/register", registerValidator, validateFields, register);

export default router;
