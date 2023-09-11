import Joi from "joi";

const userAddSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  subscription: Joi.string().default("starter"),
  token: Joi.string().default(""),
});

export const addUserValidation = async (req, res, next) => {
  const userPayLoad = req.body;
  try {
    await userAddSchema.validateAsync(userPayLoad);
    next();
  } catch (error) {
    next({
      status: 400,
      message: error.details[0].message,
    });
  }
};
