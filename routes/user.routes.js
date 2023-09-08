import { Router } from "express";
import { addUserValidation } from "../validators/user.validator.js";
import {
  login,
  signup,
  logout,
  currentUser,
  updateUserSubscription,
} from "../controllers/user.controller.js";
import { authenticateUser } from "../middlewares/authenticateUser.js";

export const userRouter = Router();

userRouter.post("/signup", addUserValidation, signup);

userRouter.post("/login", login);

userRouter.post("/logout", authenticateUser, logout);

userRouter.get("/current", authenticateUser, currentUser);

userRouter.patch("/users", authenticateUser, updateUserSubscription);
