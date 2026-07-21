import { Router } from "express";
import { body, param } from "express-validator";
import {
  listFavorites,
  createFavorite,
  deleteFavorite,
} from "../controllers/favorites.controller.js";
import { validateFields } from "../middlewares/validation.middleware.js";
import { authenticateMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticateMiddleware);

router.get("/", authenticateMiddleware, listFavorites);

router.post(
  "/",
  [
    body("videoId")
      .trim()
      .notEmpty()
      .withMessage("videoId is required"),
  ],
  authenticateMiddleware,
  validateFields,
  createFavorite
);

router.delete(
  "/:id",
  [
    param("id")
      .isInt({ gt: 0 })
      .withMessage("Favorite id must be a positive integer"),
  ],
  authenticateMiddleware,
  validateFields,
  deleteFavorite
);

export default router;
