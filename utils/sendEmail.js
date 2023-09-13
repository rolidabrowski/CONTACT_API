// import nodemailer from "nodemailer";
import sgMail from "@sendgrid/mail";
import { SENDGRID_API_EMAIL, SENDGRID_API_KEY } from "../config/config.js";

sgMail.setApiKey(SENDGRID_API_KEY);

export const sendEmail = async (email, verificationToken) => {
  const msg = {
    to: email,
    from: SENDGRID_API_EMAIL,
    subject: "Confirm your email",
    html: `<a href="http://localhost:3000/api/user/verify/${verificationToken}">Click here to verify your email</a>`,
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent");
  } catch (error) {
    console.log(error.message);
  }
};
