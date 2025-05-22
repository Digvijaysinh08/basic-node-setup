import jwt from "jsonwebtoken";
import User from "../models/usermodel.js";
import ApiError from "../utils/ApiError.js";

class AuthMiddleware {
  static async verifyJWT(req, res, next) {
    try {
      const token = req.cookies?.accessToken || req.headers?.authorization?.split(" ")[1];

      if (!token) {
        return next(new ApiError(401, "Unauthorized request: No token provided"));
      }

      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      const user = await User.findById(decodedToken._id).select("-password -refreshToken");

      if (!user) {
        return next(new ApiError(401, "Invalid Access Token: User not found"));
      }

      req.user = user;
      next();
    } catch (error) {
      return next(new ApiError(401, "Unauthorized: Invalid Token"));
    }
  }
}

export default AuthMiddleware;
