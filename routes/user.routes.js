import { Router } from "express";
import { addUserValidation } from "../validators/user.validator.js";
import { login, signup } from "../controllers/user.controller.js";

export const userRouter = Router();

userRouter.post("/signup", addUserValidation, signup);

userRouter.post("/login", login);
