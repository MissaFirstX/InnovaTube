import * as favoritesService from "../services/favorites.service.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const listFavorites = async (req, res) => {
  try {
    const favorites = await favoritesService.getUserFavorites(req.user.id);
    return successResponse(res, "Favorites fetched successfully", favorites);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const createFavorite = async (req, res) => {
  try {
    const favorite = await favoritesService.addFavorite(req.user.id, req.body);
    return successResponse(res, "Favorite added successfully", favorite, 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const deleteFavorite = async (req, res) => {
  try {
    const favoriteId = Number(req.params.id);
    const deleted = await favoritesService.removeFavorite(
      req.user.id,
      favoriteId,
    );
    return successResponse(res, "Favorite removed successfully", deleted);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

