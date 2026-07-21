import { Router } from "express";
import { param, query } from "express-validator";
import { searchVideos, getVideoById } from "../controllers/video.controller.js";
import { validateFields } from "../middlewares/validation.middleware.js";
import { authenticateMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get(
  "/search",
  [
    query("q")
      .trim()
      .notEmpty()
      .withMessage("Search query is required"),
    query("pageToken").optional().trim(),
  ],
  authenticateMiddleware,
  validateFields,
  searchVideos
);

router.get(
  "/:id",
  [
    param("id")
      .trim()
      .notEmpty()
      .withMessage("Video ID is required"),
  ],
  authenticateMiddleware,
  validateFields,
  getVideoById
);

export default router;
