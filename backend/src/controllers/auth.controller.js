import * as authService from "../services/auth.service.js";

import {
    successResponse,
    errorResponse
} from "../utils/response.js";

export const register = async (req, res) => {

    try {

        const user = await authService.register(req.body);

        return successResponse(
            res,
            "User registered successfully",
            user,
            201
        );

    } catch (error) {

        return errorResponse(
            res,
            error.message
        );

    }

};