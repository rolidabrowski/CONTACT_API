import { Router } from "express";
import {
  validateUser,
  validateLogin,
  validateVerifyUser,
} from "../validators/user.validator.js";
import {
  login,
  verify,
  resendVerify,
  signup,
  logout,
  currentUser,
  updateUserSubscription,
  updateUserAvatar,
} from "../controllers/user.controller.js";
import { authenticateUser } from "../middlewares/authenticateUser.js";
import { uploadUserAvatar } from "../middlewares/uploadUserAvatar.js";

export const userRouter = Router();

userRouter.post("/signup", validateUser, signup);

userRouter.get("/verify/:verificationToken", verify);

userRouter.post("/verify", validateVerifyUser, resendVerify);

userRouter.post("/login", validateLogin, login);

userRouter.post("/logout", authenticateUser, logout);

userRouter.get("/current", authenticateUser, currentUser);

userRouter.patch("/users", authenticateUser, updateUserSubscription);

userRouter.patch(
  "/avatars",
  authenticateUser,
  uploadUserAvatar,
  updateUserAvatar
);
