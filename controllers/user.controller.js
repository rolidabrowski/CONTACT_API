import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config.js";
import User from "../models/user.model.js";

export const signup = async (req, res, next) => {
  try {
    const body = req.body;
    const { email } = body;

    const user = await User.findOne({ email });

    if (user) {
      return res.status(409).json({
        status: false,
        message: "User with this email already exists",
      });
    }

    const newUser = await User.create(body);
    return res.status(201).json({
      status: true,
      email: newUser.email,
      subscription: newUser.subscription,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "Incorrect login or password",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        status: false,
        message: "Email or password is incorrect",
      });
    }

    const passwordIsValid = await user.isValidPassword(password);

    if (!passwordIsValid) {
      return res.status(401).json({
        status: false,
        message: "Email or password is incorrect",
      });
    }

    const body = {
      email: user.email,
      subscription: user.subscription,
      _id: user._id,
    };

    const validityPeroid = "1h";

    const token = jwt.sign(body, JWT_SECRET, { expiresIn: validityPeroid });

    await User.findByIdAndUpdate(user._id, { token });
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const id = req.user._id;
    await User.findByIdAndUpdate(id, { token: "" });
    res.status(204).json({
      status: true,
      message: "Logout success",
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const currentUser = async (req, res) => {
  const { email, subscription } = req.user;
  res.status(200).json({
    status: true,
    email,
    subscription,
  });
};

export const updateUserSubscription = async (req, res, next) => {
  try {
    const body = req.body;
    const id = req.user._id;
    const user = await User.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "Not Found",
      });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};
