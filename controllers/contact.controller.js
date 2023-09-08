import Contact from "../models/contact.model.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { page = 1, limit = 20, favorite } = req.query;
    const skip = (page - 1) * limit;
    const result = await Contact.find(
      favorite ? { owner, favorite } : { owner },
      "-createdAt -updatedAt",
      {
        skip,
        limit: Number(limit),
      }
    ).populate("owner", "email subscription", "User");
    return res.status(200).json(result);
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const getContactById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const result = await Contact.findOne({ _id: id, owner });
    if (!result) {
      return res.status(404).json({ message: "Not Found" });
    }
    return res.status(200).json(result);
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const addContact = async (req, res, next) => {
  try {
    const { body } = req;
    const { _id: owner } = req.user;
    const result = await Contact.create({ ...body, owner });
    return res.status(201).json(result);
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const { _id: owner } = req.user;
    const result = await Contact.findOneAndUpdate({ _id: id, owner }, body, {
      new: true,
    });
    if (!result) {
      return res.status(404).json({ message: "Not Found" });
    }
    return res.status(200).json(result);
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const updateContactStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const { _id: owner } = req.user;
    const result = await Contact.findOneAndUpdate({ _id: id, owner }, body, {
      new: true,
    });
    if (!result) {
      return res.status(404).json({ message: "Not Found" });
    }
    return res.status(200).json(result);
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const removeContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const result = await Contact.findOneAndRemove({
      _id: id,
      owner,
    });
    if (!result) {
      return res.status(404).json({ message: "Not Found" });
    }
    return res.status(200).json({ message: "Contact deleted" });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};
