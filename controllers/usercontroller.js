import User from "../models/usermodel.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

class UserController {
  async testUser(req, res, next) {
    try {
      const name = "Test User";
      const email = "test@example.com";
      const password = "Test@123";

      await User.findOneAndDelete({ email });

      const user = await User.create({ name, email, password });

      const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
      );

      if (!createdUser) {
        return next(new ApiError(400, "User not found after creation"));
      }

      return res
        .status(201)
        .json(
          new ApiResponse(201, createdUser, "Test user created successfully")
        );
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
