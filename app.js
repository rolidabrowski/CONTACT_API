import express from "express";
import logger from "morgan";
import cors from "cors";
import { contactsRouter } from "./routes/contact.routes.js";
import { userRouter } from "./routes/user.routes.js";

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  return res.status(200).json({
    status: true,
    message: "Hello World",
  });
});

app.get("*", (req, res) => {
  return res.status(404).json({
    status: false,
    message: "Not found",
  });
});

export default app;
