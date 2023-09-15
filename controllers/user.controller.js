import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import fs from "fs/promises";
import path from "path";
import Jimp from "jimp";
import User from "../models/user.model.js";
import { JWT_SECRET } from "../config/config.js";
import { sendEmail } from "../utils/sendEmail.js";

const uploadDir = path.join(process.cwd(), "public/data/uploads");

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

    const avatarUrl = gravatar.url(email);
    const verificationToken = jwt.sign(email, JWT_SECRET);
    const newUser = await User.create({
      ...body,
      avatarUrl,
      verificationToken,
    });

    await sendEmail(email, verificationToken);

    return res.status(201).json({
      status: true,
      email: newUser.email,
      subscription: newUser.subscription,
      avatarUrl,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const verify = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;

    const user = await User.findOne({ verificationToken });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User Not Found",
      });
    }

    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: "",
    });

    res.status(200).json({
      message: "Verification successful",
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const resendVerify = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User Not Found",
      });
    }

    if (user.verify)
      return res.status(400).json({
        status: false,
        message: "Verification has already been passed",
      });

    await sendEmail(email, user.verificationToken);
    res.status(200).json({
      message: "Verification email sent",
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
        message: "Missing required fields",
      });
    }

    const user = await User.findOne({ email });

    if (!user.verify) {
      return res.status(401).json({
        status: false,
        message: "Email is not verified",
      });
    }

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
        message: "Password is incorrect",
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

export const updateUserAvatar = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      status: false,
      message: "No file uploaded",
    });
  }

  const id = req.user._id;
  const { path: tempName, originalname } = req.file;

  await Jimp.read(tempName)
    .then((avatar) => {
      return avatar.resize(250, 250).quality(60).write(tempName);
    })
    .catch((error) => {
      throw error;
    });

  const fileName = `${id}_${originalname}`;
  const uplodedFile = path.join(uploadDir, fileName);
  await fs.rename(tempName, uplodedFile);
  const avatarUrl = path.join("avatars", fileName);
  await User.findByIdAndUpdate(id, { avatarUrl });
  res.status(200).json({
    avatarUrl,
  });
};
