import { searchYouTubeVideos, getYouTubeVideoById } from "../services/youtube.service.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const searchVideos = async (req, res) => {
  try {
    const { q, pageToken } = req.query;
    const data = await searchYouTubeVideos(q, pageToken);
    return successResponse(res, "YouTube videos fetched successfully", data);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await getYouTubeVideoById(id);
    return successResponse(res, "YouTube video fetched successfully", data);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};