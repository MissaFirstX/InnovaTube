import * as authService from "../services/auth.service.js";

import { successResponse, errorResponse } from "../utils/response.js";

export const register = async (req, res) => {
  try {
    const user = await authService.register(req.body);

    return successResponse(res, "User registered successfully", user, 201);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const login = async (req, res) => {
  try {
    const user = await authService.login(req.body);
    return successResponse(res, "User logged in successfully", user);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const profile = async (req, res) => {
  try {
    const user = await authService.getProfile(req.user.id);
    return successResponse(res, "User profile fetched successfully", user);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};
