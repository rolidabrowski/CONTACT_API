import { Router } from "express";
import { authenticateUser } from "../middlewares/authenticateUser.js";
import {
  getAllContacts,
  getContactById,
  addContact,
  updateContact,
  updateContactStatus,
  removeContact,
} from "../controllers/contact.controller.js";
import {
  addContactValidation,
  updateContactValidation,
} from "../validators/contact.validator.js";

export const contactsRouter = Router();

contactsRouter.get("/", authenticateUser, getAllContacts);

contactsRouter.get("/:id", authenticateUser, getContactById);

contactsRouter.post("/", authenticateUser, addContactValidation, addContact);

contactsRouter.delete("/:id", authenticateUser, removeContact);

contactsRouter.put(
  "/:id",
  authenticateUser,
  updateContactValidation,
  updateContact
);
contactsRouter.patch("/:id/favorite", authenticateUser, updateContactStatus);
