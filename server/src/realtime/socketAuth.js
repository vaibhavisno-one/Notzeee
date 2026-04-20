import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

const extractToken = (socket) => {
    const authHeader = socket.handshake.headers?.authorization;
    if (authHeader?.startsWith("Bearer ")) {
        return authHeader.replace("Bearer ", "");
    }

    const authToken = socket.handshake.auth?.token;
    if (authToken) {
        return authToken.replace("Bearer ", "");
    }

    return null;
};

export const socketAuthMiddleware = async (socket, next) => {
    try {
        const token = extractToken(socket);
        if (!token) {
            return next(new ApiError(401, "Unauthorized"));
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken._id).select("-password -refreshToken");

        if (!user) {
            return next(new ApiError(401, "User not found"));
        }

        socket.user = user;
        return next();
    } catch (error) {
        return next(new ApiError(401, error?.message || "Invalid Access Token"));
    }
};
