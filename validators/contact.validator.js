import Joi from "joi";

export const contactAddSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(6).required(),
  favorite: Joi.boolean().default(false),
  owner: Joi.types.ObjectId().ref("user").required(),
  versionKey: false,
  timestamp: true,
});

export const contactUpdateSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().min(6).optional(),
  favorite: Joi.boolean().optional(),
  owner: Joi.types.ObjectId().ref("user"),
  versionKey: false,
  timestamp: true,
});

const addContactValidation = async (req, res, next) => {
  const contactPayLoad = req.body;
  try {
    await contactAddSchema.validateAsync(contactPayLoad);
    next();
  } catch (error) {
    next({
      status: 400,
      message: error.details[0].message,
    });
  }
};

const updateContactValidation = async (req, res, next) => {
  const contactPayLoad = req.body;
  try {
    await contactUpdateSchema.validateAsync(contactPayLoad);
    next();
  } catch (error) {
    next({
      status: 400,
      message: error.details[0].message,
    });
  }
};

export default { addContactValidation, updateContactValidation };
